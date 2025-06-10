# Basketball Training App 🏀

A modern React application for booking basketball training sessions with professional coaches. Built with React, Firebase, and Tailwind CSS.

## 🎯 Overview

This application allows clients to:
- Browse available basketball trainers
- Book training sessions with real-time availability
- Manage booking details and payments
- View session history and upcoming appointments

Coaches can:
- Manage their availability and schedules
- Accept/reject booking requests
- Track earnings and session analytics
- Update pricing and profile information

## 🚀 Features

### Client Features
- **Trainer Discovery**: Browse profiles of certified basketball trainers
- **Real-time Booking**: Check availability and book sessions instantly
- **Session Customization**: Choose focus areas (shooting, defense, conditioning, etc.)
- **Payment Integration**: Secure payment processing at session time
- **Responsive Design**: Works seamlessly on mobile and desktop

### Coach Features
- **Dashboard**: Comprehensive coach dashboard with analytics
- **Schedule Management**: Set weekly availability and custom dates
- **Booking Management**: Accept, reject, or reschedule client requests
- **Earnings Tracking**: Monitor revenue and session statistics
- **Profile Management**: Update bio, specialties, and pricing

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router
- **Styling**: Tailwind CSS with custom design system
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **State Management**: React Hooks, Context API
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **Build Tool**: Create React App

## 📦 Installation

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn
- Firebase project setup

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/basketball-training-app.git
   cd basketball-training-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

4. **Firebase Setup**
    - Create a new Firebase project
    - Enable Firestore Database
    - Enable Authentication (optional)
    - Enable Storage (for profile photos)
    - Add your web app configuration to the `.env` file

5. **Database Structure**
   Set up these Firestore collections:
   ```
   trainers/
   ├── coach_{id}/
   │   ├── name: string
   │   ├── specialty: string
   │   ├── price: number
   │   ├── location: string
   │   └── photoURL: string
   
   availability/
   ├── coach_{id}/
   │   ├── weeklyAvailability: object
   │   ├── customAvailability: object
   │   └── unavailableDates: array
   
   bookings/
   ├── coach_{id}/
   │   └── bookings: object
   ```

6. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

   The app will open at `http://localhost:3000`

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                    # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   └── index.js
│   ├── layout/                # Layout components
│   │   ├── Navbar.jsx
│   │   ├── PageHeader.jsx
│   │   └── index.js
│   ├── trainer/               # Trainer-related components
│   │   ├── TrainerCard.jsx
│   │   ├── TrainerList.jsx
│   │   └── index.js
│   ├── booking/               # Booking components
│   │   ├── CalendarSection.jsx
│   │   ├── TimeSlots.jsx
│   │   └── index.js
│   ├── dashboard/             # Coach dashboard
│   │   ├── tabs/
│   │   ├── modals/
│   │   └── index.js
│   └── pages/                 # Page components
├── utils/
│   ├── classnames.js          # Design system
│   ├── firebaseService.js     # Firebase operations
│   ├── theme.js               # Theme management
│   └── bookingUtils.js        # Booking utilities
├── hooks/                     # Custom React hooks
├── context/                   # React context providers
└── data/                      # Static data
```

## 🎨 Design System

The app uses a custom design system built on Tailwind CSS:

### Color Palette
- **Primary**: Green (#16a34a) - Brand color for buttons and highlights
- **Neutrals**: Stone-based grays for a warm, professional feel
- **Status Colors**: Success (green), Warning (amber), Error (red)

### Components
All components follow a consistent pattern:
```javascript
import { Button, Card, Input } from './components/ui';
import { trainerCard, form, button } from './utils/classnames';

// Usage
<Button variant="primary" size="md">Book Now</Button>
<Card padding="md">Content</Card>
```

### Typography Scale
- H1: `text-2xl sm:text-3xl lg:text-4xl font-bold`
- H2: `text-xl sm:text-2xl lg:text-3xl font-bold`
- Body: `text-sm sm:text-base`
- Caption: `text-xs sm:text-sm`

## 🔧 Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (not recommended)

## 🌙 Theme Support

The app supports both light and dark modes:
- Automatic detection of system preference
- Manual toggle in the navigation bar
- Persistent theme selection using localStorage

## 📱 Responsive Design

Optimized for all screen sizes:
- **Mobile**: Stack components vertically, touch-friendly buttons
- **Tablet**: Two-column layouts where appropriate
- **Desktop**: Full multi-column layouts with sidebar navigation

## 🔐 Authentication (Optional)

Currently configured for public use. To add authentication:
1. Enable Firebase Authentication
2. Implement auth context and providers
3. Add protected routes for coach dashboard
4. Update Firestore security rules

## 🚀 Deployment

### Netlify Deployment
1. Build the project: `npm run build`
2. Deploy the `build` folder to Netlify
3. Set environment variables in Netlify dashboard

### Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Deploy: `firebase deploy`

### Vercel Deployment
1. Install Vercel CLI: `npm install -g vercel`
2. Deploy: `vercel --prod`
3. Set environment variables in Vercel dashboard

## 🧪 Testing

### Running Tests
```bash
npm test
```

### Test Structure
- Unit tests for utility functions
- Component tests using React Testing Library
- Integration tests for booking flow

## 📊 Analytics & Monitoring

Consider adding:
- Google Analytics for user behavior
- Firebase Analytics for app usage
- Error tracking with Sentry
- Performance monitoring

## 🤝 Contributing

### For Students and Contributors

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/new-feature
   ```
3. **Follow the coding standards**
    - Use the established design system
    - Follow component structure patterns
    - Add proper TypeScript types (if migrating)
4. **Commit your changes**
   ```bash
   git commit -m "Add new feature"
   ```
5. **Push to your branch**
   ```bash
   git push origin feature/new-feature
   ```
6. **Create a Pull Request**

### Coding Standards

- Use functional components with hooks
- Follow the established file structure
- Use design tokens from `classnames.js`
- Write descriptive component and function names
- Add comments for complex logic

### Component Guidelines

```javascript
// Good component structure
import React from 'react';
import { Card, Button } from '../ui';
import { componentStyles } from '../../utils/classnames';

export default function MyComponent({ data, onAction }) {
  return (
    <Card>
      <h3 className={componentStyles.title}>
        {data.title}
      </h3>
      <Button onClick={onAction}>
        Action
      </Button>
    </Card>
  );
}
```

## 🐛 Troubleshooting

### Common Issues

**Firebase Connection Issues**
- Check environment variables are set correctly
- Verify Firebase project configuration
- Ensure Firestore rules allow read/write access

**Build Errors**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check for missing dependencies
- Verify environment variables in production

**Styling Issues**
- Ensure Tailwind CSS is properly configured
- Check dark mode classes are applied correctly
- Verify custom classnames are imported

## 📞 Support

For questions or support:
- Create an issue on GitHub
- Contact the development team
- Check the documentation in `/docs`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **BUILT Relentless** - Basketball training organization
- **Firebase** - Backend infrastructure
- **Tailwind CSS** - Styling framework
- **React Community** - Open source ecosystem

---

**Happy Coding! 🏀**

Built with ❤️ for the basketball community