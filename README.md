# WhatsApp Bot with Menu System and Google Sheets Authorization

A WhatsApp bot built with Node.js that provides an interactive menu system and validates users against a Google Sheets database.

## Features

- ✅ Three-level menu system (3 main menus, each with 3 submenus)
- ✅ User authorization via Google Sheets
- ✅ Meta WhatsApp Business API integration
- ✅ Easy navigation with "back" command
- ✅ Message read receipts

## Project Structure

```
whatsapp-bot/
├── index.js                    # Main application server
├── config.js                   # Configuration (hardcoded for testing)
├── whatsappService.js          # WhatsApp API integration
├── googleSheetsService.js      # Google Sheets authorization
├── menuSystem.js               # Menu navigation logic
├── package.json                # Dependencies
├── .env.example                # Environment variables template
└── README.md                   # This file
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Meta WhatsApp API

Update `config.js` with your Meta credentials:

```javascript
whatsappToken: 'YOUR_WHATSAPP_ACCESS_TOKEN',
phoneNumberId: 'YOUR_PHONE_NUMBER_ID',
verifyToken: 'YOUR_VERIFY_TOKEN',
```

**How to get Meta credentials:**
1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create a new app or use existing one
3. Add WhatsApp product
4. Get your Phone Number ID and Access Token
5. Create a verify token (any string you want)

### 3. Configure Google Sheets (Optional for testing)

In `googleSheetsService.js`, update:

```javascript
client_email: 'YOUR_SERVICE_ACCOUNT_EMAIL@project.iam.gserviceaccount.com',
private_key: 'YOUR_PRIVATE_KEY_HERE',
sheetId: 'YOUR_GOOGLE_SHEET_ID'
```

**How to set up Google Sheets:**
1. Create a Google Sheet with phone numbers in Column A
2. Go to [Google Cloud Console](https://console.cloud.google.com/)
3. Create a service account
4. Download the JSON credentials
5. Share your Google Sheet with the service account email

### 4. Testing Mode

By default, the bot runs in testing mode (authorizes all users). To change:

In `index.js`, line 90:
```javascript
const TESTING_MODE = true; // Set to false to use Google Sheets
```

### 5. Run the Bot

```bash
npm start
```

Server will start on http://localhost:3000

### 6. Expose Webhook (Using ngrok)

```bash
ngrok http 3000
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

### 7. Configure Meta Webhook

1. Go to your Meta App Dashboard
2. Navigate to WhatsApp > Configuration
3. Set Webhook URL: `https://your-ngrok-url.ngrok.io/webhook`
4. Set Verify Token: (same as in config.js)
5. Subscribe to messages webhook field

## Menu Structure

```
Main Menu
├── 1. Academic Resources
│   ├── 1.1 Course Materials
│   ├── 1.2 Practice Tests
│   └── 1.3 Study Guides
├── 2. Study Sessions
│   ├── 2.1 Schedule Session
│   ├── 2.2 Join Live Session
│   └── 2.3 View Recordings
└── 3. Support & Help
    ├── 3.1 Contact Admin
    ├── 3.2 FAQ
    └── 3.3 Technical Support
```

## Usage

1. Send any message to the bot to get the main menu
2. Reply with number (1-3) to select a menu
3. Reply with submenu number (e.g., 1.1, 2.3) to select an option
4. Type "back" or "menu" to return to main menu

## API Endpoints

- `GET /` - Health check
- `GET /webhook` - Webhook verification
- `POST /webhook` - Receive WhatsApp messages
- `POST /send-test` - Send test messages

## Testing

Send test message via API:

```bash
curl -X POST http://localhost:3000/send-test \
  -H "Content-Type: application/json" \
  -d '{
    "to": "1234567890",
    "message": "Test message"
  }'
```

## Authorization

- **Testing Mode**: All users authorized
- **Production Mode**: Only phone numbers in Google Sheet (Column A) are authorized
- Unauthorized users receive: "Unauthorized Access" message

## Troubleshooting

**Bot not responding?**
- Check if webhook is properly configured
- Verify Meta credentials in config.js
- Check server logs for errors

**Messages not sending?**
- Verify WhatsApp token is valid
- Check phone number format (without +)
- Ensure phone number ID is correct

**Authorization always failing?**
- Check Google Sheets credentials
- Verify sheet ID is correct
- Ensure service account has access to sheet
- Check if TESTING_MODE is enabled

## Next Steps

1. Replace hardcoded credentials with environment variables
2. Add database for user sessions
3. Implement actual functionality for each submenu
4. Add error handling and retry logic
5. Set up logging system
6. Deploy to production server

## License

ISC
# whatsapp-bot
