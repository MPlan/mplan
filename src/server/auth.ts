import * as express from 'express';
export const auth = express.Router();
import * as HttpStatus from 'http-status';
import axios from 'axios';
import { encode, getOrThrow } from '../utilities/utilities';
import * as jwtDecode from 'jwt-decode';
import { dbConnection } from './models/mongo';

const tokenUri = getOrThrow(process.env.TOKEN_URI);
const clientId = getOrThrow(process.env.CLIENT_ID);
const clientSecret = getOrThrow(process.env.CLIENT_SECRET);

interface TokenResponse {
  access_token: string;
  token_type: 'Bearer';
  refresh_token: string;
  expires_in: number;
  scope: string;
  id_token: string;
}

interface IdToken {
  sub: string;
  aud: string;
  auth_time: number;
  kid: string;
  iss: string;
  exp: string;
  iat: string;
  jti: string;
}

async function exchangeForToken(code: string, redirectUri: string) {
  const url = `${tokenUri}?${encode({
    grant_type: 'authorization_code',
    client_id: clientId,
    client_secret: clientSecret,
    code: code,
    redirect_uri: redirectUri,
  })}`;

  const tokenResponse = await axios.post(url);
  return tokenResponse.data as TokenResponse;
}

// async function getOrCreateUser(username: string) {
//   cons
// }

auth.post('/token', async (req, res) => {
  const code = req.body.code;
  const redirectUri = req.body.redirect_uri;
  if (!code) return res.sendStatus(HttpStatus.BAD_REQUEST);
  if (!redirectUri) return res.sendStatus(HttpStatus.BAD_REQUEST);

  try {
    const tokenResponse = await exchangeForToken(code, redirectUri);
    const idToken = jwtDecode(tokenResponse.id_token) as IdToken;

    const username = idToken.sub;
    res.json({
      tokenResponse,
      idToken,
      username,
    })
  } catch (e) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    res.send('Could not exchange code for token');
  }
});