/* ===================================
   FIREBASE CONFIGURATION
   Alan Timothy Lie Hans Santoso
   ===================================

   HOW TO SET UP FIREBASE (Step-by-Step)
   ======================================

   STEP 1: Create a Firebase Project
   -----------------------------------
   1. Go to https://console.firebase.google.com/
   2. Click "Add project" (or "Create a project")
   3. Enter a project name (e.g., "portfolio-blog")
   4. Disable Google Analytics (optional, not needed for this)
   5. Click "Create project"
   6. Wait for it to finish, then click "Continue"

   STEP 2: Register a Web App
   ----------------------------
   1. On the project overview page, click the web icon (</>)
   2. Enter an app nickname (e.g., "Portfolio Blog")
   3. Do NOT check "Firebase Hosting" (not needed)
   4. Click "Register app"
   5. Firebase will show you a config object — COPY those values
   6. Paste them into the firebaseConfig object below
   7. Click "Continue to console"

   STEP 3: Create a Realtime Database
   ------------------------------------
   1. In the left sidebar, click "Build" > "Realtime Database"
   2. Click "Create Database"
   3. Choose a location closest to your audience
   4. Select "Start in TEST MODE" (we will secure it later)
   5. Click "Enable"
   6. Copy the database URL shown (e.g., "https://your-project-default-rtdb.firebaseio.com")
   7. Paste it as the "databaseURL" value below

   STEP 4: Set Database Security Rules
   -------------------------------------
   1. In Realtime Database, click the "Rules" tab
   2. Replace the rules with:

      {
        "rules": {
          "blog-stats": {
            "$postId": {
              ".read": true,
              ".write": true
            }
          }
        }
      }

   3. Click "Publish"

   NOTE: The rules above allow anyone to read/write blog stats.
   This is fine for a personal portfolio blog. For stricter
   security, you can limit writes using validation rules.

   STEP 5: Replace the Placeholder Values Below
   -----------------------------------------------
   Replace each "YOUR_..." value with the actual values
   from your Firebase console (Step 2).

   =================================== */

// =============================================
// >>> REPLACE THESE VALUES WITH YOUR OWN <<<
// =============================================
var firebaseConfig = {
    apiKey:            "AIzaSyC3q8cq5WdZfYf4Rz28RKFKCQxsQngKNIw",             // e.g., "AIzaSyB1234567890abcdefg"
    authDomain:        "hans-prtflo.firebaseapp.com",  // e.g., "portfolio-blog.firebaseapp.com"
    databaseURL:       "https://hans-prtflo-default-rtdb.asia-southeast1.firebasedatabase.app",  // e.g., "https://portfolio-blog-default-rtdb.firebaseio.com"
    projectId:         "hans-prtflo",          // e.g., "portfolio-blog"
    storageBucket:     "hans-prtflo.firebasestorage.app",      // e.g., "portfolio-blog.appspot.com"
    messagingSenderId: "666274040317",           // e.g., "123456789012"
    appId:             "1:666274040317:web:2fce714018d6e21dd17194"               // e.g., "1:123456789012:web:abc123def456"
};
// =============================================

// Initialize Firebase safely
var db = null;
try {
    // Only initialize if config has been replaced with real values
    if (firebaseConfig.apiKey && firebaseConfig.apiKey.indexOf('YOUR_') === -1) {
        firebase.initializeApp(firebaseConfig);
        db = firebase.database();
    }
} catch (e) {
    console.warn('Firebase initialization failed:', e.message);
    db = null;
}
