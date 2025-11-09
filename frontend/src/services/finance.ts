import apiClient from './api';
import { FinanceCalculation } from '../types/api';

interface CreditTier {
  tier: string;
  aprRate: number;
  description: string;
}

interface CreditTiersResponse {
  creditTiers: CreditTier[];
}

class FinanceService {
  // Get credit tiers
  async getCreditTiers(): Promise<CreditTier[]> {
    const response = await apiClient.get<CreditTiersResponse>('/finance/credit-tiers');
    return response.data.creditTiers;
  }

  // Calculate monthly payment
  async calculatePayment(params: {
    price: number;
    downPayment: number;
    creditTier: string;
    termMonths: number;
    purchaseType: 'finance' | 'lease';
  }): Promise<FinanceCalculation> {
    const response = await apiClient.post<FinanceCalculation>(
      '/finance/calculate',
      params
    );
    return response.data;
  }

  // Save a financing quote
  async saveQuote(quoteData: {
    userId: number;
    vehicleId: number;
    price: number;
    downPayment: number;
    termMonths: number;
    creditTier: string;
    purchaseType: string;
  }): Promise<{ message: string; quote: any }> {
    const response = await apiClient.post('/finance/quotes', quoteData);
    return response.data;
  }

  // Get user's saved quotes
  async getUserQuotes(): Promise<any[]> {
    const response = await apiClient.get('/finance/quotes');
    return response.data.quotes || [];
  }

  // Get specific quote
  async getQuote(quoteId: number): Promise<any> {
    const response = await apiClient.get(`/finance/quotes/${quoteId}`);
    return response.data;
  }

  // Update quote
  async updateQuote(quoteId: number, updates: any): Promise<any> {
    const response = await apiClient.put(`/finance/quotes/${quoteId}`, updates);
    return response.data;
  }

  // Delete quote
  async deleteQuote(quoteId: number): Promise<void> {
    await apiClient.delete(`/finance/quotes/${quoteId}`);
  }
}

export default new FinanceService();
