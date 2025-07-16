# EduRespond Preview Access Guide

## Application Status
✅ **Server Running**: Port 5000
✅ **Frontend**: React app with Vite dev server
✅ **Backend**: Express.js API
✅ **Database**: PostgreSQL connected
✅ **AI Service**: Google Gemini API ready

## Access URLs

### Primary URL
```
http://localhost:5000
```

### Alternative URLs (try if primary doesn't work)
```
http://0.0.0.0:5000
http://127.0.0.1:5000
```

## Troubleshooting Preview Access

### If you can't see the preview:

1. **Replit Environment**: 
   - Look for the "Webview" tab in your Replit interface
   - Click on the URL bar and try the URLs above
   - Try refreshing the webview

2. **Network Configuration**:
   - Ensure port 5000 is not blocked
   - Check if your browser allows the connection
   - Try in an incognito/private window

3. **Server Verification**:
   ```bash
   curl http://localhost:5000
   ```
   Should return HTML with "EduRespond - Teacher Automation Platform"

## What You Should See

When the preview loads correctly, you'll see:

- **Dashboard Header**: "EduRespond - Teacher Automation Platform"
- **Stats Cards**: Total Inquiries, Auto Responses, Avg Response Time
- **Language Distribution Chart**: Multi-language analytics
- **Inquiry Form**: For entering student/parent inquiries
- **Templates Section**: Pre-built response templates
- **Recent Activities**: System activity log

## Testing the Application

Once you can access the preview:

1. **Test Response Generation**:
   - Enter a sample inquiry like "Why is my child failing math?"
   - Select a language (English, Spanish, French, German, Chinese)
   - Click "Generate Response"
   - Watch AI create a professional response

2. **Test Templates**:
   - Browse existing templates (Assignment Help, Grade Explanation, etc.)
   - Create new templates from generated responses

3. **Test Multi-language**:
   - Enter inquiries in different languages
   - Test translation features

## For Local VS Code Development

Copy the project files and run:
```bash
npm install
cp .env.example .env
# Add your database URL and Gemini API key to .env
npm run dev
```

Then open http://localhost:5000 in your browser.