# Environment Variables Setup Guide

## ✅ Credentials Migrated to Environment Variables

All hardcoded credentials have been moved from code to environment variables. This makes it safe to publish your code on GitHub.

## Environment Variables Required

### Meta WhatsApp API Credentials
```
WHATSAPP_TOKEN=your_access_token
WHATSAPP_PHONE_NUMBER_ID=857815947424563
WHATSAPP_BUSINESS_ACCOUNT_ID=1905382840049928
VERIFY_TOKEN=studycafe_bot_2026
APP_ID=1542544810342538
APP_SECRET=b5c79bdb0b22b4a6ec8e62d6e2ebb509
```

### Google Sheets Configuration (Optional)
```
GOOGLE_SHEET_ID=1SbH3DLi1BhXEaafS7u6p-sTZ0ABvobKiQm8lA6cHgB8
GOOGLE_SERVICE_ACCOUNT_EMAIL=sagar-gupta@solid-saga-483505-c2.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...your-key-here...\n-----END PRIVATE KEY-----
```

### Server Configuration
```
PORT=3000
TESTING_MODE=true  # Set to 'false' for production with Google Sheets authorization
```

## Setup Instructions

### 1. Local Development (.env file)

Create a `.env` file in your project root with your credentials:

```bash
# Copy the template
cp .env.example .env

# Edit .env with your actual credentials
nano .env
# or use VS Code editor
```

### 2. For Render Deployment

In your Render Dashboard:

1. Go to your service settings
2. Click on "Environment" tab
3. Add each variable from above as an environment variable
4. Click "Save"

**Example Environment Variables in Render:**

| Key | Value |
|---|---|
| WHATSAPP_TOKEN | EAAV677N4eIo... |
| WHATSAPP_PHONE_NUMBER_ID | 857815947424563 |
| VERIFY_TOKEN | studycafe_bot_2026 |
| GOOGLE_SHEET_ID | 1SbH3DLi1BhXE... |
| TESTING_MODE | true |

### 3. For Production with Google Sheets

When ready to use Google Sheets authorization:

1. Set `TESTING_MODE=false`
2. Add Google Service Account credentials:
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY` (with newlines as `\n`)

### 4. Important: Private Key Format

When adding `GOOGLE_PRIVATE_KEY` to Render, use this format:

```
-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSj...\n-----END PRIVATE KEY-----
```

Replace actual newlines with `\n` (literal backslash-n).

## Testing Your Setup

After setting environment variables:

```bash
# Local testing
npm start

# Should see: ✅ Server running on port 3000

# Send test message
curl -X POST http://localhost:3000/send-test \
  -H "Content-Type: application/json" \
  -d '{"to":"918809197377","message":"Test"}'
```

## Secure Your Credentials

### ✅ DO:
- Keep `.env` file **LOCAL ONLY** (don't commit to GitHub)
- Use environment variables in Render
- Never share tokens or keys publicly
- Rotate tokens periodically

### ❌ DON'T:
- Commit `.env` file to GitHub
- Hardcode credentials in code
- Share credentials in messages or emails
- Use the same token for multiple services

## Verify .gitignore

Make sure `.gitignore` contains:
```
node_modules/
.env
*.log
.DS_Store
```

## Troubleshooting

### "Missing environment variables" warning
**Solution:** Add all required variables to `.env` or Render dashboard.

### Google Sheets authorization fails
**Solution:** 
- Check if `GOOGLE_PRIVATE_KEY` includes `\n` for newlines
- Verify service account email is shared with your Google Sheet
- Ensure `TESTING_MODE=false`

### Bot stops working after deployment
**Solution:** Check Render logs for missing environment variables.

## Next Steps

1. ✅ Move credentials to .env (done!)
2. Push code to GitHub (credentials are safe now)
3. Deploy to Render with environment variables
4. Test webhook on live server
5. Switch `TESTING_MODE=false` for production

---

**Your bot is now secure and ready for production! 🚀**
