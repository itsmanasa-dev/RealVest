import { apiClient } from './client';

export interface AdvisorChatRequest {
  message: string;
  context?: Record<string, any>;
}

export interface AdvisorChatResponse {
  reply: string;
  sources: string[];
  context_used: Record<string, any>;
}

export const advisorApi = {
  async sendMessage(message: string, context?: Record<string, any>): Promise<AdvisorChatResponse> {
    return apiClient<AdvisorChatResponse>('/api/advisor/chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        context,
      }),
    });
  },
};
