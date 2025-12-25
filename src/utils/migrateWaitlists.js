// 🔧 Migration utility - Run this ONCE to update old waitlists with businessId → ownerId

import { db } from "../firebase/config";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export const migrateWaitlists = async () => {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error("You must be logged in to migrate waitlists");
    }

    console.log("Starting migration for user:", currentUser.uid);

    // Get ALL waitlists and manually filter
    const waitlistsRef = collection(db, "waitlists");
    const snapshot = await getDocs(waitlistsRef);

    let migratedCount = 0;
    let skippedCount = 0;

    for (const waitlistDoc of snapshot.docs) {
      const data = waitlistDoc.data();
      const ownerId = data.ownerId || data.businessId;

      // Only process if this user owns it
      if (ownerId !== currentUser.uid) {
        console.log(`⏭️  Skipped (not owned by you): ${waitlistDoc.id}`);
        skippedCount++;
        continue;
      }

      // If it has businessId but not ownerId, migrate it
      if (data.businessId && !data.ownerId) {
        console.log(`Migrating: ${waitlistDoc.id}`);
        try {
          await updateDoc(doc(db, "waitlists", waitlistDoc.id), {
            ownerId: data.businessId,
          });
          migratedCount++;
          console.log(`✓ Successfully migrated: ${waitlistDoc.id}`);
        } catch (err) {
          console.error(`✗ Failed to migrate ${waitlistDoc.id}:`, err.message);
        }
      } else if (data.ownerId) {
        console.log(`ℹ Already has ownerId: ${waitlistDoc.id}`);
        skippedCount++;
      } else {
        console.log(`⚠️  No businessId or ownerId found: ${waitlistDoc.id}`);
        skippedCount++;
      }
    }

    const message = `Migration complete!\n✓ Migrated: ${migratedCount}\n⏭️  Skipped: ${skippedCount}`;
    console.log(message);
    return migratedCount;
  } catch (error) {
    console.error("Migration error:", error);
    throw error;
  }
};
