import React from 'react';
import './Articles.css';

const articlesData = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?auto=format&fit=crop&q=80&w=400',
    category: 'CORONAVIRUS',
    title: '12 Coronavirus Myths and Facts That You Should Be Aware Of',
    author: 'Dr. Diana Borgio'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&q=80&w=400',
    category: 'VITAMINS AND SUPPLEMENTS',
    title: 'Eating Right to Build Immunity Against Cold and Viral Infections',
    author: 'Dr. Diana Borgio'
  }
];

const Articles = () => {
  return (
    <section className="articles-section">
      <div className="articles-container">
        {/* Left Side: Header & Button */}
        <div className="articles-header">
          <h2>Read top articles from health experts</h2>
          <p>Health articles that keep you informed about good health practices and achieve your goals.</p>
          <button className="see-all-btn">See all articles</button>
        </div>

        {/* Right Side: Article Cards */}
        <div className="articles-grid">
          {articlesData.map((art) => (
            <div key={art.id} className="article-card">
              <div className="article-img-wrapper">
                <img src={art.image} alt={art.title} />
              </div>
              <div className="article-content">
                <span className="article-cat">{art.category}</span>
                <h3 className="article-title">{art.title}</h3>
                <p className="article-author">{art.author}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Articles;