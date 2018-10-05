import { Request, Response, NextFunction } from 'express';
import * as HttpStatus from 'http-status';
import * as redisLib from 'redis';
import axios from 'axios';
import { getOrThrow } from '../utilities/utilities';
const jwkToPem = require('jwk-to-pem');
import * as jwt from 'jsonwebtoken';
import { AccessTokenPayload } from 'models/token';

const jwkUri = getOrThrow(process.env.JWK_URI);
const redisUrl = getOrThrow(process.env.REDIS_URL);

const redis = redisLib.createClient(redisUrl);

interface UserInfoResponse {
  sub: string;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
}

function getUserInfoFromToken(idToken: string) {
  return new Promise<UserInfoResponse>((resolve, reject) => {
    redis.get(idToken, (err, result) => {
      if (err) {
        reject(err);
        return;
      }

      const userInfo = JSON.parse(result) as UserInfoResponse;
      resolve(userInfo);
    });
  });
}

let publicKeyPem = undefined as undefined | string;
export async function getPublicKeyFromJwk() {
  if (publicKeyPem) return publicKeyPem;

  const response = await axios.get(jwkUri);
  const jwk = response.data.keys[0];
  const pem = jwkToPem(jwk) as string;
  publicKeyPem = pem;
  return pem;
}

export async function checkJwts(req: Request, res: Response, next: NextFunction) {
  if (process.env.NODE_ENV !== 'production') {
    req.user = {
      nickname: process.env.TEST_USERNAME,
    };
    next();
    return;
  }

  const authorization = req.headers.authorization;
  if (!authorization) {
    res.sendStatus(HttpStatus.UNAUTHORIZED);
    return;
  }
  const tokenMatch = /Bearer\s*(.*)/.exec(authorization);
  if (!tokenMatch) {
    res.sendStatus(HttpStatus.UNAUTHORIZED);
    return;
  }
  const token = tokenMatch[1];
  if (!token) {
    res.sendStatus(HttpStatus.UNAUTHORIZED);
    return;
  }

  const pem = await getPublicKeyFromJwk();

  const result = jwt.verify(token, pem) as AccessTokenPayload;
  const userInfo = await getUserInfoFromToken(token);

  if (result.sub !== userInfo.sub) throw new Error('User info SUB does not match result sub');

  req.user = userInfo;
  req.user.nickname = userInfo.preferred_username;
  next();
}
