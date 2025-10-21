import React, { useEffect, useState } from 'react';

function PostsList({ topic, token }) { // <-- Pass token
  const [fullTopic, setFullTopic] = useState(null); // Store topic and posts
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      const res = await fetch(`/api/forum/topics/${topic.id}`); // Get topic AND posts
      if (!res.ok) {
        setError('Failed to load posts');
        setLoading(false);
        return;
      }
      const data = await res.json();
      setFullTopic(data);
      setLoading(false);
    }
    fetchPosts();
  }, [topic]);

  async function handleCreatePost(e) {
    e.preventDefault();
    setError(null);
    if (!newPostContent.trim()) {
      setError('Post content is required');
      return;
    }
    try {
      const res = await fetch(`/api/forum/topics/${topic.id}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // <-- Use token
        },
        body: JSON.stringify({ content: newPostContent }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to create post');
      }
      
      const createdPost = await res.json();
      // Refetch user for the new post (or just add it partially)
      // Easiest: just add the new post to the list
      setFullTopic(prev => ({
          ...prev,
          Posts: [...prev.Posts, { ...createdPost, User: { email: 'You' } }] // Simple update
      }));
      setNewPostContent('');
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p>Loading posts...</p>;
  if (!fullTopic) return <p>No topic data.</p>;

  return (
    <section aria-label={`Posts in topic ${fullTopic.title}`}>
      <h2>{fullTopic.title}</h2>
      <small>By {fullTopic.User ? fullTopic.User.email : '...'}</small>

      <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
        {fullTopic.Posts.map(post => (
          <li key={post.id} style={{ border: '1px solid #ccc', borderRadius: '4px', marginBottom: '1rem', padding: '1rem' }}>
            <p>{post.content}</p>
            <small>By {post.User ? post.User.email : '...'} at {new Date(post.createdAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>

      <form onSubmit={handleCreatePost}>
        <h3>Add a Reply</h3>
        {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}
        <textarea
          rows="4"
          value={newPostContent}
          onChange={e => setNewPostContent(e.target.value)}
          required
          placeholder="Write your reply here..."
          style={{ width: '100%' }}
        />
        <br />
        <button type="submit">Post Reply</button>
      </form>
    </section>
  );
}
export default PostsList;
