import React, { useEffect, useState } from 'react';

function ForumCategories({ onSelectCategory }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch('/api/forum/categories');
      const data = await res.json();
      setCategories(data);
      setLoading(false);
    }
    fetchCategories();
  }, []);

  if (loading) return <p>Loading categories...</p>;

  return (
    <section aria-label="Forum categories">
      <h2>Forum Categories</h2>
      <ul>
        {categories.map(cat => (
          <li key={cat.id}>
            <button onClick={() => onSelectCategory(cat)}>{cat.name}</button>
            <p>{cat.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
export default ForumCategories;
