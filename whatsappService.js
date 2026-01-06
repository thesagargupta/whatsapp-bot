// whatsappService.js - WhatsApp API Service

const axios = require('axios');
const config = require('./config');

class WhatsAppService {
  constructor() {
    this.token = config.whatsappToken;
    this.phoneNumberId = config.phoneNumberId;
    this.apiUrl = `https://graph.facebook.com/v18.0/${this.phoneNumberId}/messages`;
  }

  async sendMessage(to, message) {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          messaging_product: 'whatsapp',
          to: to,
          type: 'text',
          text: {
            body: message
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Message sent successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error.response?.data || error.message);
      throw error;
    }
  }

  async markAsRead(messageId) {
    try {
      await axios.post(
        this.apiUrl,
        {
          messaging_product: 'whatsapp',
          status: 'read',
          message_id: messageId
        },
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      console.error('Error marking message as read:', error.message);
    }
  }
}

module.exports = new WhatsAppService();
