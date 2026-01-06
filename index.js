// index.js - Main WhatsApp Bot Application

require('dotenv').config();
const express = require('express');
const config = require('./config');
const whatsappService = require('./whatsappService');
const googleSheetsService = require('./googleSheetsService');
const menuSystem = require('./menuSystem');

const app = express();
app.use(express.json());

// Initialize Google Sheets (optional, can be skipped for testing)
// Uncomment when you have valid Google credentials
// googleSheetsService.initialize();

console.log('🤖 WhatsApp Bot Starting...');
console.log('📋 Make sure to update config.js with your Meta credentials');

// Webhook verification endpoint
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log('Webhook verification request received');

  if (mode === 'subscribe' && token === config.verifyToken) {
    console.log('✅ Webhook verified successfully!');
    res.status(200).send(challenge);
  } else {
    console.log('❌ Webhook verification failed');
    res.sendStatus(403);
  }
});

// Webhook endpoint to receive messages
app.post('/webhook', async (req, res) => {
  try {
    console.log('Incoming webhook:', JSON.stringify(req.body, null, 2));

    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;

    if (messages && messages.length > 0) {
      const message = messages[0];
      const from = message.from; // Sender's phone number
      const messageId = message.id;
      const messageText = message.text?.body || '';

      console.log(`📩 Message received from ${from}: ${messageText}`);

      // Mark message as read
      await whatsappService.markAsRead(messageId);

      // Check if user is authorized
      // For testing, use mock authorization
      const isAuthorized = await checkAuthorization(from);
      
      if (!isAuthorized) {
        console.log(`❌ Unauthorized user: ${from}`);
        await whatsappService.sendMessage(
          from,
          '🚫 *Unauthorized Access*\n\nSorry, your number is not registered in our system. Please contact the administrator to get access.'
        );
        res.sendStatus(200);
        return;
      }

      console.log(`✅ Authorized user: ${from}`);

      // Process menu navigation
      const menuResponse = menuSystem.handleUserInput(from, messageText);
      await whatsappService.sendMessage(from, menuResponse.text);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.sendStatus(500);
  }
});

// Authorization check function
async function checkAuthorization(phoneNumber) {
  // Check if testing mode is enabled from environment variables
  const TESTING_MODE = config.testingMode;
  
  if (TESTING_MODE) {
    console.log('Testing mode: Authorizing all users');
    return true;
  }
  
  // Production mode - check Google Sheets
  try {
    return await googleSheetsService.isUserAuthorized(phoneNumber);
  } catch (error) {
    console.error('Authorization check error:', error);
    return false;
  }
}

// Test endpoint to send messages manually
app.post('/send-test', async (req, res) => {
  try {
    const { to, message } = req.body;
    
    if (!to || !message) {
      return res.status(400).json({ error: 'Missing "to" or "message" in request body' });
    }

    await whatsappService.sendMessage(to, message);
    res.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'running',
    message: 'WhatsApp Bot is active',
    endpoints: {
      webhook_verification: 'GET /webhook',
      webhook_receiver: 'POST /webhook',
      test_send: 'POST /send-test'
    }
  });
});

const PORT = config.port || 3000;
app.listen(PORT, () => {
  console.log(`\n✅ Server running on port ${PORT}`);
  console.log(`📍 Webhook URL: http://localhost:${PORT}/webhook`);
  console.log(`\n📝 Setup Instructions:`);
  console.log(`1. Update config.js with your Meta WhatsApp API credentials`);
  console.log(`2. Use ngrok or similar tool to expose your local server`);
  console.log(`3. Configure webhook URL in Meta App Dashboard`);
  console.log(`4. Update Google Sheets credentials in googleSheetsService.js`);
  console.log(`5. Add authorized phone numbers to your Google Sheet`);
  console.log(`\n🚀 Bot is ready to receive messages!\n`);
});
