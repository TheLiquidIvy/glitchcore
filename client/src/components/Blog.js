import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('All');
  const [categories, setCategories] = useState(['All']);

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  async function fetchPosts() {
    try {
      const url = filter === 'All' ? '/api/blog' : `/api/blog?category=${encodeURIComponent(filter)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch posts');
      const data = await res.json();
      setPosts(data);

      // Extract categories dynamically
      if (filter === 'All' && data.length) {
        const cats = Array.from(new Set(data.map(p => p.category)));
        setCategories(['All', ...cats]);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <section>
      <h2>Blog</h2>
      <label htmlFor="categoryFilter">Filter by category: </label>
      <select id="categoryFilter" value={filter} onChange={e => setFilter(e.target.value)}>
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <ul style={{ listStyle: 'none', paddingLeft: 0, marginTop: '1.5rem' }}>
          {posts.map(post => (
            <li key={post.id} style={{ marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
              <h3><Link to={`/blog/${post.slug}`}>{post.title}</Link></h3>
              <p><em>{post.category} - {new Date(post.publishedAt).toLocaleDateString()}</em></p>
              {post.featuredImage && (
                <img src={post.featuredImage} alt={post.title} style={{ maxWidth: '300px', borderRadius: '4px' }} />
              )}
              <p>{post.excerpt || (post.content ? post.content.slice(0, 150) + '...' : '')}</p>
              <Link to={`/blog/${post.slug}`}>Read more</Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
