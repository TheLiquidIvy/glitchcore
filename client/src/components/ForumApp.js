import React, { useState } from 'react';
import ForumCategories from './ForumCategories';
import TopicsList from './TopicsList';
import PostsList from './PostsList';

function ForumApp({ token }) { // <-- Pass token
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);

  function handleBackToCategories() {
    setSelectedCategory(null);
    setSelectedTopic(null);
  }

  function handleBackToTopics() {
    setSelectedTopic(null);
  }

  return (
    <main>
      {!selectedCategory && (
        <ForumCategories onSelectCategory={setSelectedCategory} />
      )}

      {selectedCategory && !selectedTopic && (
        <>
          <button onClick={handleBackToCategories} aria-label="Back to categories">
            ← Back to Categories
          </button>
          <TopicsList 
            category={selectedCategory} 
            onSelectTopic={setSelectedTopic} 
            token={token} // <-- Pass token down
          />
        </>
      )}

      {selectedTopic && (
        <>
          <button onClick={handleBackToTopics} aria-label="Back to topics">
            ← Back to Topics
          </button>
          <PostsList 
            topic={selectedTopic} 
            token={token} // <-- Pass token down
          />
        </>
      )}
    </main>
  );
}
export default ForumApp;
