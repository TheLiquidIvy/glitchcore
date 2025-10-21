import React from 'react';

export default function Home() {
  return (
    <section>
      <h2>Welcome to My Culture Shop</h2>
      <p>
        Discover unique art and cultural products that connect you with creativity and heritage.
      </p>
      <div style={imageContainer}>
        <img src="https://source.unsplash.com/800x300/?culture,art" alt="Culture Art" style={imageStyle} />
      </div>
      <p style={{ marginTop: '1rem' }}>
        Browse our shop, explore blog stories, and create your own print-on-demand drafts.
      </p>
    </section>
  );
}

const imageContainer = {
  overflow: 'hidden',
  borderRadius: '8px',
  maxWidth: '800px',
  margin: 'auto',
};

const imageStyle = {
  width: '100%',
  height: 'auto',
  display: 'block',
};
