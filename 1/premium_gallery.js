// Remove the subscription toggle element and local 'isSubscriber' variable entirely
// We will determine subscription status from the API call

(() => {
    // === API and State Management ===

    // The user object will store the state fetched from the API
    let currentUser = null; 

    // Helper to fetch user profile using the stored token
    async function fetchUserProfile() {
        // Retrieve JWT token from local storage (or cookie/session in a real app)
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.log("No auth token found. User is a visitor.");
            return null; // Not logged in
        }

        try {
            const res = await fetch('/api/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) {
                // Token invalid or expired - clear it
                localStorage.removeItem('authToken');
                console.error("Token failed validation or expired. Cleared token.");
                return null;
            }

            const user = await res.json();
            currentUser = user;
            console.log(`User fetched. Status: ${user.subscriptionStatus}`);
            return user;

        } catch (error) {
            console.error('Error fetching user profile:', error);
            return null;
        }
    }

    // === Gallery and Modal Logic (Original Code Updated) ===

    const modalOverlay = document.querySelector('.modal-overlay');
    const modalCloseBtn = modalOverlay.querySelector('.modal-close-btn');
    const modalTitle = modalOverlay.querySelector('#modal-title');
    const modalDesc = modalOverlay.querySelector('#modal-desc');
    const imageContainer = modalOverlay.querySelector('.image-container');
    const modalImage = imageContainer.querySelector('img');
    const infoText = document.querySelector('.info-text');

    // Gallery package data (same as before)
    const packages = [
        // ... (Package definitions remain here) ...
        {
          title: "Package One",
          description: "Abstract glitch art with neon vibes.",
          thumb: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=600&q=80",
          fullImage: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=1200&q=90"
        },
        {
          title: "Package Two",
          description: "Retro 80s synthwave inspired designs.",
          thumb: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=600&q=80",
          fullImage: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=90"
        },
        {
          title: "Package Three",
          description: "Cyberpunk cityscapes and neon lights.",
          thumb: "https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb?auto=format&fit=crop&w=600&q=80",
          fullImage: "https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb?auto=format&fit=crop&w=1200&q=90"
        }
    ];
    
    // --- OPEN MODAL FUNCTION UPDATED ---
    function openModal(pkgIndex) {
        const pkg = packages[pkgIndex];
        const isSubscriber = currentUser && currentUser.subscriptionStatus === 'subscriber';

        modalTitle.textContent = pkg.title;
        modalDesc.textContent = pkg.description;
        modalImage.src = ''; 
        modalImage.alt = `${pkg.title} full graphic preview`;
        
        // Reset image position
        modalImage.style.transform = '';
        modalImage.style.top = '0px';
        modalImage.style.left = '0px';
        enableDrag(false); // Disable dragging initially

        // Load full image
        modalImage.src = pkg.fullImage;
        
        modalImage.onload = () => {
            if (isSubscriber) {
                // Subscriber: Show full image (no zoom, not draggable)
                modalImage.style.position = 'relative';
                modalImage.style.width = '100%';
                modalImage.style.height = 'auto';
                infoText.textContent = "Full resolution package. Enjoy!";

            } else {
                // Visitor: Show zoomed partial section, draggable to encourage subscription
                modalImage.style.position = 'absolute';
                const zoom = 2; // 2x zoom for visitors
                modalImage.style.width = (modalImage.naturalWidth * zoom) + 'px';
                modalImage.style.height = (modalImage.naturalHeight * zoom) + 'px';
                
                // Position to show center of the image, then enable drag
                const containerRect = imageContainer.getBoundingClientRect();
                const initialLeft = (containerRect.width / 2) - (modalImage.naturalWidth * zoom / 2);
                const initialTop = (containerRect.height / 2) - (modalImage.naturalHeight * zoom / 2);
                
                modalImage.style.left = `${initialLeft}px`;
                modalImage.style.top = `${initialTop}px`;
                
                enableDrag(true);
                infoText.textContent = "Zoomed preview. Subscribe for full, high-resolution access!";
            }
            
            modalOverlay.classList.add('active');
            modalCloseBtn.focus();
        };
    }

    // --- Close Modal & Dragging Logic (Remains the same) ---
    function closeModal() {
        modalOverlay.classList.remove('active');
        modalImage.src = '';
        enableDrag(false);
    }
    
    // ... (The drag state variables and dragStart, dragEnd, dragMove, enableDrag functions remain here) ...
    let dragState = {
        active: false, startX: 0, startY: 0, imgStartLeft: 0, imgStartTop: 0
    };

    function enableDrag(enable) {
        // ... (Your original enableDrag logic) ...
        if (enable) {
            modalImage.style.cursor = 'grab';
            modalImage.addEventListener('pointerdown', dragStart);
            window.addEventListener('pointerup', dragEnd);
            window.addEventListener('pointermove', dragMove);
        } else {
            modalImage.style.cursor = 'default';
            modalImage.removeEventListener('pointerdown', dragStart);
            window.removeEventListener('pointerup', dragEnd);
            window.removeEventListener('pointermove', dragMove);
        }
    }

    function dragStart(e) {
        // ... (Your original dragStart logic) ...
        e.preventDefault();
        dragState.active = true;
        dragState.startX = e.clientX;
        dragState.startY = e.clientY;
        dragState.imgStartLeft = parseInt(modalImage.style.left) || 0;
        dragState.imgStartTop = parseInt(modalImage.style.top) || 0;
        modalImage.style.cursor = 'grabbing';
    }

    function dragEnd(e) {
        // ... (Your original dragEnd logic) ...
        if (!dragState.active) return;
        dragState.active = false;
        modalImage.style.cursor = 'grab';
    }

    function dragMove(e) {
        // ... (Your original dragMove logic, including boundary checks) ...
        if (!dragState.active) return;
        e.preventDefault();

        const dx = e.clientX - dragState.startX;
        const dy = e.clientY - dragState.startY;

        let newLeft = dragState.imgStartLeft + dx;
        let newTop = dragState.imgStartTop + dy;

        const containerRect = imageContainer.getBoundingClientRect();
        const imgRect = modalImage.getBoundingClientRect();

        const maxLeft = 0;
        const maxTop = 0;
        const minLeft = containerRect.width - imgRect.width;
        const minTop = containerRect.height - imgRect.height;

        if (minLeft > maxLeft) { // Handle case where image is smaller than container
            newLeft = initialLeft;
        } else {
            if (newLeft > maxLeft) newLeft = maxLeft;
            if (newLeft < minLeft) newLeft = minLeft;
        }

        if (minTop > maxTop) {
            newTop = initialTop;
        } else {
            if (newTop > maxTop) newTop = maxTop;
            if (newTop < minTop) newTop = minTop;
        }
        
        modalImage.style.left = newLeft + 'px';
        modalImage.style.top = newTop + 'px';
    }

    // --- Initialization and Event Listeners ---
    
    // 1. Initial Profile Fetch to set access level
    fetchUserProfile();

    // 2. Event listeners for gallery packages
    const packageElements = document.querySelectorAll('.package');
    packageElements.forEach((elem, index) => {
        elem.addEventListener('click', () => openModal(index));
        elem.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(index);
            }
        });
    });

    // 3. Close modal listeners (same as before)
    modalCloseBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });
})();
