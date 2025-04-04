import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from "recharts";
import { Card, CardContent } from "../components/ui/card";
import Progress from "../components/ui/progress";
import Sidebar from "../components/Sidebar";

// Stock Line Chart Data
const stockData = [
  { name: "Jan", value: 600000 },
  { name: "Feb", value: 620000 },
  { name: "Mar", value: 610000 },
  { name: "Apr", value: 630000 },
  { name: "May", value: 648000 },
];

// Pie Chart Data
const accountHoldings = [
  { name: "Equity", value: 51.08, color: "#4ade80" },
  { name: "Debt", value: 24.14, color: "#38bdf8" },
  { name: "Gold", value: 2.41, color: "#facc15" },
];

const sectorAllocation = [
  { name: "Finance", value: 25.59, color: "#4f46e5" },
  { name: "Energy", value: 23.37, color: "#f43f5e" },
  { name: "Tech", value: 11.97, color: "#22d3ee" },
];

const stockAllocation = [
  { name: "Large Cap", value: 38.85, color: "#eab308" },
  { name: "Mid Cap", value: 7.02, color: "#9333ea" },
  { name: "Small Cap", value: 5.25, color: "#06b6d4" },
];

// Format currency in Indian Rupees
const formatRupees = (value) => {
  return value.toLocaleString('en-IN', {
    maximumFractionDigits: 0,
    style: 'currency',
    currency: 'INR'
  });
};

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock investment data - replace with real data
  const investmentData = {
    totalInvestments: '₹50,00,000',
    portfolioValue: '₹55,00,000',
    returns: '+10%'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      {/* Profile Overview */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-xl font-semibold text-indigo-600">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900">{user?.name || 'User'}</h2>
              <p className="text-sm text-gray-500">Member since {user?.joinDate || 'N/A'}</p>
            </div>
          </div>
          <div className="md:col-span-2">
            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <dt className="text-sm font-medium text-gray-500">Total Investments</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">{investmentData.totalInvestments}</dd>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <dt className="text-sm font-medium text-gray-500">Portfolio Value</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">{investmentData.portfolioValue}</dd>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <dt className="text-sm font-medium text-gray-500">Returns</dt>
                <dd className="mt-1 text-lg font-semibold text-green-600">{investmentData.returns}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Profile Details Form */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                disabled={!isEditing}
                defaultValue={user?.name || ''}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                disabled={!isEditing}
                defaultValue={user?.email || ''}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Investment Preferences */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Investment Preferences</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Risk Tolerance</label>
              <select
                disabled={!isEditing}
                defaultValue="moderate"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
              >
                <option value="conservative">Conservative</option>
                <option value="moderate">Moderate</option>
                <option value="aggressive">Aggressive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Investment Goal</label>
              <select
                disabled={!isEditing}
                defaultValue="growth"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
              >
                <option value="income">Income</option>
                <option value="growth">Growth</option>
                <option value="balanced">Balanced</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
