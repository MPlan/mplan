import * as express from 'express';
import * as Model from '../models';
import * as jwtDecode from 'jwt-decode';
import * as HttpStatus from 'http-status';
import axios from 'axios';
import { encode, getOrThrow } from '../utilities/utilities';
import { dbConnection } from './models/mongo';
import { ObjectId } from 'utilities/object-id';
export const auth = express.Router();

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

auth.post('/token', async (req, res) => {
  const code = req.body.code;
  const redirectUri = req.body.redirect_uri;
  if (!code) return res.sendStatus(HttpStatus.BAD_REQUEST);
  if (!redirectUri) return res.sendStatus(HttpStatus.BAD_REQUEST);

  const tokenResponse = await exchangeForToken(code, redirectUri);
  const decoded = jwtDecode(tokenResponse.access_token) as Model.AccessTokenPayload;
  const username = decoded.sub;

  const { users } = await dbConnection;
  const user = await users.findOne({ username });

  if (!user) {
    const id = ObjectId();
    const newUser: Model.User.Model & { _id: any } = {
      _id: id,
      id: id,
      chosenDegree: false,
      degree: {
        degreeGroupData: {},
        masteredDegreeId: undefined,
      },
      isAdmin: false,
      lastLoginDate: Date.now(),
      lastUpdateDate: Date.now(),
      plan: {
        anchorSeason: 'fall',
        anchorYear: new Date().getFullYear(),
        semesters: [],
      },
      registerDate: Date.now(),
      username,
      userPrerequisiteOverrides: {},
    };

    await users.insertOne(newUser);
  }

  res.json({
    id_token: tokenResponse.id_token,
    refresh_token: tokenResponse.refresh_token,
    access_token: tokenResponse.access_token,
  });
});
