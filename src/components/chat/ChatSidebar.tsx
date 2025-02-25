
import { User, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface Chat {
  _id: string;
  participants: string[];
  lastMessage?: string;
  lastMessageTime?: Date;
}

interface ChatSidebarProps {
  chats: Chat[];
  selectedChat: Chat | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onChatSelect: (chat: Chat) => void;
  currentUserId?: string;
}

export const ChatSidebar = ({
  chats,
  selectedChat,
  searchQuery,
  onSearchChange,
  onChatSelect,
  currentUserId,
}: ChatSidebarProps) => {
  const filteredChats = chats.filter(chat => {
    const otherParticipant = chat.participants.find(p => p !== currentUserId) || "";
    return otherParticipant.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <Card className="col-span-1 h-full overflow-y-auto">
      <div className="p-4 border-b space-y-4">
        <h2 className="text-lg font-semibold">Chats</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search users..."
            className="pl-10"
          />
        </div>
      </div>
      <div className="p-2 space-y-2">
        {filteredChats.map((chat) => (
          <button
            key={chat._id}
            onClick={() => onChatSelect(chat)}
            className={`w-full p-3 rounded-lg flex items-center space-x-3 hover:bg-gray-100 ${
              selectedChat?._id === chat._id ? 'bg-gray-100' : ''
            }`}
          >
            <User className="h-8 w-8 text-gray-400" />
            <div className="text-left">
              <p className="font-medium">
                {chat.participants.find(p => p !== currentUserId)}
              </p>
              {chat.lastMessage && (
                <p className="text-sm text-gray-500 truncate">
                  {chat.lastMessage}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
};
