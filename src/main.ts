import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from './environments/firebase.config';

// Initialize Firebase app with the config from `src/environments/firebase.config.ts`.
// Replace the placeholders in that file with your project's real values.
const firebaseApp = initializeApp(firebaseConfig);

// Export a Firestore instance for the app services to consume.
export const db = getFirestore(firebaseApp);

// Enable offline persistence (IndexedDB) where available. This allows the
// app to read/write while offline and sync when back online.
import { enableIndexedDbPersistence } from 'firebase/firestore';
enableIndexedDbPersistence(db).catch((err) => {
  // Common errors are "failed-precondition" (multiple tabs) and
  // "unimplemented" (browser not supported). We catch and log them.
  console.warn('Could not enable IndexedDB persistence:', err?.code || err);
});

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
