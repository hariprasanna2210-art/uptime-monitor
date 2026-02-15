# SaaS Uptime Monitor

A full-stack uptime monitoring solution built with Node.js, Next.js, and Flutter.

## Features
- **Real-time Monitoring**: Checks website status every 5 minutes.
- **Multi-Platform**: Web Dashboard (Admin) and Mobile App (iOS/Android).
- **Notifications**: Email and Push Alerts (FCM).
- **History**: Tracks uptime percentage and response times.

## Getting Started

See [Walkthrough Guide](./walkthrough.md) for detailed setup instructions.

### Quick Start

**Backend**
```bash
cd backend
npm install
# Configure .env
npx prisma migrate dev
npm run dev
```

**Web**
```bash
cd web
npm install
npm run dev
```

**Mobile**
```bash
cd mobile
flutter pub get
flutter run
```
