import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const StocksPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Trading related state
  const [selectedStock, setSelectedStock] = useState(null);
  const [tradeType, setTradeType] = useState('buy'); // 'buy' or 'sell'
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState('Market Order');
  const [showTradeModal, setShowTradeModal] = useState(false);
  
  // Portfolio related state
  const [portfolio, setPortfolio] = useState([
    { symbol: 'AAPL', name: 'Apple Inc.', shares: 10, avgPrice: 145.75, currentPrice: 150.23 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', shares: 5, avgPrice: 280.50, currentPrice: 290.45 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', shares: 2, avgPrice: 2700.10, currentPrice: 2789.45 },
  ]);
  
  // User balance
  const [balance, setBalance] = useState(10000);
  
  const categories = ['All', 'Technology', 'Finance', 'Healthcare', 'Energy', 'Consumer'];

  // Format currency in Indian Rupees
  const formatRupees = (value) => {
    return value.toLocaleString('en-IN', {
      maximumFractionDigits: 0,
      style: 'currency',
      currency: 'INR'
    });
  };

  // Calculate total portfolio value
  const calculatePortfolioValue = () => {
    return portfolio.reduce((total, stock) => {
      return total + (stock.shares * stock.currentPrice);
    }, 0);
  };

  // Mock data - replace with real API data
  const stockPerformance = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
  ];

  const sectorAllocation = [
    { name: 'Technology', value: 35, color: '#4f46e5' },
    { name: 'Finance', value: 25, color: '#06b6d4' },
    { name: 'Healthcare', value: 20, color: '#22c55e' },
    { name: 'Energy', value: 12, color: '#eab308' },
    { name: 'Others', value: 8, color: '#94a3b8' },
  ];

  const popularStocks = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      sector: 'Technology',
      price: 150.23,
      change: 2.5,
      volume: '12.5M',
      marketCap: '2.5T'
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corp.',
      sector: 'Technology',
      price: 290.45,
      change: 1.8,
      volume: '10.2M',
      marketCap: '2.2T'
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      sector: 'Technology',
      price: 2789.45,
      change: -1.2,
      volume: '8.7M',
      marketCap: '1.9T'
    },
    {
      symbol: 'AMZN',
      name: 'Amazon.com Inc.',
      sector: 'Consumer',
      price: 3456.78,
      change: 0.5,
      volume: '9.1M',
      marketCap: '1.7T'
    },
  ];

  const watchlist = [
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 875.90, change: 3.2 },
    { symbol: 'META', name: 'Meta Platforms', price: 335.67, change: -0.8 },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 445.23, change: 2.1 },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Stock Market</h1>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stocks..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedCategory === category
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Market Performance</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stockPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Sector Allocation</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sectorAllocation}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sectorAllocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {sectorAllocation.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-600">
                      {item.name} ({item.value}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio and Trading Section */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Your Portfolio</h2>
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-500">Total Portfolio Value</p>
              <p className="text-2xl font-bold text-indigo-600">{formatRupees(calculatePortfolioValue())}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Available Balance</p>
              <p className="text-2xl font-bold text-green-600">{formatRupees(balance)}</p>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shares</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit/Loss</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.map((stock) => {
                  const currentValue = stock.shares * stock.currentPrice;
                  const investedValue = stock.shares * stock.avgPrice;
                  const profitLoss = currentValue - investedValue;
                  const profitLossPercentage = (profitLoss / investedValue) * 100;
                  
                  return (
                    <tr key={stock.symbol} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{stock.symbol}</div>
                            <div className="text-xs text-gray-500">{stock.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stock.shares}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatRupees(stock.avgPrice)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatRupees(stock.currentPrice)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatRupees(currentValue)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatRupees(profitLoss)}
                          <span className="block text-xs">
                            ({profitLossPercentage >= 0 ? '+' : ''}{profitLossPercentage.toFixed(2)}%)
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button 
                            className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                            onClick={() => {
                              const stockData = popularStocks.find(s => s.symbol === stock.symbol) || 
                                { ...stock, sector: 'Unknown', volume: 'N/A', marketCap: 'N/A', change: 0 };
                              setSelectedStock(stockData);
                              setTradeType('buy');
                              setShowTradeModal(true);
                            }}
                          >
                            Buy More
                          </button>
                          <button 
                            className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                            onClick={() => {
                              const stockData = popularStocks.find(s => s.symbol === stock.symbol) || 
                                { ...stock, sector: 'Unknown', volume: 'N/A', marketCap: 'N/A', change: 0 };
                              setSelectedStock(stockData);
                              setTradeType('sell');
                              setShowTradeModal(true);
                            }}
                          >
                            Sell
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Trade</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Stock Symbol</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter stock symbol"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter quantity"
                min="1"
              />
            </div>
            <div className="flex space-x-2">
              <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                Buy
              </button>
              <button className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                Sell
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Watchlist</h3>
          <div className="space-y-4">
            {watchlist.map((stock) => (
              <div key={stock.symbol} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{stock.symbol}</p>
                  <p className="text-xs text-gray-500">{stock.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">₹{stock.price}</p>
                  <p className={`text-xs ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change}%
                  </p>
                </div>
              </div>
            ))}
            <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              View All
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Market News</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-l-4 border-indigo-500 pl-4">
                <p className="text-sm font-medium text-gray-900">
                  Market Update {i}
                </p>
                <p className="text-sm text-gray-500">
                  Latest market news and analysis...
                </p>
                <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StocksPage; 