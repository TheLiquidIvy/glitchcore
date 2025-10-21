// client/src/components/PodDraftsManager.js
import React, { useState, useEffect } from 'react';

function PodDraftsManager({ token }) {
  const [drafts, setDrafts] = useState([]);
  const [form, setForm] = useState({ title: '', imageUrl: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDrafts();
  }, [token]);

  const fetchDrafts = async () => {
    try {
      const res = await fetch('/api/podDrafts', { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to load drafts');
      const data = await res.json();
      setDrafts(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      let res;
      if (editingId) {
        res = await fetch(`/api/podDrafts/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(form),
        });
      } else {
        res = await fetch('/api/podDrafts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(form),
        });
      }

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save draft');
      }

      setForm({ title: '', imageUrl: '' });
      setEditingId(null);
      fetchDrafts();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = draft => {
    setEditingId(draft.id);
    setForm({ title: draft.title, imageUrl: draft.imageUrl || '' });
  };

  const deleteDraft = async id => {
    if (!window.confirm('Delete this draft?')) return;
    try {
      const res = await fetch(`/api/podDrafts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete draft');
      fetchDrafts();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h3>{editingId ? 'Edit POD Draft' : 'New POD Draft'}</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <input name="imageUrl" placeholder="Image URL (optional)" value={form.imageUrl} onChange={handleChange} />
        <button type="submit">{editingId ? 'Update' : 'Create'}</button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm({ title: '', imageUrl: '' });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <h3>Your POD Drafts</h3>
      {drafts.length === 0 ? (
        <p>No drafts yet.</p>
      ) : (
        <ul>
          {drafts.map(draft => (
            <li key={draft.id}>
              <strong>{draft.title}</strong> <br />
              {draft.imageUrl && <img src={draft.imageUrl} alt={draft.title} style={{ maxWidth: '150px' }} />} <br />
              Status: {draft.status} <br />
              <button onClick={() => startEdit(draft)}>Edit</button>
              <button onClick={() => deleteDraft(draft.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PodDraftsManager; // <--- This line completes the file.
