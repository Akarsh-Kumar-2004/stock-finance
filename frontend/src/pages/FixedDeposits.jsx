import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "../components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Generate random FD data
const generateFDData = (start, count) => {
  const banks = [
    { name: "HDFC Bank", icon: "🏦", rating: "AAA" },
    { name: "ICICI Bank", icon: "🏛️", rating: "AAA" },
    { name: "State Bank of India", icon: "🏦", rating: "AAA" },
    { name: "Axis Bank", icon: "🏛️", rating: "AA+" },
    { name: "Kotak Mahindra Bank", icon: "🏦", rating: "AA+" },
    { name: "Bank of Baroda", icon: "🏛️", rating: "AA" },
    { name: "Punjab National Bank", icon: "🏦", rating: "AA" },
    { name: "Yes Bank", icon: "🏛️", rating: "A+" },
    { name: "IndusInd Bank", icon: "🏦", rating: "AA" },
    { name: "Federal Bank", icon: "🏛️", rating: "AA-" }
  ];

  const tenures = [6, 12, 24, 36, 60];
  const types = ["Regular", "Senior Citizen", "Tax Saving", "Cumulative"];

  return Array.from({ length: count }, (_, i) => {
    const bank = banks[Math.floor(Math.random() * banks.length)];
    const tenure = tenures[Math.floor(Math.random() * tenures.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const interestRate = (Math.random() * 3 + 4).toFixed(2);
    const minAmount = Math.floor(Math.random() * 4 + 1) * 5000;

    return {
      id: start + i,
      bankName: bank.name,
      icon: bank.icon,
      rating: bank.rating,
      type,
      tenure,
      interestRate: `${interestRate}%`,
      minAmount: `₹${minAmount.toLocaleString('en-IN')}`,
      features: [
        "Online Account Opening",
        "Auto Renewal Option",
        "Premature Withdrawal",
        "Loan Against FD"
      ].slice(0, Math.floor(Math.random() * 3) + 2)
    };
  });
};

const FixedDeposits = () => {
  const [deposits, setDeposits] = useState(() => generateFDData(1, 20));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [calculatorValues, setCalculatorValues] = useState({
    principal: 100000,
    interestRate: 6.5,
    period: 3,
    compoundFrequency: 4, // quarterly compounding
  });
  const observer = useRef();
  const lastDepositElementRef = useRef();

  const types = ["All", "Regular", "Senior Citizen", "Tax Saving", "Cumulative"];

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        loadMoreDeposits();
      }
    }, options);

    if (lastDepositElementRef.current) {
      observer.current.observe(lastDepositElementRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [deposits, loading, hasMore]);

  const loadMoreDeposits = () => {
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      const newDeposits = generateFDData(deposits.length + 1, 10);
      setDeposits((prev) => [...prev, ...newDeposits]);
      setLoading(false);
      // Stop loading more after reaching 100 deposits
      if (deposits.length >= 90) {
        setHasMore(false);
      }
    }, 1000);
  };

  const filteredDeposits = deposits.filter((deposit) => {
    const matchesSearch = deposit.bankName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "All" || deposit.type === selectedType;
    return matchesSearch && matchesType;
  });

  // Format currency in Indian Rupees
  const formatRupees = (value) => {
    return value.toLocaleString('en-IN', {
      maximumFractionDigits: 0,
      style: 'currency',
      currency: 'INR'
    });
  };

  // Calculate maturity amount for FD calculator
  const calculateMaturity = () => {
    const { principal, interestRate, period, compoundFrequency } = calculatorValues;
    const rate = interestRate / 100; // Convert percentage to decimal
    
    // Calculate maturity amount using compound interest formula
    // A = P(1 + r/n)^(nt)
    const n = compoundFrequency; // Compounding frequency per year
    const t = period; // Time period in years
    
    const maturityAmount = principal * Math.pow(1 + rate / n, n * t);
    return maturityAmount.toFixed(2);
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
    const { principal, interestRate, period, compoundFrequency } = calculatorValues;
    const rate = interestRate / 100; // Convert percentage to decimal
    const n = compoundFrequency; // Compounding frequency per year
    
    return Array.from({ length: period + 1 }, (_, i) => {
      const t = i; // Time period in years
      const maturityAmount = principal * Math.pow(1 + rate / n, n * t);
      const interestEarned = maturityAmount - principal;
      
      return {
        year: i,
        maturityAmount: Math.round(maturityAmount),
        principal: principal,
        interestEarned: Math.round(interestEarned),
      };
    });
  };

  const chartData = generateChartData();
  const maturityAmount = calculateMaturity();

  // Mock data - replace with real API data
  const interestRateData = [
    { name: '1M', value: 3.5 },
    { name: '3M', value: 4.0 },
    { name: '6M', value: 4.5 },
    { name: '1Y', value: 5.0 },
    { name: '2Y', value: 5.5 },
    { name: '3Y', value: 6.0 },
    { name: '5Y', value: 6.5 },
  ];

  return (
    <div className="space-y-8">
      {/* Header with Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Fixed Deposits</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            {types.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search banks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Interest Rate Chart */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Interest Rate Trends</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={interestRateData}>
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

      {/* FD Calculator */}
      <Card className="bg-white rounded-lg shadow">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Fixed Deposit Calculator</h2>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Principal Amount
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">₹</span>
                  </div>
                  <input
                    type="number"
                    name="principal"
                    value={calculatorValues.principal}
                    onChange={handleCalculatorChange}
                    className="pl-7 block w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                    min="1000"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interest Rate (% per annum)
                </label>
                <input
                  type="number"
                  name="interestRate"
                  value={calculatorValues.interestRate}
                  onChange={handleCalculatorChange}
                  className="block w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  step="0.1"
                  min="1"
                  max="15"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time Period (Years)
                </label>
                <input
                  type="number"
                  name="period"
                  value={calculatorValues.period}
                  onChange={handleCalculatorChange}
                  className="block w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  min="1"
                  max="10"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Compounding Frequency
                </label>
                <select
                  name="compoundFrequency"
                  value={calculatorValues.compoundFrequency}
                  onChange={handleCalculatorChange}
                  className="block w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="1">Annually</option>
                  <option value="2">Semi-Annually</option>
                  <option value="4">Quarterly</option>
                  <option value="12">Monthly</option>
                </select>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Maturity Value</h3>
                <div className="text-3xl font-bold text-indigo-600">₹{parseInt(maturityAmount).toLocaleString('en-IN')}</div>
                <p className="text-sm text-gray-500 mt-1">
                  After {calculatorValues.period} years
                </p>
                <p className="text-sm font-medium text-green-600 mt-2">
                  Interest Earned: ₹{(parseInt(maturityAmount) - calculatorValues.principal).toLocaleString('en-IN')}
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
                  <Line type="monotone" dataKey="maturityAmount" stroke="#6366F1" strokeWidth={2} name="Maturity Amount" />
                  <Line type="monotone" dataKey="principal" stroke="#9CA3AF" strokeWidth={2} name="Principal" />
                  <Line type="monotone" dataKey="interestEarned" stroke="#10B981" strokeWidth={2} name="Interest Earned" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FD Table */}
      <Card className="bg-white rounded-lg shadow">
        <CardContent className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Available Fixed Deposits</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interest Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Min Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tenure
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDeposits.map((deposit, index) => {
                  if (index === filteredDeposits.length - 1) {
                    return (
                      <tr key={deposit.id} ref={lastDepositElementRef} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-lg mr-2">{deposit.icon}</span>
                            <div className="text-sm font-medium text-gray-900">{deposit.bankName}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{deposit.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">{deposit.interestRate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{deposit.minAmount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{deposit.tenure}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                            Invest
                          </button>
                        </td>
                      </tr>
                    );
                  }
                  return (
                    <tr key={deposit.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-lg mr-2">{deposit.icon}</span>
                          <div className="text-sm font-medium text-gray-900">{deposit.bankName}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{deposit.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">{deposit.interestRate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{deposit.minAmount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{deposit.tenure}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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

export default FixedDeposits;
