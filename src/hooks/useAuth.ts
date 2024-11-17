import { create } from 'zustand';
import axios, { AxiosError } from 'axios';

// Set the base URL for Axios
const API_URL = 'http://localhost:8081/api/'; 

const axiosInstance = axios.create({
  baseURL: API_URL,
});

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
}

interface ErrorResponse {
  message: string;
}

// Configure axios
axios.defaults.baseURL = '/api';
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add request interceptor for error handling
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// export const useAuth = create<AuthState>()((set) => ({
//   user: null,
//   token: localStorage.getItem('token'),
  
//   login: async (email: string, password: string) => {
//     try {
//       const response = await axios.post('/auth/login', {
//         email,
//         password,
//       });
      
//       const { token, user } = response.data;
//       localStorage.setItem('token', token);
//       set({ token, user });
//     } catch (error) {
//       const err = error as AxiosError<ErrorResponse>;
//       throw new Error(err.response?.data?.message || 'Login failed');
//     }
//   },

//   register: async (username: string, email: string, password: string, role: string) => {
//     try {
//       const response = await axios.post('/auth/register', {
//         username,
//         email,
//         password,
//         role,
//       });
      
//       const { token, user } = response.data;
//       localStorage.setItem('token', token);
//       set({ token, user });
//     } catch (error) {
//       const err = error as AxiosError<ErrorResponse>;
//       throw new Error(err.response?.data?.message || 'Registration failed');
//     }
//   },

//   logout: () => {
//     localStorage.removeItem('token');
//     set({ token: null, user: null });
//   },
// }));


export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),

  login: async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password,
      });
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      set({ token, user });
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      throw new Error(err.response?.data?.message || 'Login failed');
    }
  },

  register: async (username: string, email: string, password: string, role: string) => {
    try {
      const response = await axiosInstance.post('/auth/register', {
        username,
        email,
        password,
        role,
      });
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      set({ token, user });
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      throw new Error(err.response?.data?.message || 'Registration failed');
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null });
  },
}));