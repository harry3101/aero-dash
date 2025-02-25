import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Upload } from "lucide-react";
import Papa from "papaparse";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Contact {
  name: string;
  phone: string;
}

interface CampaignFormProps {
  onSubmit: (campaign: {
    name: string;
    message: string;
    description: string;
    recipients: Contact[];
    messageType: 'template' | 'text';
    templateName?: string;
  }) => void;
}

export const CampaignForm = ({ onSubmit }: CampaignFormProps) => {
  const [newContact, setNewContact] = useState<Contact>({ name: "", phone: "" });
  const [formData, setFormData] = useState({
    name: "",
    message: "",
    description: "",
    recipients: [] as Contact[],
    messageType: 'text' as 'template' | 'text',
    templateName: "hello_world",
  });

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) return;
    setFormData(prev => ({
      ...prev,
      recipients: [...prev.recipients, newContact],
    }));
    setNewContact({ name: "", phone: "" });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const contacts: Contact[] = results.data.map((row: any) => ({
          name: row.name,
          phone: row.phone,
        }));
        setFormData(prev => ({ ...prev, recipients: [...prev.recipients, ...contacts] }));
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: "",
      message: "",
      description: "",
      recipients: [],
      messageType: 'text',
      templateName: "hello_world",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input placeholder="Campaign Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />

      <Select value={formData.messageType} onValueChange={(value: 'template' | 'text') => setFormData({ ...formData, messageType: value })}>
        <SelectTrigger><SelectValue placeholder="Message Type" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="text">Custom Message</SelectItem>
          <SelectItem value="template">Template Message</SelectItem>
        </SelectContent>
      </Select>

      {formData.messageType === 'template' ? (
        <Select value={formData.templateName} onValueChange={(value) => setFormData({ ...formData, templateName: value })}>
          <SelectTrigger><SelectValue placeholder="Select Template" /></SelectTrigger>
          <SelectContent><SelectItem value="hello_world">Hello World</SelectItem></SelectContent>
        </Select>
      ) : (
        <Textarea placeholder="Campaign Message" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows={4} required />
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium">Add Contact</label>
        <div className="flex gap-2">
          <Input placeholder="Name" value={newContact.name} onChange={(e) => setNewContact({ ...newContact, name: e.target.value })} />
          <Input placeholder="Phone Number" value={newContact.phone} onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })} />
          <Button type="button" onClick={handleAddContact}><Plus className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Import Contacts (CSV)</label>
        <div className="flex items-center gap-2">
          <Input type="file" accept=".csv" onChange={handleFileUpload} />
          <Upload className="h-5 w-5" />
        </div>
      </div>

      {formData.recipients.length > 0 && (
        <div>
          <p className="text-sm text-gray-500 mb-2">{formData.recipients.length} contacts added</p>
          <div className="max-h-40 overflow-y-auto border rounded-md p-2">
            {formData.recipients.map((contact, index) => (
              <div key={index} className="flex items-center justify-between py-1">
                <span>{contact.name} • {contact.phone}</span>
                <Button variant="ghost" size="sm" onClick={() => {
                  const newRecipients = [...formData.recipients];
                  newRecipients.splice(index, 1);
                  setFormData({ ...formData, recipients: newRecipients });
                }}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <Button type="submit" className="w-full">Create Campaign</Button>
    </form>
  );
};
