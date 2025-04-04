import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '../components/ui/card';

const Library = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState({
    id: "dQw4w9WgXcQ",
    title: "Investment Strategies for Beginners",
    description: "Learn the basics of investing in the stock market",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg"
  });
  const observer = useRef();
  const lastVideoElementRef = useRef();

  const tags = [
    'All',
    'Stock Basics',
    'Technical Analysis',
    'Fundamental Analysis',
    'Investment Strategies',
    'Market News',
    'Beginner',
    'Advanced',
    'Trading',
    'Investing'
  ];

  // Generate random videos
  const generateVideos = (start, count) => {
    const topics = [
      'Stock Market Basics',
      'Technical Analysis',
      'Candlestick Patterns',
      'Value Investing',
      'Day Trading Strategies',
      'Market Psychology',
      'Portfolio Management',
      'Risk Analysis',
      'Options Trading',
      'Forex Trading'
    ];

    const authors = [
      'Trading Academy',
      'Investment Guru',
      'Stock Market Pro',
      'Finance Expert',
      'Market Analyst'
    ];

    // Working YouTube video IDs
    const youtubeIds = [
      'Xn7KWR9EOGQ', // Warren Buffett investment strategies
      'ZsFwHS0O8Uw', // Stock market for beginners
      'WEDIj9JBTC8', // Candlestick patterns
      '7PMw3lXLz0o', // Daily Trading Strategies
      'Kxd6po5Lx3k', // Technical Analysis
      'bqHVPGZufos', // Day Trading Tips
      'S-3s8Z0Vk_s', // Options Trading
      'Vb8bgvQPrTk', // Forex Trading for Beginners
      'z7fGFnx2kYk', // Financial planning
      'NWn0QpjyTJI'  // Value Investing
    ];

    const descriptions = [
      'Learn essential concepts and strategies for successful trading and investing.',
      'Master the fundamentals of technical analysis and chart patterns.',
      'Discover how to build a diversified investment portfolio for long-term growth.',
      'Understand risk management techniques to protect your investments.',
      'Learn how to analyze market trends and identify profitable opportunities.',
      'A comprehensive guide to fundamental analysis for stock picking.',
      'Tips and strategies for day trading in volatile markets.',
      'Expert insights on market psychology and behavioral finance.',
      'Step-by-step guide to options trading strategies.',
      'Learn how to identify undervalued stocks using value investing principles.'
    ];

    return Array.from({ length: count }, (_, i) => ({
      id: start + i,
      title: `${topics[Math.floor(Math.random() * topics.length)]} - Part ${Math.floor(Math.random() * 5) + 1}`,
      tags: [tags[Math.floor(Math.random() * (tags.length - 1)) + 1], tags[Math.floor(Math.random() * (tags.length - 1)) + 1]],
      youtubeId: youtubeIds[Math.floor(Math.random() * youtubeIds.length)],
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      duration: `${Math.floor(Math.random() * 30) + 5}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      author: authors[Math.floor(Math.random() * authors.length)],
      views: `${Math.floor(Math.random() * 900) + 100}K`,
      thumbnail: `https://img.youtube.com/vi/${youtubeIds[Math.floor(Math.random() * youtubeIds.length)]}/mqdefault.jpg`
    }));
  };

  useEffect(() => {
    // Initial load
    setVideos(generateVideos(1, 12));
  }, []);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 1.0
    };

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        loadMoreVideos();
      }
    }, options);

    if (lastVideoElementRef.current) {
      observer.current.observe(lastVideoElementRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [videos, loading, hasMore]);

  const loadMoreVideos = () => {
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      const newVideos = generateVideos(videos.length + 1, 8);
      setVideos(prev => [...prev, ...newVideos]);
      setLoading(false);
      // Stop loading more after reaching 100 videos
      if (videos.length >= 92) {
        setHasMore(false);
      }
    }, 1000);
  };

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => video.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  const toggleTag = (tag) => {
    if (tag === 'All') {
      setSelectedTags([]);
    } else {
      setSelectedTags(prev => 
        prev.includes(tag) 
          ? prev.filter(t => t !== tag)
          : [...prev, tag]
      );
    }
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Investment Learning Library</h1>
      
      {/* Video Player */}
      <div className="mb-8 bg-white rounded-lg shadow overflow-hidden">
        <div className="aspect-w-16 aspect-h-9">
          <iframe 
            className="w-full h-[400px]"
            src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1&rel=0`}
            title={selectedVideo.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold">{selectedVideo.title}</h2>
          <p className="text-gray-600 mt-1">{selectedVideo.description}</p>
        </div>
      </div>

      {/* Tag Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedTags(["All"])}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            selectedTags.length === 1 && selectedTags.includes("All")
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          All
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              selectedTags.length === 1 && selectedTags.includes(tag)
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredVideos
          .filter(
            video =>
              selectedTags.length === 0 || selectedTags.includes("All") ||
              selectedTags.some(tag => video.tags.includes(tag))
          )
          .map((video, index) => {
            if (index === filteredVideos.length - 1) {
              return (
                <div
                  key={video.id}
                  ref={lastVideoElementRef}
                  className="bg-white rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-lg transition duration-300"
                  onClick={() => setSelectedVideo(video)}
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-36 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">
                      {video.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                      {video.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {video.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <div
                key={video.id}
                className="bg-white rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-lg transition duration-300"
                onClick={() => setSelectedVideo(video)}
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-36 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 line-clamp-1">
                    {video.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {video.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {video.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center mt-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      )}
    </div>
  );
};

export default Library;