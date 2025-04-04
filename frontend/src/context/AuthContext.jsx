import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Check for token and user data in cookies or localStorage
      const storedToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth-token='))
        ?.split('=')[1];
      
      const storedUser = document.cookie
        .split('; ')
        .find(row => row.startsWith('user-data='))
        ?.split('=')[1];

      if (storedToken && storedUser) {
        setToken(storedToken);
        try {
          const parsedUser = JSON.parse(decodeURIComponent(storedUser));
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing user data:', error);
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (newToken, userData) => {
    try {
      setToken(newToken);
      setUser(userData);
      // Set cookies with token and user data
      document.cookie = `auth-token=${newToken}; path=/`;
      document.cookie = `user-data=${encodeURIComponent(JSON.stringify(userData))}; path=/`;
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const logout = () => {
    try {
      setToken(null);
      setUser(null);
      // Remove cookies
      document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      document.cookie = 'user-data=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const value = {
    token,
    user,
    login,
    logout,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 