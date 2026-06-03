# Ghala's Study Schedule — Setup Guide
**Read this fully before starting. It takes about 15–20 minutes total.**

---

## PART 1 — Set up Firebase (your database + login system)

### Step 1: Create a Firebase project
1. Go to **https://console.firebase.google.com**
2. Click **"Add project"**
3. Name it: `ghalas-study-schedule`
4. Disable Google Analytics (not needed) → Click **"Create project"**

### Step 2: Enable Google Sign-In
1. In the left menu → **Authentication** → **Get started**
2. Click **"Google"** under Sign-in providers
3. Toggle it **ON**
4. Set a **Project support email** (use azzazygala9@gmail.com)
5. Click **Save**

### Step 3: Create the database
1. In the left menu → **Firestore Database** → **Create database**
2. Choose **"Start in production mode"** → Next
3. Select a location (e.g. `europe-west3`) → **Enable**

### Step 4: Set Firestore security rules
1. In Firestore → click **"Rules"** tab
2. Replace the rules with this:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Anyone can read the default template
    // Only the admin can write it
    match /templates/{doc} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == "azzazygala9@gmail.com";
    }

    // Users can only read/write their own progress
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click **"Publish"**

### Step 5: Get your Firebase config
1. In Firebase Console → Click the **gear icon** ⚙️ → **Project settings**
2. Scroll down to **"Your apps"** → Click **"</>"** (Web app)
3. Register app name: `study-schedule` → Click **"Register app"**
4. You'll see a block like this — copy the values:

```js
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### Step 6: Add your Firebase config to the app
1. Open the file: `src/App.jsx`
2. Find the section near the top that says:
   ```
   const firebaseConfig = {
     apiKey: "REPLACE_WITH_YOUR_API_KEY",
     ...
   ```
3. Replace each `"REPLACE_WITH_..."` value with the real values from Step 5
4. Save the file

---

## PART 2 — Deploy to Vercel (free, permanent public URL)

### Step 1: Create a free Vercel account
1. Go to **https://vercel.com** → Sign up with Google (use azzazygala9@gmail.com)

### Step 2: Deploy your site
You have two options:

#### Option A — Upload via GitHub (recommended)
1. Create a free account at **https://github.com**
2. Create a new repository called `study-schedule`
3. Upload all the project files (drag & drop in GitHub's UI)
4. In Vercel → **"Add New Project"** → Import from GitHub
5. Select your `study-schedule` repo
6. Vercel auto-detects React → Click **"Deploy"**

#### Option B — Deploy directly with Vercel CLI
1. Install Node.js from https://nodejs.org (if you don't have it)
2. Open terminal in the project folder
3. Run:
   ```
   npm install
   npm run build
   npx vercel --prod
   ```
4. Follow the prompts

### Step 3: Add your domain (optional)
- Vercel gives you a free URL like: `study-schedule-ghala.vercel.app`
- You can use this as your site address!
- If you want a custom domain like `ghala.com`, you can buy one (~$10/year on Namecheap)

---

## PART 3 — Add your site to Google (SEO)

After deploying, submit your site to Google Search Console:
1. Go to **https://search.google.com/search-console**
2. Add your Vercel URL as a property
3. Verify ownership (Vercel makes this easy — they walk you through it)
4. Click "Request Indexing" on your homepage URL
5. Google will find and index your site within a few days

**Note**: Google won't show your site for searches like "Ghala's nutrition schedule" immediately — it takes a few days to a few weeks.

---

## PART 4 — Allow your domain in Firebase Auth

Once you have your Vercel URL:
1. Firebase Console → **Authentication** → **Settings** tab
2. Under **"Authorized domains"** → **"Add domain"**
3. Add your Vercel URL (e.g. `study-schedule-ghala.vercel.app`)
4. Click **Add**

This is required for Google Sign-In to work on your live site!

---

## How your app works

| Who | What they can do |
|-----|-----------------|
| Anyone (not signed in) | View the schedule, but can't save progress |
| Signed-in users | Check off topics, write notes — all saved to cloud |
| You (azzazygala9@gmail.com) | Everything above + Admin Panel to edit subjects, colors, topics |

---

## Need help?
If you get stuck on any step, take a screenshot and ask me!
The trickiest part is usually the Firebase config — double-check that each value is copied exactly.
