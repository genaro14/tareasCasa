const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiService {
  static getToken() {
    return localStorage.getItem('auth_token');
  }

  static setToken(token) {
    localStorage.setItem('auth_token', token);
  }

  static removeToken() {
    localStorage.removeItem('auth_token');
  }

  static async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (response.status === 204) {
        return null;
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 401) {
          this.removeToken();
          window.dispatchEvent(new Event('auth:logout'));
        }
        throw new Error(data.error || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  static get(endpoint, params = {}) {
    const searchParams = new URLSearchParams(params).toString();
    const url = searchParams ? `${endpoint}?${searchParams}` : endpoint;
    return this.request(url);
  }

  static post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  static delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

// Auth API
export const authApi = {
  login: (username, password) => ApiService.post('/auth/login', { username, password }),
  me: () => ApiService.get('/auth/me'),
  changePassword: (currentPassword, newPassword) => 
    ApiService.post('/auth/change-password', { currentPassword, newPassword }),
  logout: () => {
    ApiService.removeToken();
    window.dispatchEvent(new Event('auth:logout'));
  },
  setToken: (token) => ApiService.setToken(token),
  getToken: () => ApiService.getToken(),
  isAuthenticated: () => !!ApiService.getToken(),
};

// Meals API
export const mealsApi = {
  getAll: (params) => ApiService.get('/meals', params),
  getByDate: (date) => ApiService.get(`/meals/date/${date}`),
  create: (data) => ApiService.post('/meals', data),
  update: (id, data) => ApiService.put(`/meals/${id}`, data),
  delete: (id) => ApiService.delete(`/meals/${id}`),
  deleteByDate: (date) => ApiService.delete(`/meals/date/${date}`),
};

// Grocery API
export const groceryApi = {
  getAll: (params) => ApiService.get('/grocery-items', params),
  getById: (id) => ApiService.get(`/grocery-items/${id}`),
  create: (data) => ApiService.post('/grocery-items', data),
  update: (id, data) => ApiService.put(`/grocery-items/${id}`, data),
  toggleActive: (id) => ApiService.patch(`/grocery-items/${id}/toggle`),
  delete: (id) => ApiService.delete(`/grocery-items/${id}`),
};

// Tasks API
export const tasksApi = {
  getAll: (params) => ApiService.get('/tasks', params),
  getByDate: (date) => ApiService.get(`/tasks/date/${date}`),
  create: (data) => ApiService.post('/tasks', data),
  update: (id, data) => ApiService.put(`/tasks/${id}`, data),
  cycleStatus: (id) => ApiService.patch(`/tasks/${id}/cycle-status`),
  delete: (id) => ApiService.delete(`/tasks/${id}`),
};

// Schedules API
export const schedulesApi = {
  getAll: (params) => ApiService.get('/schedules', params),
  getById: (id) => ApiService.get(`/schedules/${id}`),
  getUsers: () => ApiService.get('/schedules/users'),
  create: (data) => ApiService.post('/schedules', data),
  update: (id, data) => ApiService.put(`/schedules/${id}`, data),
  delete: (id) => ApiService.delete(`/schedules/${id}`),
};

export default ApiService;
