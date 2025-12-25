# 🔧 Fix Firestore Rules for Migration

## The Problem
You're getting "missing or insufficient permission" error when trying to migrate old waitlists. This is because:
1. Old waitlists have `businessId` field (created before the fix)
2. New rules only allow updates if `ownerId` exists and matches
3. Migration fails because neither field matches the rule check

## The Solution

### Step 1: Update Your Firestore Security Rules

Go to **Firebase Console → Firestore Database → Rules** and replace ALL the content with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    /* ─────────────────────────────
       USERS (AUTH PROFILES)
       ───────────────────────────── */
    match /users/{userId} {
      allow read, write: if request.auth != null
                         && request.auth.uid == userId;
    }

    /* ─────────────────────────────
       WAITLISTS
       ───────────────────────────── */
    match /waitlists/{waitlistId} {

      // Public can read waitlist info
      allow read: if true;

      // Any logged-in user can create
      allow create: if request.auth != null;

      // Owner can update/delete (handles BOTH new ownerId AND old businessId fields)
      allow update, delete: if request.auth != null
        && (request.auth.uid == resource.data.ownerId || 
            request.auth.uid == resource.data.businessId);

      /* ─────────────────────────────
         CUSTOMERS (QUEUE)
         ───────────────────────────── */
      match /customers/{customerId} {

        // Anyone can see the queue
        allow read: if true;

        // Logged-in users can join queue
        allow create: if request.auth != null;

        // ONLY OWNER CAN REMOVE / SERVE NEXT
        allow delete: if request.auth != null
          && (request.auth.uid ==
             get(/databases/$(database)/documents/waitlists/$(waitlistId))
               .data.ownerId ||
              request.auth.uid ==
             get(/databases/$(database)/documents/waitlists/$(waitlistId))
               .data.businessId);

        // Prevent position tampering
        allow update: if request.auth != null
          && (request.auth.uid ==
             get(/databases/$(database)/documents/waitlists/$(waitlistId))
               .data.ownerId ||
              request.auth.uid ==
             get(/databases/$(database)/documents/waitlists/$(waitlistId))
               .data.businessId);
      }
    }
  }
}
```

**Click "Publish" to save the rules.**

### Step 2: Run the Migration

1. Go back to your Dashboard in the app
2. You should see the "🔧 Migrate Old Waitlists" button
3. Click it to migrate all your old waitlists
4. You should see ✓ Migration complete message

### Step 3: Verify

After migration:
- ✅ Old waitlists with `businessId` → now have `ownerId`
- ✅ Business owners can edit their waitlists
- ✅ Business owners can remove customers
- ✅ Customers can join queues
- ✅ Everything works! 🎉

## What Changed?

**Old rule:**
```javascript
allow update, delete: if request.auth != null && request.auth.uid == resource.data.ownerId;
```

**New rule (backwards compatible):**
```javascript
allow update, delete: if request.auth != null
  && (request.auth.uid == resource.data.ownerId || 
      request.auth.uid == resource.data.businessId);
```

This checks BOTH fields so it works with old and new documents!

## Need Help?

If you still get permission errors:
1. Make sure you're logged in as the business owner
2. Check that the rules were published (not just edited)
3. Clear browser cache (Ctrl+Shift+Delete)
4. Try again

The `businessId` field will eventually be phased out, but this approach keeps everything compatible!
