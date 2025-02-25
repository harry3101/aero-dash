
import { useRef, useEffect } from "react";
import { auth } from "@/utils/firebase";

interface Message {
  _id: string;
  text: string;
  senderId: string;
  receiverId: string;
  timestamp: Date;
  isCampaignReply?: boolean;
  campaignId?: string;
}

interface MessageListProps {
  messages: Message[];
  currentUserId?: string;
}

export const MessageList = ({ messages, currentUserId }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message._id}
          className={`flex ${
            message.senderId === currentUserId ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[70%] rounded-lg p-3 ${
              message.senderId === currentUserId
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            }`}
          >
            <p>{message.text}</p>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs opacity-70">
                {formatTime(message.timestamp)}
              </span>
              {message.isCampaignReply && (
                <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full ml-2">
                  Campaign Reply
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
