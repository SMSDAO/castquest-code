# AiCode Admin UI 🚀

Modern admin dashboard for the AiCode automated system with Neo glow effects and day/night mode.

## ✨ Features

- **Neo Glow Design** - Modern UI with glowing neon effects
- **Day/Night Mode** - Seamless theme switching
- **Real-time Monitoring** - Live orchestration and workflow status
- **Code Analysis Dashboard** - Visualize code metrics and patterns
- **Test Management** - Run and monitor test suites
- **Deployment Control** - Deploy to Vercel with one click
- **Component Sync** - Monitor app, web, mobile synchronization

## 🎨 Design System

### Neo Glow Theme
- **Neon Blue** (`#00D9FF`) - Primary actions
- **Neon Purple** (`#B026FF`) - Secondary actions
- **Neon Pink** (`#FF006E`) - Alerts and warnings
- **Neon Green** (`#00FF88`) - Success states
- **Neon Yellow** (`#FFD60A`) - Information

### Components
- Glass morphism cards
- Animated glow effects
- Smooth transitions
- Responsive layout
- Dark/Light mode

## 🚀 Quick Start

### Development

```bash
cd web/
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## 📦 Deployment to Vercel

### Method 1: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Method 2: GitHub Integration

1. Push code to GitHub
2. Import repository in Vercel dashboard
3. Configure environment variables
4. Deploy automatically

### Environment Variables

Copy `.env.production.template` to `.env.production` and configure:

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_WS_URL=wss://your-api-domain.com
NEXTAUTH_SECRET=your-secret-key
```

## 🔧 Configuration

### Node.js Version

This project requires Node.js 18+ for optimal performance with Next.js 14.

```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### Auto-Config for 24+ Nodes

The system supports dynamic configuration for distributed deployments across 24+ nodes:

1. **Load Balancing** - Automatic traffic distribution
2. **Health Checks** - Monitor node status
3. **Auto Scaling** - Scale based on demand
4. **Failover** - Automatic recovery

## 📊 Dashboard Pages

### Home Dashboard
- System overview
- Real-time statistics
- Recent activity
- Quick actions

### Code Analysis
- Metrics visualization
- Pattern detection
- Issue tracking
- Dependency graphs

### Testing
- Test suite management
- Coverage reports
- Test results
- Performance metrics

### Orchestrator
- Workflow monitoring
- Phase tracking
- Error logs
- Execution history

### Deployment
- Deploy status
- Platform selection (Vercel/Netlify/AWS)
- Environment management
- Rollback options

### Components
- App/Web/Mobile sync status
- Database migrations
- Shared code management
- Configuration sync

## 🎯 API Integration

### Backend API

Connect to the AiCode backend at `http://localhost:3001`:

```typescript
// Example API call
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analyze`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ path: './src' })
})
```

### WebSocket Connection

Real-time updates via WebSocket:

```typescript
import { io } from 'socket.io-client'

const socket = io(process.env.NEXT_PUBLIC_WS_URL!)
socket.on('orchestration-update', (data) => {
  console.log('Update:', data)
})
```

## 🧪 Testing

```bash
npm test           # Run tests
npm run test:watch # Watch mode
```

## 📝 Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript check
```

## 🔐 Security

- Environment variables for sensitive data
- HTTPS only in production
- CORS configuration
- Rate limiting
- Authentication ready (NextAuth.js compatible)

## 📱 Responsive Design

- Mobile-first approach
- Tablet optimization
- Desktop enhancement
- 4K support

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI**: React 18
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **Real-time**: Socket.IO Client
- **Language**: TypeScript

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions welcome! Please follow the coding standards and submit pull requests.

## 📞 Support

For issues or questions, please open an issue on GitHub.
