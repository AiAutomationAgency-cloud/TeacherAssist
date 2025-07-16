# EduRespond - AI Teacher Communication Assistant

A modern, AI-powered platform designed to streamline teacher communication workflows with students and parents.

## Features

- **AI-Powered Response Generation**: Generate contextual responses using advanced AI technology
- **Multi-Language Support**: Communicate in 50+ languages seamlessly
- **Student & Parent Profiles**: Maintain detailed profiles for personalized communication
- **Response Analytics**: Track communication patterns and response times
- **Template Management**: Save and reuse frequently used responses
- **Real-time Notifications**: Get notified of urgent inquiries instantly

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **UI Components**: shadcn/ui + Tailwind CSS
- **State Management**: TanStack Query
- **Routing**: Wouter
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL + Drizzle ORM
- **AI Integration**: Google Gemini API
- **Build Tool**: Vite

## Quick Start

### Prerequisites

- Node.js 18 or higher
- PostgreSQL database
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/edurespond.git
cd edurespond
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database URL and API keys
```

4. Set up the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Development

### Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities and configurations
│   │   └── App.tsx        # Main app component
├── server/                # Express backend
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database operations
│   └── services/          # External service integrations
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schema definitions
└── README.md
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open database studio
- `npm run check` - Type check the project

### Local Development Setup

1. **VS Code Extensions** (recommended):
   - TypeScript and JavaScript Language Features
   - Tailwind CSS IntelliSense
   - Auto Rename Tag
   - Prettier - Code formatter
   - ESLint

2. **VS Code Settings** (`.vscode/settings.json`):
```json
{
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.experimental.classRegex": [
    "class\\s*=\\s*[\"']([^\"']+)[\"']",
    "className\\s*=\\s*[\"']([^\"']+)[\"']"
  ]
}
```

3. **Environment Setup**:
```bash
# Create .env file
DATABASE_URL=postgresql://username:password@localhost:5432/edurespond
GOOGLE_GEMINI_API_KEY=your_api_key_here
NODE_ENV=development
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/user` - Get current user

### Inquiries
- `GET /api/inquiries` - Get user inquiries
- `POST /api/inquiries` - Create new inquiry

### Responses
- `GET /api/responses` - Get user responses
- `POST /api/responses` - Generate AI response
- `PUT /api/responses/:id` - Update response
- `GET /api/responses/recent` - Get recent responses

### Templates
- `GET /api/templates` - Get user templates
- `POST /api/templates` - Create template
- `PUT /api/templates/:id` - Update template

### Analytics
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/activities` - Get user activities

## Deployment

### Production Build

```bash
npm run build
```

### Environment Variables

Required environment variables for production:

```bash
DATABASE_URL=your_production_database_url
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=production
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@edurespond.com or join our Slack channel.