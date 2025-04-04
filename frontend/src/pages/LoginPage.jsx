import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  // Check if we have a remembered user
  useEffect(() => {
    const rememberedUser = localStorage.getItem('remember-user');
    if (rememberedUser) {
      setEmail(rememberedUser);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    // For demo purposes, we'll use mock credentials
    // In a real app, you would send these to your backend
    if (email === 'demo@example.com' && password === 'password') {
      const userData = {
        id: '1',
        name: 'Demo User',
        email: 'demo@example.com',
        balance: 100000 // Starting balance in rupees
      };
      
      // Call the login function from AuthContext
      login('mock-jwt-token', userData);
      
      // Save remember me preference if checked
      if (rememberMe) {
        localStorage.setItem('remember-user', email);
      } else {
        localStorage.removeItem('remember-user');
      }
      
      // Navigate to dashboard
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="flex h-screen w-screen">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center items-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          <div className="flex items-center mb-8">
            <svg className="h-8 w-8 text-indigo-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13 8L18 12L13 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h1 className="ml-2 text-2xl font-bold text-indigo-600">GamzStockz</h1>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">Welcome back</h2>
          <p className="text-gray-600 mb-8">Or <Link to="/signup" className="text-indigo-600 font-medium">create a new account</Link></p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
            <p className="font-medium">Demo Credentials:</p>
            <p>Email: demo@example.com</p>
            <p>Password: password</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <button type="button" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </button>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>

      {/* Right Side - Banner */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 flex-col justify-center items-center p-12 text-white">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-bold mb-6">Start Your Trading Journey</h1>
          <p className="text-xl mb-8">
            Experience risk-free stock market trading with virtual money. Learn, practice, and master your trading skills.
          </p>
          
          <div className="grid grid-cols-2 gap-8 mt-12">
            <div className="bg-indigo-500 bg-opacity-30 p-6 rounded-lg">
              <h3 className="text-3xl font-bold mb-2">₹100K</h3>
              <p className="text-indigo-200">Virtual Starting Capital</p>
            </div>
            <div className="bg-indigo-500 bg-opacity-30 p-6 rounded-lg">
              <h3 className="text-3xl font-bold mb-2">0%</h3>
              <p className="text-indigo-200">Real Risk</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
