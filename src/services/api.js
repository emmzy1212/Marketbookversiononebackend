import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

const api = {
  // Auth endpoints
  registerUser: (userData) => {
    return axios.post(`${API_URL}/users/register`, userData)
  },
  
  registerAdmin: (adminData) => {
    return axios.post(`${API_URL}/users/register-admin`, adminData)
  },
  
  loginUser: (credentials) => {
    return axios.post(`${API_URL}/users/login`, credentials)
  },
  
  getUserProfile: () => {
    const user = JSON.parse(localStorage.getItem('user'))
    return axios.get(`${API_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${user?.token}` }
    })
  },

  updateUserProfile: (profileData) => {
    const user = JSON.parse(localStorage.getItem('user'))
    return axios.put(`${API_URL}/users/profile`, profileData, {
      headers: { Authorization: `Bearer ${user?.token}` }
    })
  },
  
  getAllUsers: () => {
    const user = JSON.parse(localStorage.getItem('user'))
    return axios.get(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${user?.token}` }
    })
  },

  // Notification endpoints
  getUserNotifications: () => {
    const user = JSON.parse(localStorage.getItem('user'))
    return axios.get(`${API_URL}/users/notifications`, {
      headers: { Authorization: `Bearer ${user?.token}` }
    })
  },

  markNotificationRead: (notificationId) => {
    const user = JSON.parse(localStorage.getItem('user'))
    return axios.put(`${API_URL}/users/notifications/${notificationId}/read`, {}, {
      headers: { Authorization: `Bearer ${user?.token}` }
    })
  },

  // Admin endpoints
  getAuditLogs: (params = {}) => {
    const user = JSON.parse(localStorage.getItem('user'))
    const queryString = new URLSearchParams(params).toString()
    return axios.get(`${API_URL}/users/audit-logs?${queryString}`, {
      headers: { Authorization: `Bearer ${user?.token}` }
    })
  },

  getDashboardStats: () => {
    const user = JSON.parse(localStorage.getItem('user'))
    return axios.get(`${API_URL}/users/dashboard-stats`, {
      headers: { Authorization: `Bearer ${user?.token}` }
    })
  },
  
  // Item endpoints
  getItems: () => {
    const user = JSON.parse(localStorage.getItem('user'))
    return axios.get(`${API_URL}/items`, {
      headers: { Authorization: `Bearer ${user?.token}` }
    })
  },
  
  getAllItemsAdmin: () => {
    const user = JSON.parse(localStorage.getItem('user'))
    return axios.get(`${API_URL}/items/admin/all`, {
      headers: { Authorization: `Bearer ${user?.token}` }
    })
  },

  getItemStats: () => {
    const user = JSON.parse(localStorage.getItem('user'))
    return axios.get(`${API_URL}/items/stats`, {
      headers: { Authorization: `Bearer ${user?.token}` }
    })
  },
  
  getItemById: (id) => {
    const user = JSON.parse(localStorage.getItem('user'))
    return axios.get(`${API_URL}/items/${id}`, {
      headers: { Authorization: `Bearer ${user?.token}` }
    })
  },
  
  createItem: (itemData) => {
    const user = JSON.parse(localStorage.getItem('user'))
    return axios.post(`${API_URL}/items`, itemData, {
      headers: { 
        Authorization: `Bearer ${user?.token}`,
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  
  updateItem: (id, itemData) => {
    const user = JSON.parse(localStorage.getItem('user'))
    return axios.put(`${API_URL}/items/${id}`, itemData, {
      headers: { 
        Authorization: `Bearer ${user?.token}`,
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  
  deleteItem: (id) => {
    const user = JSON.parse(localStorage.getItem('user'))
    return axios.delete(`${API_URL}/items/${id}`, {
      headers: { Authorization: `Bearer ${user?.token}` }
    })
  },

  // Financial endpoints
  getFinancialSummary: () => {
    const user = JSON.parse(localStorage.getItem('user'))
    return axios.get(`${API_URL}/items/financial-summary`, {
      headers: { Authorization: `Bearer ${user?.token}` }
    })
  },

  getItemsByPaymentStatus: (status) => {
    const user = JSON.parse(localStorage.getItem('user'))
    return axios.get(`${API_URL}/items/by-payment-status/${status}`, {
      headers: { Authorization: `Bearer ${user?.token}` }
    })
  }
}

export default api