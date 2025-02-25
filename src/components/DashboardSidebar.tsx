
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Settings, 
  Users,
  Megaphone
} from "lucide-react";

export const DashboardSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white p-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
        
        <Button
          variant={isActive("/dashboard/chat") ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => navigate("/dashboard/chat")}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Chat
        </Button>

        <Button
          variant={isActive("/dashboard/contacts") ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => navigate("/dashboard/contacts")}
        >
          <Users className="mr-2 h-4 w-4" />
          Contacts
        </Button>

        <Button
          variant={isActive("/dashboard/campaigns") ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => navigate("/dashboard/campaigns")}
        >
          <Megaphone className="mr-2 h-4 w-4" />
          Campaigns
        </Button>

        <Button
          variant={isActive("/dashboard/settings") ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => navigate("/dashboard/settings")}
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  );
};
