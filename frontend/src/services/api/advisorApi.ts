import { apiClient } from './client';

export interface AdvisorChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AdvisorChatRequest {
  message: string;
  context?: Record<string, any>;
  history?: AdvisorChatMessage[];
}

export interface AdvisorChatResponse {
  success?: boolean;
  reply: string;
  sources: string[];
  context_used: Record<string, any>;
}

export const advisorApi = {
  async sendMessage(
    message: string,
    context?: Record<string, any>,
    history?: AdvisorChatMessage[]
  ): Promise<AdvisorChatResponse> {
    return apiClient<AdvisorChatResponse>('/api/advisor/chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        context,
        history,
      }),
    });
  },
};

