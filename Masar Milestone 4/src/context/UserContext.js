import React, { createContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const UserContext = createContext(null);

// API URL configuration
export const API_URL = Platform.select({
  web: '', // Use relative URLs for web (proxied through packagerOpts)
  default: 'http://172.20.10.9:5001', // iOS simulator, Android, etc.
});

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [balance, setBalance] = useState(0);
  const [token, setToken] = useState(null);
  // Start with empty history; will be loaded from server when available
  const [recentTrips, setRecentTrips] = useState([]);
  const [showScan, setShowScan] = useState(false);
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [appTheme, setAppTheme] = useState('system'); // 'light' | 'dark' | 'system'
  const [appLanguage, setAppLanguage] = useState('en'); // 'en' | 'ar'

  // Load user session on app start
  useEffect(() => {
    (async () => {
      try {
        const storedToken = await AsyncStorage.getItem('masar:token');
        const storedUser = await AsyncStorage.getItem('masar:user');
        const storedTheme = await AsyncStorage.getItem('masar:theme');
        const storedLanguage = await AsyncStorage.getItem('masar:language');

        if (storedToken && storedUser) {
          const userData = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(userData);
          setBalance(userData.balance || 0);
          setIsLoggedIn(true);
        }
        if (storedTheme) {
          setAppTheme(storedTheme);
        }
        if (storedLanguage) {
          setAppLanguage(storedLanguage);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    })();
  }, []);

  // Save user and token when they change
  useEffect(() => {
    if (user && token) {
      AsyncStorage.setItem('masar:user', JSON.stringify(user));
      AsyncStorage.setItem('masar:token', token);
    } else {
      AsyncStorage.removeItem('masar:user');
      AsyncStorage.removeItem('masar:token');
    }
    // persist theme whenever it changes
    if (appTheme) {
      AsyncStorage.setItem('masar:theme', appTheme);
    }
  }, [user, token]);

  // Persist theme when it changes independently
  useEffect(() => {
    if (appTheme) AsyncStorage.setItem('masar:theme', appTheme);
  }, [appTheme]);

  // Persist language when it changes
  useEffect(() => {
    if (appLanguage) AsyncStorage.setItem('masar:language', appLanguage);
  }, [appLanguage]);

  const register = async (email, password, name, phone) => {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, {
        email,
        password,
        name,
        phone
      });

      if (response.data.success) {
        const userData = response.data.user;
        setUser(userData);
        setToken(response.data.token);
        setBalance(userData.balance || 0);
        setIsLoggedIn(true);
        // fetch user's bookings/history
        setTimeout(() => fetchBookings(response.data.token), 400);
        return { success: true };
      }
      
      return { success: false, error: response.data.error || 'Signup failed' };
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Registration failed';
      return { success: false, error: errorMessage };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });

      if (response.data.success) {
        const userData = response.data.user;
        setUser(userData);
        setToken(response.data.token);
        setBalance(userData.balance || 0);
        setIsLoggedIn(true);
        // fetch user's bookings/history
        setTimeout(() => fetchBookings(response.data.token), 400);
        return { success: true };
      }
      
      return { success: false, error: response.data.error || 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Login failed';
      return { success: false, error: errorMessage };
    }
  };

  // Fetch bookings/history from backend for current user
  const fetchBookings = async (maybeToken) => {
    const authToken = maybeToken || token;
    if (!authToken) return;
    try {
      const resp = await axios.get(`${API_URL}/bookings`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });

      if (resp.data.success) {
        const items = resp.data.bookings.map(b => ({
          id: b._id,
          from: b.from,
          to: b.to,
          cost: b.price,
          price: b.price,
          mode: b.type === 'scan' ? 'Scan' : 'Train',
          type: b.type,
          time: new Date(b.createdAt).toLocaleString(),
          duration: b.duration ? `${b.duration} min` : '',
          departureTime: b.departureTime,
          arrivalTime: b.arrivalTime,
          route: b.route,
          date: b.date,
          createdAt: b.createdAt,
        }));
        setRecentTrips(items);
      }
    } catch (err) {
      console.error('Fetch bookings error:', err?.response?.data || err.message || err);
    }
  };

  // Create a booking (intercity train). Deducts balance server-side and returns booking.
  const createBooking = async ({ from, to, date, departureTime, arrivalTime, price, duration, route }) => {
    if (!token || !user) return { success: false, error: 'Not authenticated' };
    try {
      const resp = await axios.post(`${API_URL}/bookings`, { from, to, date, departureTime, arrivalTime, price, duration, route }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (resp.data.success) {
        // update balance and history
        setBalance(resp.data.balance);
        setUser(u => ({ ...u, balance: resp.data.balance }));
        const b = resp.data.booking;
        const entry = {
          id: b._id, from: b.from, to: b.to, cost: b.price, price: b.price,
          mode: 'Train', type: 'train', time: new Date(b.createdAt).toLocaleString(),
          duration: b.duration ? `${b.duration} min` : '',
          departureTime: b.departureTime, arrivalTime: b.arrivalTime,
          route: b.route, date: b.date, createdAt: b.createdAt,
        };
        setRecentTrips(prev => [entry, ...prev].slice(0, 100));
        return { success: true, booking: resp.data.booking };
      }

      return { success: false, error: resp.data.error || 'Booking failed' };
    } catch (err) {
      console.error('Create booking error:', err?.response?.data || err.message || err);
      const message = err.response?.data?.error || err.message || 'Booking failed';
      return { success: false, error: message };
    }
  };

  // Record a scan payment (deduct small fare and store as scan history)
  const recordScan = async ({ amount = 12.5, station = 'Metro Station' } = {}) => {
    if (!token || !user) return { success: false, error: 'Not authenticated' };
    try {
      const resp = await axios.post(`${API_URL}/scan`, { amount, station }, { headers: { Authorization: `Bearer ${token}` } });
      if (resp.data.success) {
        setBalance(resp.data.balance);
        setUser(u => ({ ...u, balance: resp.data.balance }));
        const b = resp.data.booking;
        const entry = { id: b._id, from: b.from, to: b.to, cost: b.price, price: b.price, mode: 'Scan', type: 'scan', time: new Date(b.createdAt).toLocaleString(), duration: '0 min', createdAt: b.createdAt };
        setRecentTrips(prev => [entry, ...prev].slice(0, 100));
        return { success: true, booking: resp.data.booking };
      }
      return { success: false, error: resp.data.error || 'Scan failed' };
    } catch (err) {
      console.error('Record scan error:', err?.response?.data || err.message || err);
      const message = err.response?.data?.error || err.message || 'Scan failed';
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setToken(null);
      setBalance(0);
      setIsLoggedIn(false);
      await AsyncStorage.removeItem('masar:user');
      await AsyncStorage.removeItem('masar:token');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateBalance = async (newBalance) => {
    try {
      if (user && token) {
        const response = await axios.put(`${API_URL}/auth/user/${user.id}/balance`, {
          balance: newBalance
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setBalance(newBalance);
          setUser({ ...user, balance: newBalance });
        }
      }
    } catch (error) {
      console.error('Update balance error:', error);
      // Update locally even if sync fails
      setBalance(newBalance);
    }
  };

  const value = {
    user,
    isLoggedIn,
    token,
    register,
    login,
    logout,
    balance,
    setBalance: updateBalance,
    recentTrips,
    setRecentTrips,
    showScan,
    setShowScan,
    showAddFunds,
    setShowAddFunds,
    appTheme,
    setAppTheme,
    appLanguage,
    setAppLanguage,
    // expose booking/scan helpers for UI components
    fetchBookings,
    createBooking,
    recordScan,
  };
  
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}