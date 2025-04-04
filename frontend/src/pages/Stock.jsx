import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "../components/ui/card";

// Format currency in Indian Rupees
const formatRupees = (value) => {
  return value.toLocaleString('en-IN', {
    maximumFractionDigits: 0,
    style: 'currency',
    currency: 'INR'
  });
};

// Generate random stock data
const generateStockData = (start, count) => {
  const companies = [
    { name: "Tata Consultancy Services", symbol: "TCS", icon: "💻" },
    { name: "Reliance Industries", symbol: "RELIANCE", icon: "🏭" },
    { name: "HDFC Bank", symbol: "HDFCBANK", icon: "🏦" },
    { name: "Infosys Ltd", symbol: "INFY", icon: "🖥️" },
    { name: "Bharti Airtel", symbol: "BHARTIARTL", icon: "📱" },
    { name: "State Bank of India", symbol: "SBIN", icon: "💰" },
    { name: "ITC Ltd", symbol: "ITC", icon: "🚬" },
    { name: "Hindustan Unilever", symbol: "HINDUNILVR", icon: "🧴" },
    { name: "ICICI Bank", symbol: "ICICIBANK", icon: "💳" },
    { name: "Kotak Mahindra Bank", symbol: "KOTAKBANK", icon: "🏛️" }
  ];

  return Array.from({ length: count }, (_, i) => {
    const company = companies[Math.floor(Math.random() * companies.length)];
    const price = (Math.random() * 5000 + 500).toFixed(2);
    const change = (Math.random() * 10 - 5).toFixed(1);
    const marketCap = Math.random() > 0.5 ? 
      `${(Math.random() * 20 + 5).toFixed(2)} Lakh Cr` : 
      `${(Math.random() * 90 + 10).toFixed(0)} Thousand Cr`;

    return {
      id: start + i,
      name: company.name,
      symbol: company.symbol,
      price: `₹${price}`,
      change: `${change}%`,
      marketCap,
      icon: company.icon,
    };
  });
};

const Stocks = () => {
  const [stocks, setStocks] = useState(() => generateStockData(1, 20));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const observer = useRef();
  const lastStockElementRef = useRef();

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        loadMoreStocks();
      }
    }, options);

    if (lastStockElementRef.current) {
      observer.current.observe(lastStockElementRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [stocks, loading, hasMore]);

  const loadMoreStocks = () => {
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      const newStocks = generateStockData(stocks.length + 1, 10);
      setStocks((prev) => [...prev, ...newStocks]);
      setLoading(false);
      // Stop loading more after reaching 100 stocks
      if (stocks.length >= 90) {
        setHasMore(false);
      }
    }, 1000);
  };

  const filteredStocks = stocks.filter((stock) =>
    stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Stock Market</h1>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search stocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Market Overview</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">NIFTY 50</span>
                <span className="text-green-600 font-medium">+1.2%</span>
              </div>
              <div className="mt-1 bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">SENSEX</span>
                <span className="text-red-600 font-medium">-0.8%</span>
              </div>
              <div className="mt-1 bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Trading Volume</h3>
          <div className="text-3xl font-bold text-indigo-600 mb-2">₹2,400 Cr</div>
          <p className="text-sm text-gray-500">Traded value today</p>
        </Card>

        <Card className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Market Sentiment</h3>
          <div className="flex items-center space-x-2">
            <div className="text-2xl">📈</div>
            <div className="text-lg font-medium text-green-600">Bullish</div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Based on technical indicators</p>
        </Card>
      </div>

      {/* Stocks Table */}
      <Card className="bg-white rounded-lg shadow">
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Cap</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStocks.map((stock, index) => {
                  if (index === filteredStocks.length - 1) {
                    return (
                      <tr key={stock.id} ref={lastStockElementRef} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-lg mr-2">{stock.icon}</span>
                            <div className="text-sm font-medium text-gray-900">{stock.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stock.symbol}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stock.price}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                          stock.change.includes('-') ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {stock.change}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stock.marketCap}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                            Buy
                          </button>
                        </td>
                      </tr>
                    );
                  }
                  return (
                    <tr key={stock.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-lg mr-2">{stock.icon}</span>
                          <div className="text-sm font-medium text-gray-900">{stock.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stock.symbol}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stock.price}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        stock.change.includes('-') ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {stock.change}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stock.marketCap}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                          Buy
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center mt-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      )}
    </div>
  );
};

export default Stocks;
