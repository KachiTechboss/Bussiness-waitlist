# Firebase Authentication & Rules Setup Guide

## ❌ Error: "auth/invalid-credential"

This error means Firebase rejected your login attempt. Here's how to fix it:

---

## Step 1: Ensure Firebase Authentication is Enabled

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **business-app-fe115**
3. Click **Build** → **Authentication**
4. Click **Get Started** (if not already done)
5. Enable **Email/Password** provider:
   - Click on "Email/Password"
   - Toggle **Enable** to ON
   - Click **Save**
6. Enable **Google** provider:
   - Click on "Google"
   - Toggle **Enable** to ON
   - Add your email as a test user
   - Click **Save**

---

## Step 2: Create an Account (Sign Up First)

You must **sign up before you can log in**. Here's what to do:

### Using GitHub Pages (Online):
1. Go to: https://KachiTechboss.github.io/Bussiness-waitlist/
2. Click **Sign Up**
3. Select **Business** (or Customer)
4. Enter email: `your-email@example.com`
5. Enter password: (at least 6 characters)
6. Click **Create Account**
7. Once signup is successful, you can now **Log In** with the same credentials

### Using Local Development:
```bash
cd "c:\Users\user\Desktop\business app"
npm start
```
Then repeat the signup process at `http://localhost:3000`

---

## Step 3: Update Firestore Rules

Copy the updated rules to Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select **business-app-fe115**
3. Click **Firestore Database**
4. Click the **Rules** tab
5. Replace all content with this:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    /* Users Collection */
    match /users/{userId} {
      allow read, write: if request.auth != null
                        && request.auth.uid == userId;
    }

    /* Waitlists Collection */
    match /waitlists/{waitlistId} {
      // Anyone can view waitlist info (public)
      allow read: if true;

      // Authenticated users can create waitlists
      allow create: if request.auth != null;

      // Only the owner can update or delete waitlist
      allow update, delete: if request.auth != null
                            && request.auth.uid == resource.data.ownerId;

      /* Customers Subcollection */
      match /customers/{customerId} {
        // Anyone can read the queue
        allow read: if true;

        // Anyone authenticated can join the queue
        allow create: if request.auth != null;

        // Only the waitlist owner can remove customers
        allow delete: if request.auth != null
                      && request.auth.uid == 
                         get(/databases/$(database)/documents/waitlists/$(waitlistId))
                           .data.ownerId;

        // No updates allowed to customer entries
        allow update: if false;
      }
    }
  }
}
```

6. Click **Publish**

---

## Step 4: Ensure Authorized Domains

1. In Firebase Console → **Authentication**
2. Click the **Settings** tab (gear icon, top right)
3. Scroll to **Authorized domains**
4. Make sure these are listed:
   - `localhost` (for local testing)
   - `KachiTechboss.github.io`
   - `kachitechboss.github.io` (lowercase)

If not listed, click **Add domain** and add them.

---

## Step 5: Test the Full Flow

### Test Locally First:
```bash
npm start
# App opens at http://localhost:3000
```

1. Click **Sign Up**
2. Create account with test email
3. Once signed up, click **Log In**
4. Use the same email/password you just created
5. Should successfully log in

### Then Test on GitHub Pages:
https://KachiTechboss.github.io/Bussiness-waitlist/

---

## ✅ Troubleshooting Checklist

- [ ] Firebase Authentication is enabled (Email/Password)
- [ ] I have created an account (signed up)
- [ ] My email/password is correct
- [ ] Firestore Rules are published
- [ ] Domain is authorized in Firebase Console
- [ ] Browser cache is cleared (Ctrl+Shift+Delete)
- [ ] `.env` file has correct Firebase keys

---

## Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `auth/invalid-credential` | Wrong email/password OR account doesn't exist | Sign up first, then use same credentials to login |
| `auth/user-not-found` | Email not registered | Sign up with that email first |
| `auth/wrong-password` | Incorrect password | Check your password (case-sensitive) |
| `auth/too-many-requests` | Too many failed login attempts | Wait a few minutes, try again |
| Missing permission | Firestore rules not updated | Copy & publish rules from Step 3 above |

---

## 🚀 Quick Test Account

Use these credentials to test:

**Email:** `test@example.com`  
**Password:** `test123456`

1. Sign up with these credentials
2. Create a waitlist
3. Test the QR code with another browser/device

---

## Need More Help?

1. Check browser console (F12 → Console tab) for exact error
2. Check Firebase Console → Firestore for any rule syntax errors
3. Verify `.env` file has all Firebase keys
4. Clear browser cache and try again

