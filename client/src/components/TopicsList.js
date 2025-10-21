import React, { useEffect, useState } from 'react';

function TopicsList({ category, onSelectTopic, token }) { // <-- Pass token
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicContent, setNewTopicContent] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTopics() {
      setLoading(true);
      const res = await fetch(`/api/forum/categories/${category.id}/topics`);
      if (!res.ok) {
        setError('Failed to load topics');
        setLoading(false);
        return;
      }
      const data = await res.json();
      setTopics(data);
      setLoading(false);
    }
    fetchTopics();
  }, [category]);

  async function handleCreateTopic(e) {
    e.preventDefault();
    setError(null);

    if (!newTopicTitle.trim() || !newTopicContent.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      const res = await fetch(`/api/forum/categories/${category.id}/topics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // <-- Use token
        },
        body: JSON.stringify({ title: newTopicTitle, content: newTopicContent }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to create topic');
      }

      const createdTopic = await res.json();
      // Need to re-fetch to get user email
      setTopics(prev => [createdTopic, ...prev]); 
      setNewTopicTitle('');
      setNewTopicContent('');
      // A better way is to refetch all topics
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p>Loading topics...</p>;

  return (
    <section aria-label={`Topics in category ${category.name}`}>
      <h2>Topics in {category.name}</h2>
      <form onSubmit={handleCreateTopic}>
        <h3>Create New Topic</h3>
        {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}
        <div>
          <label htmlFor="topicTitle">Title:</label>
          <input id="topicTitle" type="text" value={newTopicTitle} onChange={e => setNewTopicTitle(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="topicContent">Content:</label>
          <textarea id="topicContent" rows="4" value={newTopicContent} onChange={e => setNewTopicContent(e.target.value)} required />
        </div>
        <button type="submit">Create Topic</button>
      </form>

      <ul>
        {topics.map(topic => (
          <li key={topic.id}>
            <button onClick={() => onSelectTopic(topic)}>{topic.title}</button>
            <small> by {topic.User ? topic.User.email : '...'} </small>
          </li>
        ))}
      </ul>
    </section>
  );
}
export default TopicsList;
