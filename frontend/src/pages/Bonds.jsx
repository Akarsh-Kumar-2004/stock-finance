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

// Generate random bond data
const generateBondData = (start, count) => {
  const bonds = [
    { name: "RBI Sovereign Gold Bond", symbol: "SGBNOV25", icon: "🏛️", rating: "AAA" },
    { name: "NHAI Bond", symbol: "NHAI", icon: "🛣️", rating: "AAA" },
    { name: "Indian Govt Bond", symbol: "INBND", icon: "🇮🇳", rating: "AAA" },
    { name: "Reliance Bond", symbol: "RELBND", icon: "🏭", rating: "AA+" },
    { name: "SBI Bond", symbol: "SBIBND", icon: "🏦", rating: "AAA" },
    { name: "HDFC Bond", symbol: "HDFCBND", icon: "🏠", rating: "AAA" },
    { name: "Power Finance Corp Bond", symbol: "PFCBND", icon: "⚡", rating: "AAA" },
    { name: "ICICI Bank Bond", symbol: "ICICIBND", icon: "💰", rating: "AA+" },
    { name: "LIC Housing Finance Bond", symbol: "LICHFBND", icon: "🏘️", rating: "AAA" },
    { name: "Tata Power Bond", symbol: "TATAPBND", icon: "💡", rating: "AA" }
  ];

  return Array.from({ length: count }, (_, i) => {
    const bond = bonds[Math.floor(Math.random() * bonds.length)];
    const price = (Math.random() * 500 + 750).toFixed(2);
    const yield_ = (Math.random() * 5 + 2).toFixed(1);
    const maturity = (Math.floor(Math.random() * 20) + 2023).toString();

    return {
      id: start + i,
      name: bond.name,
      symbol: bond.symbol,
      price: `₹${price}`,
      yield: `${yield_}%`,
      maturity,
      rating: bond.rating,
      icon: bond.icon
    };
  });
};

const Bonds = () => {
  const [bonds, setBonds] = useState(() => generateBondData(1, 20));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const observer = useRef();
  const lastBondElementRef = useRef();

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        loadMoreBonds();
      }
    }, options);

    if (lastBondElementRef.current) {
      observer.current.observe(lastBondElementRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [bonds, loading, hasMore]);

  const loadMoreBonds = () => {
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      const newBonds = generateBondData(bonds.length + 1, 10);
      setBonds((prev) => [...prev, ...newBonds]);
      setLoading(false);
      // Stop loading more after reaching 100 bonds
      if (bonds.length >= 90) {
        setHasMore(false);
      }
    }, 1000);
  };

  const filteredBonds = bonds.filter((bond) =>
    bond.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bond.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Bond Market</h1>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search bonds..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Bond Market Overview</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">10Y Govt Bond Yield</span>
                <span className="text-green-600 font-medium">7.2%</span>
              </div>
              <div className="mt-1 bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">5Y Govt Bond Yield</span>
                <span className="text-red-600 font-medium">6.8%</span>
              </div>
              <div className="mt-1 bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Average Yield</h3>
          <div className="text-3xl font-bold text-indigo-600 mb-2">7.5%</div>
          <p className="text-sm text-gray-500">Across all listed bonds</p>
        </Card>

        <Card className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Market Sentiment</h3>
          <div className="flex items-center space-x-2">
            <div className="text-2xl">📊</div>
            <div className="text-lg font-medium text-blue-600">Stable</div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Based on yield curve</p>
        </Card>
      </div>

      {/* Bonds Table */}
      <Card className="bg-white rounded-lg shadow">
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bond</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yield</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Maturity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBonds.map((bond, index) => {
                  if (index === filteredBonds.length - 1) {
                    return (
                      <tr key={bond.id} ref={lastBondElementRef} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-lg mr-2">{bond.icon}</span>
                            <div className="text-sm font-medium text-gray-900">{bond.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bond.symbol}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bond.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">{bond.yield}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bond.maturity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bond.rating}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                            Invest
                          </button>
                        </td>
                      </tr>
                    );
                  }
                  return (
                    <tr key={bond.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-lg mr-2">{bond.icon}</span>
                          <div className="text-sm font-medium text-gray-900">{bond.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bond.symbol}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bond.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">{bond.yield}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bond.maturity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bond.rating}</td>
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

export default Bonds;
