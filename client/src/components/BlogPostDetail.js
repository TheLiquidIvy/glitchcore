import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function BlogPostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPost();
  }, [slug]);

  async function fetchPost() {
    try {
      const res = await fetch(`/api/blog/${slug}`);
      if (res.status === 404) {
        setError('Post not found');
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch post');
      const data = await res.json();
      setPost(data);
    } catch (err) {
      setError(err.message);
    }
  }

  if (error) return <p>{error}</p>;
  if (!post) return <p>Loading...</p>;

  return (
    <article>
      <h2>{post.title}</h2>
      <p><em>{post.category} - {new Date(post.publishedAt).toLocaleDateString()}</em></p>
      {post.featuredImage && <img src={post.featuredImage} alt={post.title} style={{ maxWidth: '600px', borderRadius: '8px' }} />}
      {/* WARNING: Only use dangerouslySetInnerHTML if you TRUST the HTML content (e.g., you wrote it in your admin) */}
      <div dangerouslySetInnerHTML={{ __html: post.content }} style={{ marginTop: '1rem' }} />
      <p style={{ marginTop: '2rem' }}><Link to="/blog">&larr; Back to Blog</Link></p>
    </article>
  );
}
