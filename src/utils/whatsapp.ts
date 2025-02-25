
const WHATSAPP_API_URL = 'https://graph.facebook.com/v20.0/423527180850875/messages';
const ACCESS_TOKEN = 'EAAHXFrFTZArgBO2fxyfWeAKWVe49MpZAMNy9UnRlJLfLQb5i8KmyQdgYfFzVbMbh8AHizZAdSIDzlc2FciHeTMRYTju2cXJq3jwxDs5ZC7GOM9GGZAZBsZAZBhPdauZCksvWOI37FW4uqnfpWnZCEkDjZBhiDwABKvuvuBQndNv3qau0tHEKg8zotuVn9PWAlOsvzM0EAZDZD';

const formatPhoneNumber = (phone: string) => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.startsWith('91') ? cleaned : `91${cleaned}`;
};

interface WhatsAppMessage {
  type: 'template' | 'text';
  to: string;
  templateName?: string;
  templateLanguage?: string;
  text?: string;
}

export const sendWhatsAppMessage = async (message: WhatsAppMessage) => {
  const { type, to, templateName, templateLanguage, text } = message;
  const formattedNumber = formatPhoneNumber(to);

  let body: any = {
    messaging_product: "whatsapp",
    to: formattedNumber,
    type: type,
  };

  if (type === 'template') {
    body.template = {
      name: templateName,
      language: {
        code: templateLanguage || 'en_US'
      }
    };
  } else {
    body.text = { body: text };
  }

  const response = await fetch(WHATSAPP_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to send WhatsApp message');
  }

  return data;
};
