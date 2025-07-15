// packages/coach/src/components/ModernKnowledgeBase.js
import React, { useState, useEffect } from 'react';
import { ApiService } from '@ivylevel/core';

const ModernKnowledgeBase = ({ user, searchFilters = {} }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const apiService = new ApiService();
      const data = await apiService.get('/kb/categories');
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const performSearch = async (query, filters = {}) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const apiService = new ApiService();
      const results = await apiService.searchKnowledgeBase(query, {
        ...searchFilters,
        ...filters,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
      });
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (searchQuery.trim()) {
      performSearch(searchQuery, { category: category !== 'all' ? category : undefined });
    }
  };

  const saveArticle = async (articleId) => {
    try {
      const apiService = new ApiService();
      await apiService.post(`/kb/articles/${articleId}/save`, { userId: user?.uid });
      // Update the article in results to show it's saved
      setSearchResults(prev => 
        prev.map(article => 
          article.id === articleId 
            ? { ...article, saved: true }
            : article
        )
      );
    } catch (error) {
      console.error('Failed to save article:', error);
    }
  };

  const getRelevanceScore = (score) => {
    if (score >= 0.8) return 'Very High';
    if (score >= 0.6) return 'High';
    if (score >= 0.4) return 'Medium';
    return 'Low';
  };

  return (
    <div className="modern-knowledge-base">
      <div className="kb-header">
        <h2>Knowledge Base</h2>
        <p>Search for coaching resources, best practices, and guidance</p>
      </div>

      {/* Search Interface */}
      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search knowledge base..."
              className="search-input"
            />
            <button type="submit" className="search-btn" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {/* Category Filters */}
        <div className="category-filters">
          <select 
            value={selectedCategory} 
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="category-select"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search Results */}
      <div className="search-results">
        {loading && (
          <div className="loading-indicator">
            <p>Searching knowledge base...</p>
          </div>
        )}

        {!loading && searchResults.length > 0 && (
          <div className="results-stats">
            <p>Found {searchResults.length} results</p>
          </div>
        )}

        {!loading && searchResults.length === 0 && searchQuery && (
          <div className="no-results">
            <p>No results found for "{searchQuery}"</p>
            <p>Try different keywords or browse categories</p>
          </div>
        )}

        <div className="results-list">
          {searchResults.map(article => (
            <div key={article.id} className="article-card">
              <div className="article-header">
                <h3>{article.title}</h3>
                <div className="article-meta">
                  <span className="category">{article.category}</span>
                  <span className="relevance">
                    Relevance: {getRelevanceScore(article.relevanceScore)}
                  </span>
                  <span className="date">
                    {new Date(article.lastUpdated).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="article-content">
                <p>{article.excerpt}</p>
                {article.tags && (
                  <div className="article-tags">
                    {article.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>

              <div className="article-actions">
                <button className="read-btn">Read Full Article</button>
                <button 
                  className={`save-btn ${article.saved ? 'saved' : ''}`}
                  onClick={() => saveArticle(article.id)}
                >
                  {article.saved ? 'Saved' : 'Save'}
                </button>
                <button className="share-btn">Share</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Articles */}
      {!searchQuery && (
        <div className="popular-articles">
          <h3>Popular Articles</h3>
          <div className="popular-grid">
            <div className="popular-card">
              <h4>Getting Started with AI Coaching</h4>
              <p>Learn how to effectively use AI assistance in your coaching sessions</p>
              <span className="views">1.2k views</span>
            </div>
            <div className="popular-card">
              <h4>Student Engagement Strategies</h4>
              <p>Proven techniques to keep students motivated and engaged</p>
              <span className="views">856 views</span>
            </div>
            <div className="popular-card">
              <h4>Progress Tracking Best Practices</h4>
              <p>How to effectively track and measure student progress</p>
              <span className="views">743 views</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernKnowledgeBase; 