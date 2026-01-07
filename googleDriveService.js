// googleDriveService.js - Google Drive Integration for File Sharing

const { google } = require('googleapis');
const config = require('./config');

class GoogleDriveService {
  constructor() {
    // Get credentials from environment variables
    this.credentials = {
      client_email: config.googleServiceAccountEmail,
      private_key: config.googlePrivateKey ? config.googlePrivateKey.replace(/\\n/g, '\n') : null
    };
    
    this.parentFolderId = config.googleDriveFolderId; // Main "study cafe" folder ID
    this.auth = null;
    this.drive = null;
  }

  async initialize() {
    try {
      this.auth = new google.auth.JWT(
        this.credentials.client_email,
        null,
        this.credentials.private_key,
        ['https://www.googleapis.com/auth/drive.readonly']
      );

      await this.auth.authorize();
      this.drive = google.drive({ version: 'v3', auth: this.auth });
      console.log('Google Drive API initialized successfully');
    } catch (error) {
      console.error('Error initializing Google Drive:', error.message);
    }
  }

  async getUserFolderFiles(phoneNumber) {
    try {
      if (!this.drive) {
        console.log('❌ Google Drive not initialized');
        return [];
      }

      console.log(`🔍 Searching for folder: ${phoneNumber}`);

      // Search for folder with the phone number name
      const folderQuery = `name='${phoneNumber}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
      
      // If parent folder ID is provided, search within it
      const fullQuery = this.parentFolderId 
        ? `${folderQuery} and '${this.parentFolderId}' in parents`
        : folderQuery;

      const foldersResponse = await this.drive.files.list({
        q: fullQuery,
        fields: 'files(id, name)',
        spaces: 'drive'
      });

      const folders = foldersResponse.data.files || [];
      
      if (folders.length === 0) {
        console.log(`❌ No folder found for phone number: ${phoneNumber}`);
        return [];
      }

      const userFolderId = folders[0].id;
      console.log(`✅ Found folder: ${folders[0].name} (ID: ${userFolderId})`);

      // Get all files in the user's folder
      const filesResponse = await this.drive.files.list({
        q: `'${userFolderId}' in parents and trashed=false`,
        fields: 'files(id, name, mimeType, webViewLink, webContentLink)',
        spaces: 'drive'
      });

      const files = filesResponse.data.files || [];
      console.log(`📁 Found ${files.length} file(s) in folder`);

      return files.map(file => ({
        id: file.id,
        name: file.name,
        link: file.webViewLink || file.webContentLink,
        mimeType: file.mimeType
      }));
    } catch (error) {
      console.error('❌ Error fetching user folder files:', error.message);
      return [];
    }
  }

  async getFileLink(fileId) {
    try {
      if (!this.drive) {
        console.log('❌ Google Drive not initialized');
        return null;
      }

      const response = await this.drive.files.get({
        fileId: fileId,
        fields: 'webViewLink, webContentLink'
      });

      return response.data.webViewLink || response.data.webContentLink;
    } catch (error) {
      console.error('❌ Error fetching file link:', error.message);
      return null;
    }
  }
}

module.exports = new GoogleDriveService();
