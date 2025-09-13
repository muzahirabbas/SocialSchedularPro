# 🚀 Social Scheduler Pro

A powerful, serverless social media scheduling application built on Cloudflare Workers and Pages, featuring AI-powered content adaptation with the Gemini API.

 ---

## ✨ Features & Technology

This application provides a seamless interface to compose a social media post once and publish it across multiple platforms, intelligently adapting the content as needed.

### Core Features

  * **✍️ Unified Composer:** A single interface to write captions, upload media, and select target platforms.
  * **🔗 Multi-Platform Support:** Connect and post to **X (Twitter)**, **LinkedIn**, **Facebook**, **Instagram**, and **TikTok**.
  * **🤖 AI-Powered Shortening:** Automatically shortens captions that exceed X's character limit using the **Google Gemini API**, preserving the original message's intent.
  * **👀 Live Previews:** Real-time character counters and previews for each selected platform.
  * **🔐 Secure OAuth 2.0:** Securely connect your social media accounts without sharing your passwords.
  * **⚡ Serverless Architecture:** Built entirely on the highly scalable and cost-effective Cloudflare ecosystem.

### Tech Stack

  * **Backend:** Cloudflare Workers & Hono
  * **Frontend:** React (Vite) & Cloudflare Pages
  * **Database:** Cloudflare KV for storing user tokens
  * **AI:** Google Gemini API

-----

## 🖥️ Running Locally

Follow these steps to set up and run the entire application on your local machine for development.

