import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "../components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Generate random mutual fund data
const generateMutualFundData = (start, count) => {
  const funds = [
    { name: "HDFC Top 100 Fund", symbol: "HDFTOP", icon: "📈", category: "Large Cap" },
    { name: "SBI Blue Chip Fund", symbol: "SBIBLU", icon: "🚀", category: "Large Cap" },
    { name: "Axis Midcap Fund", symbol: "AXISMD", icon: "💰", category: "Mid Cap" },
    { name: "ICICI Prudential Value Discovery Fund", symbol: "ICICPVD", icon: "🌍", category: "Value" },
    { name: "Mirae Asset Emerging Bluechip Fund", symbol: "MIRAE", icon: "💵", category: "Multi Cap" },
    { name: "Kotak Standard Multicap Fund", symbol: "KOTAKM", icon: "🏆", category: "Multi Cap" },
    { name: "Parag Parikh Long Term Equity Fund", symbol: "PPLTEF", icon: "🔷", category: "Multi Cap" },
    { name: "Aditya Birla SL Tax Relief 96 Fund", symbol: "ABSLTR", icon: "📊", category: "ELSS" },
    { name: "DSP Tax Saver Fund", symbol: "DSPTSF", icon: "💻", category: "ELSS" },
    { name: "Tata Digital India Fund", symbol: "TDIF", icon: "🌟", category: "Sector" }
  ];

  return Array.from({ length: count }, (_, i) => {
    const fund = funds[Math.floor(Math.random() * funds.length)];
    const nav = (Math.random() * 100 + 50).toFixed(2);
    const returns = {
      "1Y": (Math.random() * 30 - 5).toFixed(1),
      "3Y": (Math.random() * 40).toFixed(1),
      "5Y": (Math.random() * 60).toFixed(1)
    };
    const aum = Math.floor(Math.random() * 25000 + 5000);
    const risk = ["Low", "Moderate", "High"][Math.floor(Math.random() * 3)];

    return {
      id: start + i,
      name: fund.name,
      symbol: fund.symbol,
      nav: `₹${nav}`,
      returns,
      aum: `₹${aum.toLocaleString('en-IN')} Cr`,
      risk,
      category: fund.category,
      icon: fund.icon
    };
  });
};

