import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = Cookies.get('token');
        if (token) {
          const { data } = await axios.get(`${API_URL}/v1/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(data.data.user);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        Cookies.remove('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login with email and password
  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${API_URL}/v1/auth/login`, { email, password });
      setUser(data.data.user);
      Cookies.set('token', data.token, { expires: 30 });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  // Sign up with email and password
  const signup = async (name, email, password, passwordConfirm) => {
    try {
      const { data } = await axios.post(`${API_URL}/v1/auth/signup`, {
        name,
        email,
        password,
        passwordConfirm,
      });
      return { success: true, message: 'Please check your email to verify your account' };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Signup failed' };
    }
  };

  // Login with Google
  const loginWithGoogle = async (token) => {
    try {
      const { data } = await axios.post(`${API_URL}/v1/auth/google`, { token });
      setUser(data.data.user);
      Cookies.set('token', data.token, { expires: 30 });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Google login failed' };
    }
  };

  // Login with GitHub
  const loginWithGitHub = async (code) => {
    try {
      const { data } = await axios.post(`${API_URL}/v1/auth/github`, { code });
      setUser(data.data.user);
      Cookies.set('token', data.token, { expires: 30 });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'GitHub login failed' };
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      await axios.post(`${API_URL}/v1/auth/forgot-password`, { email });
      return { success: true, message: 'Password reset email sent' };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to send reset email' };
    }
  };

  // Reset password
  const resetPassword = async (token, password, passwordConfirm) => {
    try {
      await axios.patch(`${API_URL}/v1/auth/reset-password/${token}`, {
        password,
        passwordConfirm,
      });
      return { success: true, message: 'Password reset successful' };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Password reset failed' };
    }
  };

  // Verify email
  const verifyEmail = async (email, otp) => {
    try {
      const { data } = await axios.post(`${API_URL}/v1/auth/verify-email`, { email, otp });
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Email verification failed' };
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    Cookies.remove('token');
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        loginWithGoogle,
        loginWithGitHub,
        forgotPassword,
        resetPassword,
        verifyEmail,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
