import apiClient from './api';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../types/api';

class AuthService {
  // Login user
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);

    // Store token and user data
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;
  }

  // Register new user
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', userData);

    // Store token and user data
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;
  }

  // Logout user
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    // Remove any other auth-related data
    localStorage.removeItem('selectedCar');
    localStorage.removeItem('financeDetails');
  }

  // Get current user from localStorage
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // Get auth token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Get user profile
  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>('/user/profile');

    // Update stored user data
    localStorage.setItem('user', JSON.stringify(response.data));

    return response.data;
  }

  // Update user email (only supported update in backend)
  async updateEmail(email: string): Promise<{ message: string }> {
    const response = await apiClient.put('/user/email', { email });
    return response.data;
  }
}

export default new AuthService();
