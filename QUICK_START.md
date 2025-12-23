# QueueLess Lite - Quick Reference Guide

## 🚀 Start Here (Copy-Paste Commands)

### 1. First Time Setup
```bash
cd "c:\Users\user\Desktop\business app"
npm install
```

### 2. Create .env File
Create a new file named `.env` in the project root:
```
REACT_APP_FIREBASE_API_KEY=YOUR_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
REACT_APP_FIREBASE_APP_ID=YOUR_APP_ID
```

### 3. Run Development Server
```bash
npm start
```

### 4. Open in Browser
```
http://localhost:3000
```

---

## 📋 Firebase Setup (5 Minutes)

1. Go to https://console.firebase.google.com
2. Create new project: "QueueLess Lite"
3. Go to: Project Settings → Copy your config
4. Paste keys into `.env` file
5. Go to: Authentication → Enable Email/Password + Google
6. Go to: Firestore → Create Database → Test Mode
7. Go to: Firestore → Rules → Paste this:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    match /waitlists/{waitlistId} {
      allow read, write: if request.auth.uid == resource.data.businessId;
      allow read: if true;
      match /customers/{customerId} {
        allow read, write: if request.auth != null;
      }
    }
  }
}
```

8. Publish rules
9. Go back to VS Code, run `npm start` ✅

---

## 🎯 Test the App (Quick Test)

### Create Business Account
1. Click "Sign Up" → Select "🏢 Business"
2. Email: `test@business.com`
3. Password: `password123`
4. Click "Create Account"

### Create Queue
1. Name: `Reception`
2. Service Time: `5` minutes
3. Click "Create Waitlist"

### Add Customer (Manually)
1. Name: `John Smith`
2. Phone: `555-1234`
3. Click "Add to Queue"

### Get QR Code
1. Scan QR code with phone
2. Or copy the link
3. Open in new browser tab

### Join as Customer
1. Name: `Jane Doe`
2. Phone: `555-5678`
3. Click "Join Queue"
4. See position #2

### Serve Customer
1. Back on Dashboard
2. Click "Serve Next"
3. Watch animation as Jane moves to #1

---

## 📁 File Overview

| File | Purpose |
|------|---------|
| `App.js` | Router configuration |
| `pages/Home.js` | Landing page |
| `pages/Login.js` | Login form |
| `pages/Signup.js` | Registration form |
| `pages/Dashboard.js` | Business management |
| `pages/CustomerView.js` | Customer queue page |
| `context/AuthContext.js` | Authentication logic |
| `context/ThemeContext.js` | Dark/light mode |
| `firebase/config.js` | Firebase setup |
| `components/Navbar.js` | Navigation bar |
| `components/ProtectedRoute.js` | Route protection |

---

## 🔑 Key Concepts

### Authentication
- Users sign up with email/password or Google
- Role is "business" or "customer"
- Stored in Firestore with user ID

### Waitlists
- Businesses create waitlists
- Each waitlist has a list of customers
- Identified by unique ID (for QR codes)

### Queue Position
- Automatically assigned: position = queue.length + 1
- Updates when customers are removed/served
- Used to calculate estimated wait time

### Real-Time Updates
- Uses Firestore `onSnapshot()` listeners
- All connected users see changes instantly
- No page refresh needed

### QR Codes
- Generated automatically for each waitlist
- Links to: `http://yoursite.com/queue/{waitlistId}`
- Scanneable with phone camera

---

## 🎨 Customization

### Change Primary Color
Edit `src/styles/*.module.css`:
```css
/* Find this color */
#667eea /* Change to your color */
```

### Change App Name
Edit `src/components/Navbar.js`:
```javascript
<Link to="/" className={styles.logo}>
  <span>⏱️</span>
  QueueLess {/* Change name here */}
</Link>
```

### Change Logo Emoji
Edit multiple files - search for `⏱️` and replace with your emoji.

### Customize Features
All business logic is in:
- `pages/Dashboard.js` - Business features
- `pages/CustomerView.js` - Customer features
- `context/AuthContext.js` - Auth logic

---

## 🚀 Deployment (Choose One)

### Option 1: Vercel (Easiest)
```bash
npm install -g vercel
vercel
# Follow prompts
```

### Option 2: Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

### Option 3: Netlify
```bash
npm run build
# Go to netlify.com
# Drag and drop the 'build' folder
```

---

## 🐛 Troubleshooting

### App won't start
```bash
# Delete node_modules and reinstall
rm -r node_modules
npm install
npm start
```

### Firebase errors
- [ ] Check `.env` file exists and has keys
- [ ] Verify keys match Firebase console
- [ ] Check Firestore Rules (copy-paste them again)
- [ ] Restart server after .env changes

### Real-time updates not working
- [ ] Check Firestore Rules allow reads
- [ ] Open DevTools → Network tab → check Firestore calls
- [ ] Try in new browser tab (private window)
- [ ] Check console for errors

### QR code not scanning
- [ ] Make sure app is running (`npm start`)
- [ ] Try different QR scanner
- [ ] Test link directly in browser
- [ ] Ensure waitlist exists

---

## 📊 File Sizes

| Component | Size |
|-----------|------|
| React | ~40KB |
| Firebase | ~60KB |
| Framer Motion | ~25KB |
| App Code | ~50KB |
| **Total** | **~175KB** |

(All gzipped - loads in ~1-2 seconds)

---

## 🎓 Learning Resources

- [Firebase Docs](https://firebase.google.com/docs)
- [React Docs](https://react.dev)
- [Framer Motion](https://www.framer.com/motion/)
- [React Router](https://reactrouter.com/)

---

## ✅ Deployment Checklist

Before going live:
- [ ] Test signup/login
- [ ] Test queue operations
- [ ] Test real-time updates
- [ ] Test on mobile device
- [ ] Test dark mode
- [ ] Check .env has production keys
- [ ] Set up Firestore rules
- [ ] Add domain to Firebase Auth
- [ ] Test deployed version

---

## 💬 Quick Help

**"How do I add a feature?"**
→ Edit relevant page in `src/pages/` or add new component

**"How do I change styling?"**
→ Edit `.module.css` files in `src/styles/`

**"How do I add authentication provider?"**
→ Edit `src/context/AuthContext.js` and add provider

**"How do I deploy?"**
→ Follow "Deployment" section above

**"How do I debug?"**
→ Open DevTools (F12), check Console tab

---

## 🎉 You're All Set!

Your production-ready waitlist app is ready to:
1. ✅ Run locally
2. ✅ Deploy to production
3. ✅ Handle real users
4. ✅ Impress recruiters

**Next: Set up Firebase and start `npm start`!**

---

*Last Updated: December 2025*
*For issues, check SETUP_GUIDE.md or ARCHITECTURE.md*
