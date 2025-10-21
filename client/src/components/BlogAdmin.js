import React, { useState } from 'react';

// Basic styles for the form
const formStyle = { display: 'flex', flexDirection: 'column', maxWidth: '600px', gap: '10px' };
const inputStyle = { padding: '8px', fontSize: '1em' };
const textareaStyle = { padding: '8px', fontSize: '1em', minHeight: '150px' };
const buttonStyle = { padding: '10px', fontSize: '1em', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer' };

export default function BlogAdmin({ token }) {
  const [form, setForm] = useState({
    title: '',
    category: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    slug: '',
    publishedAt: new Date().toISOString().slice(0, 10),
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to create post');
      }
      setSuccess('Post created successfully!');
      setForm({
        title: '',
        category: '',
        content: '',
        excerpt: '',
        featuredImage: '',
        slug: '',
        publishedAt: new Date().toISOString().slice(0, 10),
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section>
      <h2>Create Blog Post</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit} style={formStyle}>
        <input style={inputStyle} name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <input style={inputStyle} name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
        <input style={inputStyle} name="slug" placeholder="Slug (unique-url-part)" value={form.slug} onChange={handleChange} required />
        <input style={inputStyle} name="featuredImage" placeholder="Featured Image URL" value={form.featuredImage} onChange={handleChange} />
        <textarea style={textareaStyle} name="excerpt" placeholder="Excerpt" value={form.excerpt} onChange={handleChange} />
        <textarea style={textareaStyle} name="content" placeholder="Content (HTML allowed)" value={form.content} onChange={handleChange} required />
        <label>
          Published At:
          <input style={inputStyle} type="date" name="publishedAt" value={form.publishedAt} onChange={handleChange} required />
        </label>
        <button style={buttonStyle} type="submit">Create Post</button>
      </form>
    </section>
  );
}
