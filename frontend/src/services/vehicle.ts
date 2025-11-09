import apiClient from './api';
import { Vehicle } from '../types/api';

interface VehicleListResponse {
  vehicles: Vehicle[];
  total: number;
  page: number;
  totalPages: number;
}

class VehicleService {
  // Get all vehicles
  async getVehicles(): Promise<Vehicle[]> {
    const response = await apiClient.get<VehicleListResponse>('/vehicle');
    return response.data.vehicles;
  }

  // Get vehicle by ID
  async getVehicleById(id: number): Promise<Vehicle> {
    const response = await apiClient.get<Vehicle>(`/vehicle/${id}`);
    return response.data;
  }

  // Search vehicles with filters
  async searchVehicles(filters?: {
    make?: string;
    model?: string;
    year?: number;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Vehicle[]> {
    const response = await apiClient.get<Vehicle[]>('/vehicle/search', {
      params: filters,
    });
    return response.data;
  }
}

export default new VehicleService();
