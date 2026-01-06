// config.js - Configuration using environment variables
require('dotenv').config();

const config = {
  // Meta WhatsApp API Configuration
  whatsappToken: process.env.WHATSAPP_TOKEN,
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
  verifyToken: process.env.VERIFY_TOKEN,
  whatsappBusinessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID,
  appId: process.env.APP_ID,
  appSecret: process.env.APP_SECRET,
  
  // Google Sheets Configuration
  googleSheetId: process.env.GOOGLE_SHEET_ID,
  googleServiceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  googlePrivateKey: process.env.GOOGLE_PRIVATE_KEY,
  
  // Server Configuration
  port: process.env.PORT || 3000,
  
  // Testing mode
  testingMode: process.env.TESTING_MODE === 'true' || true,
};

// Validate required environment variables
const requiredEnvVars = [
  'WHATSAPP_TOKEN',
  'WHATSAPP_PHONE_NUMBER_ID',
  'VERIFY_TOKEN'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.warn('⚠️  Warning: Missing environment variables:', missingVars.join(', '));
}

module.exports = config;