### Prerequisites

  * [Node.js](https://nodejs.org/) (v18 or later)
  * [Git](https://git-scm.com/)
  * A Cloudflare account (free tier is sufficient)
  * Install the Cloudflare Wrangler CLI: `npm install -g wrangler`

### 1\. Backend Worker Setup

First, let's get the backend API running.

1.  **Clone the Repository:**

    ```bash
    git clone <your-repository-url>
    cd social-scheduler
    ```

2.  **Navigate to Worker Directory & Install:**

    ```bash
    cd workers
    npm install
    ```

3.  **Set Up Local Secrets:**
    The worker needs API keys to function. Create a file named `.dev.vars` in the `workers/` directory.

    ```bash
    touch .dev.vars
    ```

    Paste the following into `.dev.vars` and fill in the values you obtained (see the next section on how to get them):

    ```ini
    GEMINI_API_KEY="your_google_gemini_api_key"
    TWITTER_CLIENT_ID="your_twitter_client_id"
    TWITTER_CLIENT_SECRET="your_twitter_client_secret"
    LINKEDIN_CLIENT_ID="your_linkedin_client_id"
    LINKEDIN_CLIENT_SECRET="your_linkedin_client_secret"
    FACEBOOK_CLIENT_ID="your_facebook_app_id"
    FACEBOOK_CLIENT_SECRET="your_facebook_app_secret"
    TIKTOK_CLIENT_ID="your_tiktok_client_key"
    TIKTOK_CLIENT_SECRET="your_tiktok_client_secret"
    ```

4.  **Run the Worker:**

    ```bash
    npx wrangler dev
    ```

    Your backend is now running, typically at `http://localhost:8787`. Keep this terminal open.

### 2\. Frontend App Setup

In a **new terminal window**, set up and run the React frontend.

1.  **Navigate to Frontend Directory & Install:**

    ```bash
    cd frontend # From the root social-scheduler directory
    npm install
    ```

2.  **Run the Frontend:**

    ```bash
    npm run dev
    ```

    Your frontend is now running, typically at `http://localhost:5173`.

### 3\. Access Your App

Open your browser and go to **`http://localhost:5173`**. The application is fully functional, with the frontend automatically proxying API requests to your local backend worker.

-----

## 🔑 Getting API Keys & Credentials

Only you, the developer, need these keys. Your app's users will connect their accounts via a secure OAuth flow.

For each platform, you must configure the **Callback URL / Redirect URI**. This is a crucial security step.

  * **For Local Development:** `http://localhost:8787/api/auth/PLATFORM_NAME/callback`
  * **For Production:** `https://your-app-name.pages.dev/api/auth/PLATFORM_NAME/callback`

| Platform | Developer Portal | Required Products/Scopes |
| :--- | :--- | :--- |
| **X (Twitter)** | [developer.twitter.com](https://developer.twitter.com/) | OAuth 2.0, `tweet.read`, `tweet.write`, `users.read`, `offline.access`. **Requires paid API plan.** |
| **LinkedIn** | [linkedin.com/developers](https://www.linkedin.com/developers/) | `Sign In with LinkedIn`, `Share on LinkedIn`. |
| **Meta (FB/IG)** | [developers.facebook.com](https://developers.facebook.com/) | `Facebook Login`, `Instagram Graph API`. Requires Business accounts and App Review. |
| **TikTok** | [developers.tiktok.com](https://developers.tiktok.com/) | `Login Kit`, `Video Kit`. Requires a formal business application and review. |
| **Google Gemini**| [aistudio.google.com](https://aistudio.google.com/) | `Generative Language API`. |

-----

###  Full Explanation (Detailed for each platform)

Here is a more detailed, step-by-step guide to obtaining all the necessary API keys and credentials for each platform.

To connect your application to social media platforms, you must register a **developer application** on each one. This process provides you with a unique set of keys (**Client ID** and **Client Secret**) that identify your scheduler app. These keys are used to initiate the login flow for your users. **Only you, the developer, need to do this setup once.**

### The Callback URL: A Critical Security Step

Every platform will ask you for a **Callback URL** (sometimes called a **Redirect URI**). This is a whitelist of URLs that the platform is allowed to redirect users back to after they approve your app. It's a crucial security measure to prevent phishing attacks.

You must add URLs for both your local development and your live production environments.

* **For Local Development:** `http://localhost:8787/api/auth/PLATFORM_NAME/callback`
* **For Production:** `https://your-app-name.pages.dev/api/auth/PLATFORM_NAME/callback`

Replace `PLATFORM_NAME` with `twitter`, `linkedin`, etc. Replace `your-app-name.pages.dev` with your actual Cloudflare Pages URL.

---

### X (Twitter)

**Heads-up:** ⚠️ Posting content via the X API v2 requires a paid subscription to a plan like "Basic" or "Pro." The free tier is read-only.

1.  **Navigate to the X Developer Portal:** Go to [https://developer.twitter.com/](https://developer.twitter.com/) and sign in. You may need to apply for a developer account if it's your first time.
2.  **Create a Project:** In your dashboard, create a new Project. Give it a name, select a use case, and provide a description.
3.  **Create an App:** Inside your new Project, you'll be prompted to create an App. Select an environment (usually "Development" to start). Give your App a unique name.
4.  **Set Up User Authentication:**
    * After the app is created, find its settings and go to the **"User authentication settings"** section.
    * Click "Set up."
    * Enable **OAuth 2.0**.
    * Under "App Permissions," select **"Read and Write."**
    * Under "Type of App," select **"Web App, Automated App or Bot."**
5.  **Configure App Info:**
    * Under "App info," you must provide your **Callback URLs** and your Website URL.
    * **Callback URI / Redirect URL:**
        * `http://localhost:8787/api/auth/twitter/callback`
        * `https://your-app-name.pages.dev/api/auth/twitter/callback`
    * **Website URL:** `https://your-app-name.pages.dev`
6.  **Retrieve Your Keys:**
    * Navigate back to your App's dashboard and click on the **"Keys and Tokens"** tab.
    * You will see your **API Key** and **API Key Secret**, but these are for v1.1. You need the OAuth 2.0 keys.
    * Look for the **"OAuth 2.0 Client ID and Client Secret"** section. Copy both the **Client ID** and **Client Secret**.

**▶️ What you will get:**
* `TWITTER_CLIENT_ID`
* `TWITTER_CLIENT_SECRET`

---

### LinkedIn

**Heads-up:** 🏢 You must associate your developer app with a LinkedIn Company Page. If you don't have one, you'll need to create one first.

1.  **Navigate to the LinkedIn Developer Portal:** Go to [https://www.linkedin.com/developers/](https://www.linkedin.com/developers/) and sign in.
2.  **Create an App:** Click the "Create app" button.
3.  **Fill in App Details:** Provide an app name, associate it with your Company Page, and upload a logo.
4.  **Navigate to the "Auth" Tab:**
    * On your app's dashboard, click the **"Auth"** tab.
    * Your **Client ID** and **Client Secret** will be visible at the top.
    * Scroll down to **"OAuth 2.0 settings"** and click the pencil icon next to **"Authorized redirect URLs for your app."**
    * Add your callback URLs here:
        * `http://localhost:8787/api/auth/linkedin/callback`
        * `https://your-app-name.pages.dev/api/auth/linkedin/callback`
5.  **Request Product Access:**
    * Navigate to the **"Products"** tab.
    * By default, your app can't do much. You must request access to the products needed for your app to function.
    * Find **"Sign In with LinkedIn"** and click "Request access."
    * Find **"Share on LinkedIn"** and click "Request access." Access is usually granted instantly for these products.

**▶️ What you will get:**
* `LINKEDIN_CLIENT_ID`
* `LINKEDIN_CLIENT_SECRET`

---

### Meta (Facebook & Instagram)

**Heads-up:** জটিল This is the most complex setup. It requires an **Instagram Business Account** linked to a **Facebook Page**. For your app to be used by anyone other than you, it must pass a strict **App Review** process.

1.  **Navigate to Meta for Developers:** Go to [https://developers.facebook.com/](https://developers.facebook.com/) and log in.
2.  **Create an App:**
    * Go to "My Apps" and click **"Create App."**
    * Select an app type: **"Business."**
    * Provide an app name and your contact email.
3.  **Add Products:**
    * From your app's dashboard, you need to add "Products."
    * **Add "Facebook Login":** In its settings, find **"Valid OAuth Redirect URIs"** and add your callback URLs.
    * **Add "Instagram Graph API":** You will configure this product's permissions in the next step.
4.  **Configure Permissions:**
    * In the sidebar, go to **"App Review" -> "Permissions and Features."**
    * You need to request "Advanced Access" for the following permissions:
        * `pages_show_list`
        * `pages_read_engagement`
        * `instagram_basic`
        * `instagram_content_publish`
        * `business_management`
5.  **Retrieve Your Keys:**
    * In the sidebar, go to **"App Settings" -> "Basic."**
    * Your **App ID** and **App Secret** are displayed here.

**▶️ What you will get:**
* `FACEBOOK_CLIENT_ID` (this is the "App ID")
* `FACEBOOK_CLIENT_SECRET` (this is the "App Secret")

---

### TikTok

**Heads-up:** ⛔ Access to the TikTok API for posting is highly restricted and intended for established businesses. You must submit a detailed application and undergo a formal review. It is not suitable for personal projects.

1.  **Navigate to the TikTok Developer Portal:** Go to [https://developers.tiktok.com/](https://developers.tiktok.com/).
2.  **Create a New App:** Log in and go to "Manage apps" to create a new app. You will need to fill out a detailed form about your business and your app's purpose.
3.  **Configure Scopes:** If your application is approved, you will need to configure its scopes (permissions). Ensure you request:
    * `user.info.basic`
    * `video.upload`
4.  **Set Your Callback URL:** In your app's configuration, find the section for Redirect URIs and add your URLs:
    * `http://localhost:8787/api/auth/tiktok/callback`
    * `https://your-app-name.pages.dev/api/auth/tiktok/callback`
5.  **Retrieve Your Keys:** Once approved, your **Client Key** and **Client Secret** will be available in your app's dashboard.

**▶️ What you will get:**
* `TIKTOK_CLIENT_ID` (called "Client Key")
* `TIKTOK_CLIENT_SECRET`

---

### Google Gemini

**Heads-up:** 🤖 This is a direct API key, not part of an OAuth flow. Keep it extremely secure, as it's directly tied to your account's billing.

1.  **Navigate to Google AI Studio:** Go to [https://aistudio.google.com/](https://aistudio.google.com/) and sign in with your Google account.
2.  **Generate API Key:**
    * Click on **"Get API key"** in the left-hand menu.
    * Click **"Create API key in new project."**
3.  **Copy and Secure Your Key:** A new API key will be generated. Copy this key immediately and store it in a secure location (like a password manager). You will not be able to see it again.

**▶️ What you will get:**
* `GEMINI_API_KEY`

## ☁️ Deployment to Cloudflare

Follow these steps to deploy your application to production.

### 1\. Deploy the Backend Worker

1.  **Create a KV Namespace:**

      * In your Cloudflare dashboard, go to **Workers & Pages \> KV**.
      * Create a namespace (e.g., `USER_TOKENS`) and copy its **ID**.
      * Paste the ID into `workers/wrangler.toml` in the `[[kv_namespaces]]` section.

2.  **Set Production Secrets:**
    In your `workers/` directory, run the following command for **each secret** from your `.dev.vars` file.

    ```bash
    npx wrangler secret put GEMINI_API_KEY
    # Repeat for all other secrets...
    ```

3.  **Deploy:**

    ```bash
    npx wrangler deploy
    ```

    Your worker is now live.

### 2\. Deploy the Frontend Pages

1.  **Push to Git:** Make sure your entire project is on a GitHub or GitLab repository.

2.  **Connect to Cloudflare Pages:**

      * In the dashboard, go to **Workers & Pages** and select the **Pages** tab.
      * Click **Create application** and connect to your Git repository.

3.  **Configure Build Settings:**
    This is the most critical step. Use the following settings:

      * **Project name:** Choose a name (e.g., `social-scheduler-pro`).
      * **Production branch:** `main` (or your default branch).
      * **Framework preset:** `Vite`.
      * **Root Directory:** **`frontend`** (Important\!)
      * **Build command:** `npm run build`
      * **Build output directory:** `dist`

4.  **Save and Deploy:** Click **Save and Deploy**. Cloudflare will build and deploy your React application.

### 3\. Final Step: Update Callback URLs

Go back to the developer portals for each social media platform and **add your production callback URLs** (e.g., `https://social-scheduler-pro.pages.dev/api/auth/twitter/callback`). This is required for login to work on your live site.

Your application is now fully deployed\!