
// A simplified OAuth 2.0 PKCE flow handler
// NOTE: This is a conceptual implementation. Each platform has specific requirements.
// You MUST consult the official documentation for each platform's OAuth flow.

const getPlatformConfig = (platform, env) => {
  const configs = {
    twitter: {
      clientId: env.TWITTER_CLIENT_ID,
      clientSecret: env.TWITTER_CLIENT_SECRET,
      authUrl: 'https://twitter.com/i/oauth2/authorize',
      tokenUrl: 'https://api.twitter.com/2/oauth2/token',
      scopes: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'].join(' '),
    },
    linkedin: {
      clientId: env.LINKEDIN_CLIENT_ID,
      clientSecret: env.LINKEDIN_CLIENT_SECRET,
      authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
      tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
      scopes: ['r_liteprofile', 'w_member_social'].join(' '),
    },
    // ... add configs for Meta (Facebook/Instagram) and TikTok
  };
  return configs[platform];
};

export const handleOAuth = async (c) => {
  const { platform } = c.req.param();
  const config = getPlatformConfig(platform, c.env);

  if (!config) {
    return c.text('Invalid platform', 400);
  }
  
  // A real implementation would generate and store a state and code_verifier
  const state = 'mock_state_12345'; // REPLACE with secure random string
  const redirectUri = `${c.env.BASE_URL}/api/auth/${platform}/callback`;

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: config.clientId,
    redirect_uri: redirectUri,
    scope: config.scopes,
    state: state,
    // For Twitter PKCE
    code_challenge: 'challenge', // REPLACE with real PKCE code challenge
    code_challenge_method: 'S256',
  });

  const authorizationUrl = `${config.authUrl}?${params.toString()}`;
  return c.redirect(authorizationUrl);
};

export const handleOAuthCallback = async (c) => {
  const { platform } = c.req.param();
  const { code, state } = c.req.query();
  
  // Here you would verify the 'state' parameter to prevent CSRF attacks
  
  const config = getPlatformConfig(platform, c.env);
  if (!config) {
    return c.text('Invalid platform', 400);
  }

  const redirectUri = `${c.env.BASE_URL}/api/auth/${platform}/callback`;
  
  const tokenRequestBody = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirectUri,
    client_id: config.clientId,
    client_secret: config.clientSecret, // For platforms that require it
    // For Twitter PKCE
    code_verifier: 'verifier', // REPLACE with the stored code_verifier
  });

  try {
    const response = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenRequestBody.toString(),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Token exchange failed: ${response.status} ${errorText}`);
    }

    const tokenData = await response.json();
    const { access_token, refresh_token, expires_in } = tokenData;

    // A real app would get user ID from a /me endpoint using the new token
    const userId = 'user_123'; // Placeholder user ID

    // Store the tokens securely in KV
    await c.env.USER_TOKENS.put(`${userId}:${platform}`, JSON.stringify({
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresAt: Date.now() + (expires_in * 1000),
    }), { expirationTtl: 60 * 60 * 24 * 90 }); // Expire in 90 days

    // Redirect user back to the frontend
    // In a real app, you would pass a status or token back to the frontend
    const frontendUrl = 'http://localhost:5173'; // Your frontend URL
    return c.redirect(`${frontendUrl}/dashboard?status=success&platform=${platform}`);

  } catch (error) {
    console.error(`OAuth callback error for ${platform}:`, error);
    return c.text('Failed to authenticate.', 500);
  }
};
