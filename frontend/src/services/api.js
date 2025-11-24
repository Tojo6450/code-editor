import axios from 'axios';


const api = axios.create({
  baseURL: 'https://code-editor-30tn.onrender.com/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
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


export const UserAPI = {
  // Register a new user (sends OTP)
  register: (name, email) => api.post('/user/register', { name, email }),

  // Verify OTP and Login
  verify: (otp, verifyToken) => api.post('/user/verify', { otp, verifyToken }),

  // Get current user profile
  getProfile: () => api.get('/user/profile'),
};

export const ChatAPI = {

  createSession: () => api.post('/chat/new'),

  getAllSessions: () => api.get('/chat/all'),

  getConversation: (id) => api.get(`/chat/conv/${id}`),

  generateCode: (sessionId, prompt) => api.post(`/chat/add/${sessionId}`, { prompt }),

  deleteSession: (id) => api.delete(`/chat/${id}`),
};

export default api;