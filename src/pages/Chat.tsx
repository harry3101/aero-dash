
import { useState, useEffect, useRef } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import io, { Socket } from "socket.io-client";
import { auth } from "@/utils/firebase";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { MessageList } from "@/components/chat/MessageList";
import { MessageInput } from "@/components/chat/MessageInput";
import { collection, addDoc, query, where, orderBy, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '@/utils/firebase';

interface Message {
  _id: string;
  text: string;
  senderId: string;
  receiverId: string;
  timestamp: Date;
  isCampaignReply?: boolean;
  campaignId?: string;
}

interface Chat {
  _id: string;
  participants: string[];
  lastMessage?: string;
  lastMessageTime?: Date;
  isCampaign?: boolean;
  campaignId?: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const user = auth.currentUser;

  // Fetch or create chat between two users
  const getOrCreateChat = async (otherUserId: string) => {
    if (!user) return null;

    const chatsRef = collection(db, 'chats');
    const q = query(
      chatsRef,
      where('participants', 'array-contains', user.uid)
    );

    const querySnapshot = await getDocs(q);
    let existingChat = null;

    querySnapshot.forEach((doc) => {
      const chatData = doc.data();
      if (chatData.participants.includes(otherUserId)) {
        existingChat = { _id: doc.id, ...chatData };
      }
    });

    if (existingChat) return existingChat;

    // Create new chat if none exists
    const newChat = await addDoc(chatsRef, {
      participants: [user.uid, otherUserId],
      createdAt: new Date(),
    });

    return { _id: newChat.id, participants: [user.uid, otherUserId] };
  };

  useEffect(() => {
    if (!user) return;

    // Listen for chats
    const chatsRef = collection(db, 'chats');
    const q = query(chatsRef, where('participants', 'array-contains', user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedChats: Chat[] = [];
      snapshot.forEach((doc) => {
        updatedChats.push({ _id: doc.id, ...doc.data() } as Chat);
      });
      setChats(updatedChats);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user || !selectedChat) return;

    // Listen for messages in selected chat
    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef,
      where('chatId', '==', selectedChat._id),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedMessages: Message[] = [];
      snapshot.forEach((doc) => {
        updatedMessages.push({ _id: doc.id, ...doc.data() } as Message);
      });
      setMessages(updatedMessages);
    });

    return () => unsubscribe();
  }, [selectedChat, user]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !selectedChat) return;

    try {
      const messagesRef = collection(db, 'messages');
      const messageData = {
        text: newMessage,
        senderId: user.uid,
        receiverId: selectedChat.participants.find(p => p !== user.uid),
        chatId: selectedChat._id,
        timestamp: new Date(),
        isCampaignReply: selectedChat.isCampaign,
        campaignId: selectedChat.campaignId
      };

      await addDoc(messagesRef, messageData);
      setNewMessage("");
      
      toast({
        title: "Success",
        description: "Message sent successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  // Start chat with another user
  const startChat = async (otherUserId: string) => {
    const chat = await getOrCreateChat(otherUserId);
    if (chat) {
      setSelectedChat(chat);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-4">Please log in to chat</h2>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
            <ChatSidebar
              chats={chats}
              selectedChat={selectedChat}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onChatSelect={setSelectedChat}
              currentUserId={user.uid}
            />

            <Card className="col-span-3 h-full">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold">
                    {selectedChat
                      ? `Chat with ${selectedChat.participants.find(
                          (p) => p !== user.uid
                        )}`
                      : 'Select a chat'}
                  </h2>
                </div>

                <MessageList
                  messages={messages}
                  currentUserId={user.uid}
                />

                <MessageInput
                  value={newMessage}
                  onChange={setNewMessage}
                  onSubmit={handleSendMessage}
                  disabled={!selectedChat}
                  isCampaignReply={selectedChat?.isCampaign}
                />
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
