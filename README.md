# ClaimEase - AI-Powered PIP Helper

A comprehensive web application for helping users build strong, evidence-backed answers for their PIP (Personal Independence Payment) claims.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 🔥 Firebase Setup

### Option 1: Demo Mode (Default)
The app runs in demo mode by default with mock authentication. No Firebase configuration needed.

### Option 2: Real Firebase (Optional)
1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Authentication (Email/Password) and Firestore Database
3. Copy your Firebase configuration:
   ```bash
   # .env.local
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

4. For local development with Firebase emulators:
   ```bash
   npm install -g firebase-tools
   firebase init emulators
   firebase emulators:start --only auth,firestore
   ```

## 📋 Features

- **Step 1: Upload Documents** - AI-powered document analysis
- **Step 2: Build Main Answers** - 12 key PIP activities with scoring
- **Step 3: Add Supporting Details** - Comprehensive form questions
- **Dark Theme** - Pure black with teal, mint, and tan accents
- **Glass Morphism** - Modern UI with backdrop blur effects
- **Responsive Design** - Desktop-first, mobile optimized
- **Real-time Progress** - Track completion across all sections

## 🎨 Design System

- **Colors:** Black (#000000), Teal (#4EB9B9), Light Mint (#B7E4D6), Warm Tan (#C3936C)
- **Typography:** System fonts with accessibility-focused sizing
- **Components:** Shadcn/ui with custom ClaimEase styling
- **Effects:** Glass morphism, subtle gradients, smooth transitions

## 🏗️ Tech Stack

- **Next.js 15** - Full-stack React framework
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling
- **Shadcn/ui** - Accessible component library
- **Lucide React** - Icon library
- **Firebase** - Authentication and database (optional)

## 📁 Project Structure

```
src/
├── app/               # Next.js app router pages
├── components/        # Reusable UI components
│   ├── ui/           # Shadcn/ui components
│   └── ...           # Custom components
├── contexts/         # React contexts (UserContext, etc.)
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and configurations
└── styles/           # Global CSS
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file with:
- `NEXT_PUBLIC_FIREBASE_*` - Firebase configuration (optional)
- `NODE_ENV` - development/production

### Build Configuration
- **Next.js:** Modern React framework with app router
- **TypeScript:** Strict type checking
- **ESLint:** Code linting and formatting

## 🚀 Deployment

### Firebase Hosting
```bash
npm run build
firebase deploy
```

### Other Platforms
```bash
npm run build
# Deploy the '.next' folder to your hosting platform
```

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary to ClaimEase. All rights reserved.

## 🆘 Support

For technical support or questions:
- Email: support@claimease.app
- Documentation: https://docs.claimease.app
