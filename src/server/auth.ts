import * as express from 'express';
import * as Model from '../models';
import * as HttpStatus from 'http-status';
import axios from 'axios';
import { encode, getOrThrow } from '../utilities/utilities';
import { dbConnection } from './models/mongo';
import { ObjectId } from 'utilities/object-id';

export const auth = express.Router();

const tokenUri = getOrThrow(process.env.TOKEN_URI);
const clientId = getOrThrow(process.env.CLIENT_ID);
const clientSecret = getOrThrow(process.env.CLIENT_SECRET);
const userInfoUri = getOrThrow(process.env.USER_INFO_URI);

interface TokenResponse {
  access_token: string;
  token_type: 'Bearer';
  refresh_token: string;
  expires_in: number;
  id_token: string;
}

async function exchangeForToken(code: string, redirectUri: string) {
  const tokenResponse = await axios({
    method: 'post',
    url: tokenUri,
    auth: {
      username: clientId,
      password: clientSecret,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: encode({
      grant_type: 'authorization_code',
      client_id: clientId,
      code: code,
      redirect_uri: redirectUri,
    }),
  });
  return tokenResponse.data as TokenResponse;
}

async function getUserInfo(accessToken: string) {
  const userInfoResponse = await axios({
    method: 'get',
    url: userInfoUri,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return userInfoResponse.data as Model.UserInfoResponse;
}

auth.post('/token', async (req, res) => {
  const code = req.body.code;
  const redirectUri = req.body.redirect_uri;
  if (!code) return res.sendStatus(HttpStatus.BAD_REQUEST);
  if (!redirectUri) return res.sendStatus(HttpStatus.BAD_REQUEST);

  try {
    const tokenResponse = await exchangeForToken(code, redirectUri);
    const userInfo = await getUserInfo(tokenResponse.access_token);

    const username = userInfo.sub;

    const { users } = await dbConnection;
    const user = await users.findOne({ username });

    if (!user) {
      const id = ObjectId();
      const newUser: Model.User.Model & { _id: any } = {
        _id: id,
        id: id,
        chosenDegree: false,
        degree: {
          courseGroupData: {},
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
      user_info: userInfo,
    });
  } catch (e) {
    console.error(e);
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
  }
});
