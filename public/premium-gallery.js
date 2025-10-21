// public/premium-gallery.js

(() => {
    // --- API and State Management ---
    let currentUser = null; 
    
    // Check local storage for the JWT token
    const token = localStorage.getItem('authToken');

    // Helper to fetch user profile using the stored token
    async function fetchUserProfile() {
        if (!token) {
            console.log("No auth token found. User is a visitor.");
            // Update the UI element that was previously the toggle
            const statusEl = document.getElementById('user-status-display');
            if (statusEl) statusEl.textContent = 'Status: Visitor (Please Login)';
            return null;
        }

        try {
            const res = await fetch('/api/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) {
                localStorage.removeItem('authToken'); // Token invalid
                console.error("Token failed validation. Cleared token.");
                return null;
            }

            const user = await res.json();
            currentUser = user;
            
            // Update UI status element
            const statusEl = document.getElementById('user-status-display');
            if (statusEl) statusEl.textContent = `Status: ${user.subscriptionStatus.toUpperCase()}`;
            
            return user;

        } catch (error) {
            console.error('Error fetching user profile:', error);
            return null;
        }
    }

    // --- DOM Elements & Package Data ---
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalCloseBtn = modalOverlay.querySelector('.modal-close-btn');
    const modalTitle = modalOverlay.querySelector('#modal-title');
    const modalDesc = modalOverlay.querySelector('#modal-desc');
    const imageContainer = modalOverlay.querySelector('.image-container');
    const modalImage = imageContainer.querySelector('img');
    const infoText = document.querySelector('.info-text');

    const packages = [
        // Using your package definitions here
        {
          title: "Package One", description: "Abstract glitch art with neon vibes.",
          thumb: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=600&q=80",
          fullImage: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=1200&q=90"
        },
        {
          title: "Package Two", description: "Retro 80s synthwave inspired designs.",
          thumb: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=600&q=80",
          fullImage: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=90"
        },
        {
          title: "Package Three", description: "Cyberpunk cityscapes and neon lights.",
          thumb: "https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb?auto=format&fit=crop&w=600&q=80",
          fullImage: "https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb?auto=format&fit=crop&w=1200&q=90"
        }
    ];
    
    // --- OPEN MODAL FUNCTION: Core Logic ---
    function openModal(pkgIndex) {
        const pkg = packages[pkgIndex];
        // Check access level
        const isSubscriber = currentUser && currentUser.subscriptionStatus === 'subscriber';

        modalTitle.textContent = pkg.title;
        modalDesc.textContent = pkg.description;
        modalImage.src = ''; 
        modalImage.alt = `${pkg.title} full graphic preview`;
        
        // Reset image position
        modalImage.style.transform = '';
        modalImage.style.top = '0px';
        modalImage.style.left = '0px';
        enableDrag(false); 

        // Load full image
        modalImage.src = pkg.fullImage;
        
        modalImage.onload = () => {
            if (isSubscriber) {
                // SUBSCRIBER VIEW: Full image, non-draggable
                modalImage.style.position = 'relative';
                modalImage.style.width = '100%';
                modalImage.style.height = 'auto';
                infoText.textContent = `Full resolution package available for ${currentUser.email}. Enjoy!`;

            } else {
                // VISITOR VIEW: Zoomed partial section, draggable
                modalImage.style.position = 'absolute';
                const zoom = 2; // 2x zoom for visitors
                modalImage.style.width = (modalImage.naturalWidth * zoom) + 'px';
                modalImage.style.height = (modalImage.naturalHeight * zoom) + 'px';
                
                // Position to show the center of the image
                const containerRect = imageContainer.getBoundingClientRect();
                const initialLeft = (containerRect.width / 2) - (modalImage.naturalWidth * zoom / 2);
                const initialTop = (containerRect.height / 2) - (modalImage.naturalHeight * zoom / 2);
                
                modalImage.style.left = `${initialLeft}px`;
                modalImage.style.top = `${initialTop}px`;
                
                enableDrag(true);
                infoText.textContent = "Zoomed preview. Log in or Subscribe for full, high-resolution access!";
            }
            
            modalOverlay.classList.add('active');
            modalCloseBtn.focus();
        };
    }

    // --- Dragging Logic (Remains mostly the same) ---
    function closeModal() {
        modalOverlay.classList.remove('active');
        modalImage.src = '';
        enableDrag(false);
    }
    
    let dragState = {
        active: false, startX: 0, startY: 0, imgStartLeft: 0, imgStartTop: 0
    };

    function enableDrag(enable) {
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
        e.preventDefault();
        // Prevent drag on full subscriber view
        if (currentUser && currentUser.subscriptionStatus === 'subscriber') return; 
        
        dragState.active = true;
        dragState.startX = e.clientX;
        dragState.startY = e.clientY;
        dragState.imgStartLeft = parseInt(modalImage.style.left) || 0;
        dragState.imgStartTop = parseInt(modalImage.style.top) || 0;
        modalImage.style.cursor = 'grabbing';
    }

    function dragEnd(e) {
        if (!dragState.active) return;
        dragState.active = false;
        modalImage.style.cursor = 'grab';
    }

    function dragMove(e) {
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

        // Boundary checks to keep image visible within the container
        if (newLeft > maxLeft) newLeft = maxLeft;
        if (newLeft < minLeft) newLeft = minLeft;
        if (newTop > maxTop) newTop = maxTop;
        if (newTop < minTop) newTop = minTop;
        
        modalImage.style.left = newLeft + 'px';
        modalImage.style.top = newTop + 'px';
    }


    // --- Initialization ---
    
    // 1. Initial Profile Fetch to set access level on load
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

    // 3. Close modal listeners
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
