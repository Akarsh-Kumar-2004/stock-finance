import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const Dashboard = () => {
  const { logout, user } = useAuth();
  const location = useLocation();

  // Mock data - replace with real data later
  const portfolioStats = [
    { title: 'Active Investments', count: 4, status: 'active', description: 'Currently active' },
    { title: 'Market Trends', count: 2, status: 'info', description: 'Sectors trending' },
    { title: 'Trading Alerts', count: 1, status: 'warning', description: 'Approaching targets' },
    { title: 'Portfolio Alerts', count: 1, status: 'danger', description: 'Requires attention' }
  ];

  // Portfolio allocation data
  const allocationData = [
    { name: 'Stocks', value: 45 },
    { name: 'Mutual Funds', value: 25 },
    { name: 'Bonds', value: 15 },
    { name: 'Fixed Deposits', value: 10 },
    { name: 'Cash', value: 5 },
  ];

  // Portfolio performance data (converted to rupees)
  const performanceData = [
    { month: 'Jan', value: 825000 },
    { month: 'Feb', value: 866250 },
    { month: 'Mar', value: 841500 },
    { month: 'Apr', value: 907500 },
    { month: 'May', value: 924000 },
    { month: 'Jun', value: 973500 },
    { month: 'Jul', value: 1031250 },
    { month: 'Aug', value: 1014750 },
    { month: 'Sep', value: 1072500 },
    { month: 'Oct', value: 1113750 },
    { month: 'Nov', value: 1155000 },
    { month: 'Dec', value: 1212750 }, 
  ];

  // Sector performance data
  const sectorPerformanceData = [
    { name: 'Technology', returns: 18.5 },
    { name: 'Healthcare', returns: 12.2 },
    { name: 'Finance', returns: 8.7 },
    { name: 'Consumer', returns: 6.4 },
    { name: 'Energy', returns: -2.8 },
  ];

  // Market activity data
  const marketActivityData = [
    { name: 'AAPL', change: 2.4, color: 'green' },
    { name: 'TSLA', change: -1.2, color: 'red' },
    { name: 'MSFT', change: 1.8, color: 'green' },
    { name: 'AMZN', change: 0.9, color: 'green' },
    { name: 'GOOG', change: -0.5, color: 'red' },
  ];

  // Monthly returns data
  const monthlyReturnsData = [
    { month: 'Jan', returns: 2.5 },
    { month: 'Feb', returns: 1.8 },
    { month: 'Mar', returns: -0.8 },
    { month: 'Apr', returns: 3.2 },
    { month: 'May', returns: 1.1 },
    { month: 'Jun', returns: 2.7 },
    { month: 'Jul', returns: 4.5 },
    { month: 'Aug', returns: -0.9 },
    { month: 'Sep', returns: 2.6 },
    { month: 'Oct', returns: 3.8 },
    { month: 'Nov', returns: 2.1 },
    { month: 'Dec', returns: 4.2 },
  ];

  // Investment type returns comparison
  const investmentReturnsData = [
    { name: '1 Month', stocks: 2.1, mutualFunds: 1.8, bonds: 0.6, fd: 0.4 },
    { name: '3 Months', stocks: 6.2, mutualFunds: 5.1, bonds: 1.8, fd: 1.2 },
    { name: '6 Months', stocks: 10.5, mutualFunds: 8.7, bonds: 3.2, fd: 2.4 },
    { name: '1 Year', stocks: 18.7, mutualFunds: 15.3, bonds: 5.8, fd: 4.8 },
  ];

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A4DE6C'];

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  // Function to format rupees with Indian numbering system
  const formatRupees = (value) => {
    return value.toLocaleString('en-IN', {
      maximumFractionDigits: 0,
      style: 'currency',
      currency: 'INR'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <svg className="h-8 w-8 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <h1 className="ml-2 text-xl font-semibold text-gray-900">GamzStockz</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/profile"
                  className={`${
                    isActivePath('/profile')
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Profile
                </Link>
                <Link
                  to="/stocks"
                  className={`${
                    isActivePath('/stocks')
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Stocks
                </Link>
                <Link
                  to="/bonds"
                  className={`${
                    isActivePath('/bonds')
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Bonds
                </Link>
                <Link
                  to="/mutualfunds"
                  className={`${
                    isActivePath('/mutualfunds')
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Mutual Funds
                </Link>
                <Link
                  to="/fixeddeposits"
                  className={`${
                    isActivePath('/fixeddeposits')
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Fixed Deposits
                </Link>
                <Link
                  to="/library"
                  className={`${
                    isActivePath('/library')
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Library
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              {user && (
                <span className="text-sm font-medium text-gray-700 mr-4">
                  {user.name || user.email}
                </span>
              )}
              <button
                onClick={logout}
                className="ml-4 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Welcome Message */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user ? (user.name || user.email.split('@')[0]) : 'Trader'}!
          </h1>
          <p className="text-gray-600">Here's an overview of your investment portfolio</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {portfolioStats.map((stat) => (
            <div key={stat.title} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`h-2 w-2 rounded-full ${
                      stat.status === 'active' ? 'bg-green-400' :
                      stat.status === 'info' ? 'bg-blue-400' :
                      stat.status === 'warning' ? 'bg-yellow-400' :
                      'bg-red-400'
                    }`} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.title}
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {stat.count}
                        </div>
                      </dd>
                      <dd className="text-sm text-gray-500">
                        {stat.description}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Portfolio Overview and Portfolio Allocation */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Portfolio Performance */}
          <Card className="bg-white overflow-hidden shadow rounded-lg">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Portfolio Performance</h3>
                <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">+12.3%</span>
              </div>
              <div className="mt-5 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={performanceData}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis 
                      tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`} 
                    />
                    <Tooltip 
                      formatter={(value) => [formatRupees(value), 'Value']}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#6366F1"
                      strokeWidth={2}
                      dot={{ r: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Allocation */}
          <Card className="bg-white overflow-hidden shadow rounded-lg">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Portfolio Allocation</h3>
              </div>
              <div className="mt-5 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={allocationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {allocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Allocation']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sector Performance and Market Activity */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Sector Performance */}
          <Card className="bg-white overflow-hidden shadow rounded-lg">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Sector Performance</h3>
              </div>
              <div className="mt-5 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={sectorPerformanceData}
                    layout="vertical"
                    margin={{ top: 5, right: 5, left: 30, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={['dataMin', 'dataMax']} tickFormatter={(value) => `${value}%`} />
                    <YAxis type="category" dataKey="name" />
                    <Tooltip formatter={(value) => [`${value}%`, 'Returns']} />
                    <Bar 
                      dataKey="returns" 
                      fill="#8884d8"
                      barSize={20}
                    >
                      {sectorPerformanceData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.returns > 0 ? "#10B981" : "#EF4444"} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Market Activity */}
          <Card className="bg-white overflow-hidden shadow rounded-lg">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Market Activity</h3>
                <span className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">Live</span>
              </div>
              <div className="mt-5">
                <div className="space-y-4">
                  {marketActivityData.map((stock) => (
                    <div key={stock.name} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 ${stock.change > 0 ? 'bg-green-400' : 'bg-red-400'} rounded-full`}></div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{stock.name}</p>
                        </div>
                      </div>
                      <div className={`text-sm font-medium ${stock.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stock.change > 0 ? '+' : ''}{stock.change}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Returns and Investment Type Comparison */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Monthly Returns */}
          <Card className="bg-white overflow-hidden shadow rounded-lg">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Monthly Returns</h3>
              </div>
              <div className="mt-5 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyReturnsData}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Returns']} />
                    <Bar 
                      dataKey="returns" 
                      fill="#8884d8"
                      barSize={20}
                    >
                      {monthlyReturnsData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.returns > 0 ? "#10B981" : "#EF4444"} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Investment Type Comparison */}
          <Card className="bg-white overflow-hidden shadow rounded-lg">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Investment Returns Comparison</h3>
              </div>
              <div className="mt-5 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={investmentReturnsData}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Returns']} />
                    <Legend />
                    <Bar dataKey="stocks" name="Stocks" fill="#0088FE" barSize={15} />
                    <Bar dataKey="mutualFunds" name="Mutual Funds" fill="#00C49F" barSize={15} />
                    <Bar dataKey="bonds" name="Bonds" fill="#FFBB28" barSize={15} />
                    <Bar dataKey="fd" name="Fixed Deposits" fill="#FF8042" barSize={15} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 