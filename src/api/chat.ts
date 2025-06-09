const API_BASE_URL = '/api';

export const chatApi = {
  // Get all conversations
  async getConversations() {
    const response = await fetch(`${API_BASE_URL}/chat`);
    if (!response.ok) throw new Error('Failed to fetch conversations');
    return response.json();
  },

  // Create a new conversation
  async createConversation(title: string) {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    if (!response.ok) throw new Error('Failed to create conversation');
    return response.json();
  },

  // Add a message to a conversation
  async addMessage(conversationId: string, content: string, attachments?: any[]) {
    const formData = new FormData();
    formData.append('content', content);
    formData.append('sender', 'user');
    
    if (attachments) {
      attachments.forEach(attachment => {
        if (attachment.url.startsWith('data:')) {
          // Convert base64 to blob
          const base64Data = attachment.url.split(',')[1];
          const blob = base64ToBlob(base64Data, attachment.type);
          formData.append('attachments', blob, attachment.name);
        }
      });
    }

    const response = await fetch(`${API_BASE_URL}/chat/${conversationId}/messages`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) throw new Error('Failed to send message');
    return response.json();
  },

  // Delete a conversation
  async deleteConversation(id: string) {
    const response = await fetch(`${API_BASE_URL}/chat/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete conversation');
    return true;
  }
};

// Helper function to convert base64 to blob
function base64ToBlob(base64: string, type: string): Blob {
  const byteCharacters = atob(base64);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  return new Blob(byteArrays, { type });
}
