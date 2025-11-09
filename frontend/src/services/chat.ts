import apiClient from './api';
import { ChatResponse } from '../types/api';

class ChatService {
  // Send message to chatbot
  async sendMessage(message: string, history?: Array<{ role: string; content: string }>): Promise<ChatResponse> {
    const response = await apiClient.post<ChatResponse>('/chatbot/send-message', {
      message,
      history,
    });
    return response.data;
  }
}

export default new ChatService();
