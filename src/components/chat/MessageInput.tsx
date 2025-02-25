
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled?: boolean;
  isCampaignReply?: boolean;
}

export const MessageInput = ({
  value,
  onChange,
  onSubmit,
  disabled,
  isCampaignReply
}: MessageInputProps) => {
  return (
    <form onSubmit={onSubmit} className="p-4 border-t">
      <div className="flex space-x-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={isCampaignReply ? "Reply to campaign..." : "Type a message..."}
          className="flex-1"
          disabled={disabled}
        />
        <Button type="submit" disabled={disabled}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};
