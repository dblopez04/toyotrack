import apiClient from './api';

interface UserPreferences {
  budget?: number | null;
  carType?: string | null;
  fuelType?: string | null;
}

interface UserFinances {
  creditTier?: string | null;
}

interface UserPreferencesResponse {
  UserPreferences: UserPreferences;
}

interface UserFinancesResponse {
  UserFinance: UserFinances;
}

class UserService {
  // Get user preferences
  async getPreferences(): Promise<UserPreferencesResponse> {
    const response = await apiClient.get('/user/preferences');
    return response.data;
  }

  // Set/update user preferences
  async setPreferences(preferences: UserPreferences): Promise<{ message: string }> {
    const response = await apiClient.post('/user/preferences', preferences);
    return response.data;
  }

  // Get user finances
  async getFinances(): Promise<UserFinancesResponse> {
    const response = await apiClient.get('/user/finances');
    return response.data;
  }

  // Set/update user finances
  async setFinances(finances: UserFinances): Promise<{ message: string }> {
    const response = await apiClient.post('/user/finances', finances);
    return response.data;
  }

  // Get all bookmarks
  async getBookmarks(): Promise<{ vehicleIds: number[] }> {
    const response = await apiClient.get('/user/bookmarks');
    return response.data;
  }

  // Add bookmark (saved car)
  async addBookmark(vehicleId: number): Promise<{ message: string }> {
    const response = await apiClient.post(`/user/bookmarks/${vehicleId}`);
    return response.data;
  }

  // Remove bookmark
  async removeBookmark(vehicleId: number): Promise<{ message: string }> {
    const response = await apiClient.delete(`/user/bookmarks/${vehicleId}`);
    return response.data;
  }

  // Complete onboarding
  async completeOnboarding(): Promise<{ message: string }> {
    const response = await apiClient.post('/user/onboarding/complete');
    return response.data;
  }
}

export default new UserService();
