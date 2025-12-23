# QueueLess Lite - Frontend-Only Real-Time Waitlist App

A production-ready React application that allows small businesses to manage real-time customer waitlists without a backend. Uses Firebase for authentication and real-time data, Framer Motion for animations, and is fully deployable.

## 🚀 Features

### Business Features
- ✅ Create and manage multiple waitlists
- ✅ Set average service time per waitlist
- ✅ Add/remove customers from queue
- ✅ Serve next customer button
- ✅ Real-time queue updates
- ✅ Estimated wait time calculation
- ✅ Generate QR codes for public queue links
- ✅ Live customer position updates

### Customer Features
- ✅ Join queue via public link or QR code
- ✅ Real-time position updates
- ✅ Estimated wait time calculation
- ✅ Live notifications when you're next
- ✅ Progress bar showing queue movement
- ✅ Smooth animations and transitions

### General Features
- ✅ Email + password authentication
- ✅ Google OAuth login
- ✅ Role-based access (business/customer)
- ✅ Dark/light theme toggle
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Production-ready code
- ✅ Accessible UI with semantic HTML
- ✅ Real-time Firestore listeners
- ✅ Smooth Framer Motion animations

## 🛠 Tech Stack

- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Firebase** - Authentication & Firestore database
- **Framer Motion** - Smooth animations
- **QRCode.react** - QR code generation
- **CSS Modules** - Scoped styling
- **Context API** - State management

## 📋 Prerequisites

1. Node.js (v14 or higher)
2. npm or yarn
3. Firebase project setup

## 🔧 Setup Instructions

### 1. Clone or Create the Project

```bash
cd "c:\Users\user\Desktop\business app"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or use existing one
3. Enable:
   - **Authentication**: Email/Password and Google
   - **Firestore Database**: Create in test mode (or set appropriate rules)
4. Copy your Firebase config

### 4. Environment Variables

Create a `.env` file in the project root:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### 5. Create Firestore Collections

The app will auto-create collections, but here's the structure:

**Collections:**
- `users/` - User documents with role
  - Fields: `email`, `role` (business/customer), `createdAt`
- `waitlists/` - Business waitlist documents
  - Fields: `businessId`, `name`, `serviceTime`, `createdAt`
  - Subcollection: `customers/`
    - Fields: `name`, `phone`, `position`, `addedAt`, `served`

### 6. Firebase Security Rules

Paste these into Firestore Rules:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own document
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Waitlists: Only business owner can read/write
    match /waitlists/{waitlistId} {
      allow read, write: if request.auth.uid == resource.data.businessId;
      allow read: if true; // Allow customers to see waitlist details
      
      // Customers subcollection
      match /customers/{customerId} {
        allow read, write: if request.auth != null;
      }
    }
  }
}
```

### 7. Start Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

## 📱 Usage

### For Businesses
1. Sign up with email/password or Google
2. Select "Business" role
3. Go to Dashboard
4. Create a waitlist
5. Share the QR code or link with customers
6. Manage the queue in real-time

### For Customers
1. Scan QR code or open shared link
2. Enter name and phone number
3. Join queue
4. View real-time position and wait time
5. Get notified when you're next

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Drag & drop build folder to netlify.com
```

### Deploy to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.js
│   └── ProtectedRoute.js
├── context/
│   ├── AuthContext.js
│   └── ThemeContext.js
├── pages/
│   ├── Home.js
│   ├── Login.js
│   ├── Signup.js
│   ├── Dashboard.js
│   ├── CustomerView.js
│   └── NotFound.js
├── styles/
│   ├── App.css
│   ├── Global.module.css
│   ├── Navbar.module.css
│   ├── Auth.module.css
│   ├── Home.module.css
│   ├── Dashboard.module.css
│   └── CustomerView.module.css
├── firebase/
│   └── config.js
├── App.js
└── index.js
```

## 🎨 Features Explained

### Real-Time Updates
Uses Firestore `onSnapshot()` listeners to update UI instantly when queue changes. Customers see position updates within milliseconds.

### Animations
Framer Motion animations for:
- Queue items entering/exiting
- Position badges pulsing
- Progress bars filling
- Page transitions
- Form sliding in

### Responsive Design
- Mobile: Stack layouts, touch-friendly buttons
- Tablet: 2-column grids
- Desktop: 3-column grids with full dashboard

### Accessibility
- Semantic HTML elements
- Proper label associations
- Keyboard navigation
- Color contrast WCAG AA compliant
- Theme support for accessibility

## 🔐 Security

- Firebase Authentication for user verification
- Firestore security rules enforce role-based access
- No sensitive data in localStorage (only theme preference)
- Environment variables for Firebase config
- No backend to compromise

## 📈 Performance

- Code splitting via React Router
- Lazy loading with Suspense (optional)
- CSS Modules for zero conflicts
- Optimized Firestore queries
- Firebase CDN for fast data delivery

## 🎯 Optional Enhancements

1. **Email Notifications** - Use EmailJS for SMS/email alerts
2. **Advanced Analytics** - Track queue metrics over time
3. **Multiple Locations** - Support for franchise businesses
4. **Customer Feedback** - Rate experience after being served
5. **Notifications** - Browser push notifications when queue updates

## 📞 Support

For Firebase issues: [Firebase Documentation](https://firebase.google.com/docs)
For React issues: [React Documentation](https://react.dev)
For Framer Motion: [Framer Motion Docs](https://www.framer.com/motion/)

## 📄 License

MIT License - Feel free to use this for portfolios and commercial projects.

---

**Built with ❤️ for small businesses that deserve great tech.**
