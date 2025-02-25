
import { useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Send, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { auth } from "@/utils/firebase";
import { CampaignForm } from "@/components/campaigns/CampaignForm";
import { sendWhatsAppMessage } from "@/utils/whatsapp";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Contact {
  name: string;
  phone: string;
}

interface Campaign {
  id: string;
  name: string;
  message: string;
  status: "draft" | "active" | "completed";
  recipients: Contact[];
  createdAt: Date;
  description?: string;
  messageType: 'template' | 'text';
  templateName?: string;
}

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const { toast } = useToast();

  const handleCreateCampaign = async (campaignData: Omit<Campaign, 'id' | 'status' | 'createdAt'>) => {
    try {
      const campaign: Campaign = {
        ...campaignData,
        id: Date.now().toString(),
        status: "draft",
        createdAt: new Date(),
      };
      
      setCampaigns([campaign, ...campaigns]);

      toast({
        title: "Success",
        description: "Campaign created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create campaign",
        variant: "destructive",
      });
    }
  };

  const handleSendCampaign = async (campaign: Campaign) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to send campaigns",
          variant: "destructive",
        });
        return;
      }

      let successCount = 0;
      let failCount = 0;

      for (const recipient of campaign.recipients) {
        try {
          await sendWhatsAppMessage({
            type: campaign.messageType,
            to: recipient.phone,
            templateName: campaign.messageType === 'template' ? campaign.templateName : undefined,
            text: campaign.messageType === 'text' ? campaign.message : undefined,
          });
          successCount++;
        } catch (error) {
          console.error(`Failed to send to ${recipient.phone}:`, error);
          failCount++;
        }
      }

      const updatedCampaigns = campaigns.map(c => 
        c.id === campaign.id ? { ...c, status: "completed" as const } : c
      );
      setCampaigns(updatedCampaigns);
      
      toast({
        title: "Campaign Complete",
        description: `Successfully sent to ${successCount} recipients. Failed: ${failCount}`,
        variant: failCount > 0 ? "destructive" : "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send campaign messages",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Campaigns</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Campaign
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Campaign</DialogTitle>
                </DialogHeader>
                <CampaignForm
                  onSubmit={handleCreateCampaign}
                  onFileUpload={(contacts) => {
                    toast({
                      title: "Success",
                      description: `Imported ${contacts.length} contacts`,
                    });
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{campaign.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {campaign.recipients.length} recipients •{" "}
                      {campaign.createdAt.toLocaleDateString()} • {campaign.status}
                    </p>
                    {campaign.description && (
                      <p className="text-sm text-gray-600 mt-2">
                        {campaign.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline">
                      <Users className="h-4 w-4 mr-2" />
                      {campaign.recipients.length} Recipients
                    </Button>
                    <Button
                      onClick={() => handleSendCampaign(campaign)}
                      disabled={campaign.status === "completed"}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Send
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Campaigns;
