import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URL,
});

export const getGoogleAuthUrl = () => {
  const scopes = ['openid', 'email', 'profile'];
  
  console.log('🔍 GOOGLE_REDIRECT_URL:', process.env.GOOGLE_REDIRECT_URL);

  const url = client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: scopes,
    redirect_uri: process.env.GOOGLE_REDIRECT_URL,
  });

  console.log('🔍 URL générée:', url);

  return url;
};

export const getGoogleUser = async (code: string) => {
  const { tokens } = await client.getToken({
    code,
    redirect_uri: process.env.GOOGLE_REDIRECT_URL,
  });

  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token!,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  return {
    googleId: payload!.sub,
    email: payload!.email,
    name: payload!.name,
    picture: payload!.picture,
  };
};
