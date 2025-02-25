
interface MessageDocument {
  _id?: string;
  campaignId?: string;
  senderId: string;
  receiverId: string;
  message: string;
  status: 'sent' | 'failed';
  timestamp: Date;
}

interface ChatDocument {
  _id?: string;
  participants: string[];
  lastMessage?: string;
  lastMessageTime?: Date;
  createdAt: Date;
}

const API_URL = '/api'; // This will be handled by your backend server

export const saveMessage = async (messageData: Omit<MessageDocument, '_id'>) => {
  try {
    const response = await fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData),
    });

    if (!response.ok) {
      throw new Error('Failed to save message');
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
};

export const getMessages = async (senderId: string, receiverId: string) => {
  try {
    const response = await fetch(
      `${API_URL}/messages?senderId=${senderId}&receiverId=${receiverId}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const createOrUpdateChat = async (participants: string[]) => {
  try {
    const response = await fetch(`${API_URL}/chats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ participants }),
    });

    if (!response.ok) {
      throw new Error('Failed to create/update chat');
    }

    return await response.json();
  } catch (error) {
    console.error('Error with chat:', error);
    throw error;
  }
};

export const getUserChats = async (userId: string) => {
  try {
    const response = await fetch(`${API_URL}/chats?userId=${userId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch user chats');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user chats:', error);
    throw error;
  }
};
