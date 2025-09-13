
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { handleOAuth, handleOAuthCallback } from './auth/oauth';
import { shortenTextWithGemini } from './services/gemini';
import { postToTwitter } from './adapters/twitter';
import { postToLinkedIn } from './adapters/linkedin';
import { postToMeta } from './adapters/meta';

const app = new Hono();

// CORS for frontend communication
app.use('/api/*', cors({
  origin: ['http://localhost:5173'], // Add your production frontend URL
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// --- AUTHENTICATION ROUTES ---
app.get('/api/auth/:platform', (c) => handleOAuth(c));
app.get('/api/auth/:platform/callback', (c) => handleOAuthCallback(c));

// --- POSTING ROUTE ---
app.post('/api/post', async (c) => {
  try {
    const { caption, platforms, mediaUrl, userId } = await c.req.json();
    
    if (!caption || !platforms || !userId) {
      return c.json({ error: 'Missing required fields: caption, platforms, userId' }, 400);
    }
    
    const results = {};

    for (const platform of platforms) {
      try {
        let finalCaption = caption;

        // 1. Get user token for the platform
        const tokenData = await c.env.USER_TOKENS.get(`${userId}:${platform}`);
        if (!tokenData) {
          throw new Error(`User token for ${platform} not found.`);
        }
        const token = JSON.parse(tokenData).accessToken;

        // 2. Handle platform-specific logic
        switch (platform) {
          case 'twitter':
            // Check caption length and shorten if necessary
            if (finalCaption.length > 280) {
              finalCaption = await shortenTextWithGemini(finalCaption, 280, c.env.GEMINI_API_KEY);
            }
            results.twitter = await postToTwitter(finalCaption, mediaUrl, token, c.env);
            break;
            
          case 'linkedin':
             if (finalCaption.length > 3000) {
               // Although unlikely, good to have a check
               finalCaption = caption.substring(0, 3000);
            }
            results.linkedin = await postToLinkedIn(finalCaption, mediaUrl, token, c.env);
            break;
            
          case 'instagram':
          case 'facebook':
            results[platform] = await postToMeta(platform, finalCaption, mediaUrl, token, c.env);
            break;

          // TODO: Add TikTok case
          case 'tiktok':
            results.tiktok = { success: false, message: 'TikTok posting is not yet implemented.' };
            break;

          default:
            console.warn(`Unknown platform: ${platform}`);
        }
      } catch (error) {
        console.error(`Failed to post to ${platform}:`, error);
        results[platform] = { success: false, message: error.message };
      }
    }
    
    return c.json({ success: true, results });

  } catch (error) {
    console.error('Error in /api/post:', error);
    return c.json({ error: 'An internal error occurred.', details: error.message }, 500);
  }
});

// --- 404 Handler ---
app.notFound((c) => {
  return c.text('Not Found', 404);
});

// --- Error Handler ---
app.onError((err, c) => {
  console.error(`${err}`);
  return c.text('Internal Server Error', 500);
});

export default app;
