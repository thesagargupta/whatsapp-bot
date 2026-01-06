// googleSheetsService.js - Google Sheets Integration for User Authorization

const { google } = require('googleapis');
const config = require('./config');

class GoogleSheetsService {
  constructor() {
    // Get credentials from environment variables
    this.credentials = {
      client_email: config.googleServiceAccountEmail,
      private_key: config.googlePrivateKey ? config.googlePrivateKey.replace(/\\n/g, '\n') : null
    };
    
    this.sheetId = config.googleSheetId;
    this.auth = null;
    this.sheets = null;
  }

  async initialize() {
    try {
      this.auth = new google.auth.JWT(
        this.credentials.client_email,
        null,
        this.credentials.private_key,
        ['https://www.googleapis.com/auth/spreadsheets.readonly']
      );

      await this.auth.authorize();
      this.sheets = google.sheets({ version: 'v4', auth: this.auth });
      console.log('Google Sheets API initialized successfully');
    } catch (error) {
      console.error('Error initializing Google Sheets:', error.message);
    }
  }

  async isUserAuthorized(phoneNumber) {
    try {
      if (!this.sheets) {
        console.log('Google Sheets not initialized, skipping authorization check');
        return false;
      }

      // Read from Sheet1, column A (adjust range as needed)
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.sheetId,
        range: 'Sheet1!A:A', // Assuming phone numbers are in column A
      });

      const rows = response.data.values || [];
      const authorizedNumbers = rows.flat().map(num => num.trim());
      
      // Clean phone number for comparison (remove +, spaces, etc.)
      const cleanNumber = phoneNumber.replace(/\D/g, '');
      
      return authorizedNumbers.some(num => 
        num.replace(/\D/g, '').includes(cleanNumber) || 
        cleanNumber.includes(num.replace(/\D/g, ''))
      );
    } catch (error) {
      console.error('Error checking user authorization:', error.message);
      return false;
    }
  }

  // For testing: Mock authorization
  async isUserAuthorizedMock(phoneNumber) {
    // Hardcoded authorized numbers for testing
    const authorizedNumbers = [
      '1234567890',
      '9876543210',
      // Add your test numbers here
    ];
    
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    return authorizedNumbers.some(num => cleanNumber.includes(num));
  }
}

module.exports = new GoogleSheetsService();
