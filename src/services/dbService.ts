export interface UserData {
  email: string;
  name?: string;
  mobile?: string;
  onboarding?: any;
  progress?: any;
  isPro?: boolean;
}

export const dbService = {
  async syncUser(data: UserData) {
    const response = await fetch('/api/user/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async getUser(email: string) {
    const response = await fetch(`/api/user/${email}`);
    if (!response.ok) return null;
    return response.json();
  },

  async getChatHistory(email: string) {
    const response = await fetch(`/api/chat/${email}`);
    return response.json();
  },

  async saveChatMessage(email: string, message: { role: string; text: string; correction?: string; translation?: string; explanation?: string }) {
    const response = await fetch('/api/chat/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, ...message }),
    });
    return response.json();
  }
};
