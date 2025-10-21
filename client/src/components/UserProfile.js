import React, { useEffect, useState } from 'react';

const THEMES = ['light', 'dark', 'green', 'pink'];

/**
 * UserProfile component fetches user info, allows editing bio, avatar, social links,
 * and theme selection. Applies theme dynamically to the document body.
 */
function UserProfile({ token }) { // <-- Accepts token as a prop
  const [profile, setProfile] = useState({
    email: '', // Use email
    bio: '',
    avatarUrl: '',
    socialLinks: {},
    theme: 'light',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user profile on mount
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }, // <-- Use token prop
        });
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();

        setProfile({
          email: data.email || '', // Use email
          bio: data.bio || '',
          avatarUrl: data.avatarUrl || '',
          socialLinks: data.socialLinks || {},
          theme: data.theme || 'light',
        });

        // Apply theme class to body
        document.body.className = `theme-${data.theme || 'light'}`;
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    if (token) {
      fetchProfile();
    }
  }, [token]);

  // Handle input changes for controlled form inputs
  function handleChange(event) {
    const { name, value } = event.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  }

  // Handle social links input changes
  function handleSocialChange(event) {
    const { name, value } = event.target;
    setProfile(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value,
      },
    }));
  }

  // Handle theme change immediately
  function handleThemeChange(event) {
    const newTheme = event.target.value;
    setProfile(prev => ({ ...prev, theme: newTheme }));
    document.body.className = `theme-${newTheme}`;
  }

  // Save profile to backend
  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // <-- Use token prop
        },
        body: JSON.stringify(profile),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save profile');
      }
      setSaving(false);
      alert('Profile updated successfully!');
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p role="alert">Error: {error}</p>;

  return (
    <section aria-labelledby="profile-heading" className="profile-container">
      <h1 id="profile-heading">{profile.email}'s Profile</h1> {/* Use email */}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="bio">Bio:</label>
          <textarea
            id="bio"
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            rows="4"
            cols="50"
            placeholder="Tell us about yourself"
          />
        </div>

        <div>
          <label htmlFor="avatarUrl">Avatar URL:</label>
          <input
            type="url"
            id="avatarUrl"
            name="avatarUrl"
            value={profile.avatarUrl}
            onChange={handleChange}
            placeholder="https://example.com/avatar.jpg"
          />
        </div>

        <fieldset>
          <legend>Social Links:</legend>
          <div>
            <label htmlFor="twitter">Twitter:</label>
            <input
              type="text" // Use text, as URL type is strict
              id="twitter"
              name="twitter"
              value={profile.socialLinks.twitter || ''}
              onChange={handleSocialChange}
              placeholder="https://twitter.com/username"
            />
          </div>
          <div>
            <label htmlFor="linkedin">LinkedIn:</label>
            <input
              type="text" // Use text
              id="linkedin"
              name="linkedin"
              value={profile.socialLinks.linkedin || ''}
              onChange={handleSocialChange}
              placeholder="https://linkedin.com/in/username"
            />
          </div>
        </fieldset>

        <div>
          <label htmlFor="theme">Profile Theme:</label>
          <select
            id="theme"
            name="theme"
            value={profile.theme}
            onChange={handleThemeChange}
            aria-describedby="theme-desc"
          >
            {THEMES.map(theme => (
              <option key={theme} value={theme}>
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
              </option>
            ))}
          </select>
          <small id="theme-desc">Select your preferred profile theme.</small>
        </div>

        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>

      {/* Optional: show avatar preview */}
      {profile.avatarUrl && (
        <div className="avatar-preview" aria-label="Avatar preview">
          <img
            src={profile.avatarUrl}
            alt="User avatar"
            width={100}
            height={100}
            style={{ borderRadius: '50%', marginTop: '1rem' }}
          />
        </div>
      )}
    </section>
  );
}

export default UserProfile;