const MutualFunds = () => {
  const [funds, setFunds] = useState(() => generateMutualFundData(1, 20));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [calculatorValues, setCalculatorValues] = useState({
    initialInvestment: 10000,
    monthlyContribution: 500,
    years: 10,
    expectedReturn: 12,
  });
  const observer = useRef();
  const lastFundElementRef = useRef();

  const categories = ["All", "Large Cap", "Mid Cap", "Small Cap", "Growth", "Dividend", "International", "Income", "Blue Chip", "Sector"];

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        loadMoreFunds();
      }
    }, options);

    if (lastFundElementRef.current) {
      observer.current.observe(lastFundElementRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [funds, loading, hasMore]);

  const loadMoreFunds = () => {
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      const newFunds = generateMutualFundData(funds.length + 1, 10);
      setFunds((prev) => [...prev, ...newFunds]);
      setLoading(false);
      // Stop loading more after reaching 100 funds
      if (funds.length >= 90) {
        setHasMore(false);
      }
    }, 1000);
  };

  const filteredFunds = funds.filter((fund) => {
    const matchesSearch = fund.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fund.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || fund.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate future value for the calculator
  const calculateFutureValue = () => {
    const { initialInvestment, monthlyContribution, years, expectedReturn } = calculatorValues;
    const monthlyRate = expectedReturn / 100 / 12;
    const months = years * 12;
    
    // Calculate future value of initial investment
    const initialFV = initialInvestment * Math.pow(1 + monthlyRate, months);
    
    // Calculate future value of monthly contributions
    const contributionFV = monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    
    // Total future value
    return Math.round(initialFV + contributionFV);
  };

  const handleCalculatorChange = (e) => {
    const { name, value } = e.target;
    setCalculatorValues({
      ...calculatorValues,
      [name]: parseFloat(value),
    });
  };

  // Generate data for the chart
  const generateChartData = () => {
    const { initialInvestment, monthlyContribution, years, expectedReturn } = calculatorValues;
    const monthlyRate = expectedReturn / 100 / 12;
    
    return Array.from({ length: years + 1 }, (_, i) => {
      const months = i * 12;
      const initialFV = initialInvestment * Math.pow(1 + monthlyRate, months);
      const contributionFV = monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
      const totalAmount = initialFV + contributionFV;
      const investedAmount = initialInvestment + (monthlyContribution * months);
      
      return {
        year: i,
        totalAmount: Math.round(totalAmount),
        investedAmount: Math.round(investedAmount),
        growth: Math.round(totalAmount - investedAmount),
      };
    });
  };

  const chartData = generateChartData();
  const futureValue = calculateFutureValue();

  // Format currency in Indian Rupees
  const formatRupees = (value) => {
    return value.toLocaleString('en-IN', {
      maximumFractionDigits: 0,
      style: 'currency',
      currency: 'INR'
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Mutual Funds</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
              placeholder="Search funds..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
          </div>
        </div>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Fund Performance</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Average Returns (1Y)</span>
                <span className="text-green-600 font-medium">15.8%</span>
              </div>
              <div className="mt-1 bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Average Returns (3Y)</span>
                <span className="text-green-600 font-medium">42.3%</span>
              </div>
              <div className="mt-1 bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total AUM</h3>
          <div className="text-3xl font-bold text-indigo-600 mb-2">₹2.3L Cr</div>
          <p className="text-sm text-gray-500">Across all listed funds</p>
        </Card>

        <Card className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Market Trend</h3>
          <div className="flex items-center space-x-2">
            <div className="text-2xl">📈</div>
            <div className="text-lg font-medium text-green-600">Bullish</div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Based on fund flows</p>
        </Card>
      </div>

      {/* Mutual Fund Calculator */}
      <Card className="bg-white rounded-lg shadow mt-8">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Mutual Fund Calculator</h2>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Investment
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">₹</span>
                  </div>
                  <input
                    type="number"
                    name="initialInvestment"
                    value={calculatorValues.initialInvestment}
                    onChange={handleCalculatorChange}
                    className="pl-7 block w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                    min="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Contribution
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">₹</span>
                  </div>
                  <input
                    type="number"
                    name="monthlyContribution"
                    value={calculatorValues.monthlyContribution}
                    onChange={handleCalculatorChange}
                    className="pl-7 block w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                    min="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time Period (Years)
                </label>
                <input
                  type="number"
                  name="years"
                  value={calculatorValues.years}
                  onChange={handleCalculatorChange}
                  className="block w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  min="1"
                  max="50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Annual Return (%)
                </label>
                <input
                  type="number"
                  name="expectedReturn"
                  value={calculatorValues.expectedReturn}
                  onChange={handleCalculatorChange}
                  className="block w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  step="0.1"
                  min="0"
                  max="30"
                />
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Future Value</h3>
                <div className="text-3xl font-bold text-indigo-600">₹{futureValue.toLocaleString('en-IN')}</div>
                <p className="text-sm text-gray-500 mt-1">
                  After {calculatorValues.years} years
                </p>
              </div>
            </div>
            <div className="lg:col-span-3 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottomRight', offset: -5 }} />
                  <YAxis
                    tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
                    width={80}
                  />
                  <Tooltip 
                    formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, '']}
                    labelFormatter={(value) => `Year ${value}`}
                  />
                  <Line type="monotone" dataKey="totalAmount" stroke="#6366F1" strokeWidth={2} name="Total Amount" />
                  <Line type="monotone" dataKey="investedAmount" stroke="#9CA3AF" strokeWidth={2} name="Invested Amount" />
                  <Line type="monotone" dataKey="growth" stroke="#10B981" strokeWidth={2} name="Growth" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Funds Table */}
      <Card className="bg-white rounded-lg shadow mt-8">
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fund</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAV</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">1Y Returns</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">3Y Returns</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AUM</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFunds.map((fund, index) => {
                  if (index === filteredFunds.length - 1) {
                    return (
                      <tr key={fund.id} ref={lastFundElementRef} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-lg mr-2">{fund.icon}</span>
                            <div className="text-sm font-medium text-gray-900">{fund.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fund.symbol}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fund.nav}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`font-medium ${parseFloat(fund.returns["1Y"]) >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {fund.returns["1Y"]}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`font-medium ${parseFloat(fund.returns["3Y"]) >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {fund.returns["3Y"]}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fund.aum}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            fund.risk === "Low" ? "bg-green-100 text-green-800" :
                            fund.risk === "Moderate" ? "bg-yellow-100 text-yellow-800" :
                            "bg-red-100 text-red-800"
                          }`}>
                            {fund.risk}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                            Invest
                          </button>
                        </td>
                      </tr>
                    );
                  }
                  return (
                  <tr key={fund.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-lg mr-2">{fund.icon}</span>
                        <div className="text-sm font-medium text-gray-900">{fund.name}</div>
                      </div>
                    </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fund.symbol}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fund.nav}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`font-medium ${parseFloat(fund.returns["1Y"]) >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {fund.returns["1Y"]}%
                        </span>
                    </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`font-medium ${parseFloat(fund.returns["3Y"]) >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {fund.returns["3Y"]}%
                      </span>
                    </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fund.aum}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          fund.risk === "Low" ? "bg-green-100 text-green-800" :
                          fund.risk === "Moderate" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                        {fund.risk}
                      </span>
                    </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                        Invest
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

export default MutualFunds;
