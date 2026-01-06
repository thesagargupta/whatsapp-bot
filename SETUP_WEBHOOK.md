# WhatsApp Bot Webhook Setup Guide

## Why Your Bot Isn't Responding

Your bot needs a **public HTTPS URL** to receive messages from WhatsApp. Since you're running locally, you need to expose your server using a tunneling service.

## Step-by-Step Setup

### 1. Expose Your Local Server (Choose ONE method)

#### Option A: Using ngrok (Recommended)
```bash
# Download ngrok from: https://ngrok.com/download
# Install and run:
ngrok http 3000
```

You'll get an HTTPS URL like: `https://abc123.ngrok-free.app`

#### Option B: Using localtunnel
```bash
npm install -g localtunnel
lt --port 3000
```

#### Option C: Using Cloudflare Tunnel
```bash
# Download from: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/
cloudflared tunnel --url http://localhost:3000
```

### 2. Configure Webhook in Meta Dashboard

1. Go to: https://developers.facebook.com/apps/1542544810342538/whatsapp-business/wa-settings/
2. Click on **Configuration** under WhatsApp
3. In **Webhook** section, click **Edit**
4. Enter:
   - **Callback URL**: `https://your-ngrok-url.ngrok-free.app/webhook`
   - **Verify Token**: `studycafe_bot_2026`
5. Click **Verify and Save**
6. Subscribe to **messages** webhook field

### 3. Test Your Setup

#### Test 1: Send a message to your WhatsApp Business number
- Send any text to: **+1 555 182 0632**
- You should see logs in your terminal

#### Test 2: Check if webhook is receiving data
Watch your terminal for incoming webhook logs when you send a message.

### 4. Common Issues & Solutions

#### Issue: "Webhook verification failed"
- **Solution**: Make sure verify token in Meta matches: `studycafe_bot_2026`
- Check that your ngrok URL is correct and accessible

#### Issue: "Bot receives messages but doesn't respond"
- **Solution**: Check terminal logs for errors
- Verify your access token is valid (tokens expire after 24-90 days)
- Check if testing mode is enabled in index.js

#### Issue: "Cannot connect to ngrok URL"
- **Solution**: Make sure ngrok is running and your local server is on port 3000
- Try accessing the ngrok URL in browser: `https://your-url.ngrok-free.app/`

#### Issue: "Access token expired"
- **Solution**: Generate new token from Meta Dashboard
- Update token in config.js

### 5. Testing Without Webhook

You can test sending messages using the API directly:

```bash
# Test sending a message
curl -X POST http://localhost:3000/send-test -H "Content-Type: application/json" -d "{\"to\": \"YOUR_PHONE_NUMBER\", \"message\": \"Test message\"}"
```

### 6. Check Current Status

Run these commands to verify everything:

```bash
# Check if server is running
curl http://localhost:3000/

# Check webhook endpoint
curl http://localhost:3000/webhook?hub.mode=subscribe&hub.verify_token=studycafe_bot_2026&hub.challenge=test123
```

Should return: `test123`

## Quick Start Commands

```bash
# Terminal 1: Start your bot
npm start

# Terminal 2: Expose with ngrok
ngrok http 3000

# Copy the HTTPS URL from ngrok and configure in Meta Dashboard
```

## Important Notes

- **Free ngrok URLs change every time you restart** - you'll need to update Meta webhook URL
- Consider upgrading to ngrok paid plan for permanent URLs
- For production, deploy to a cloud server (Heroku, Railway, AWS, etc.)
- Access tokens expire - keep them updated

## Need Help?

Check terminal logs for detailed error messages when sending messages to your bot.
