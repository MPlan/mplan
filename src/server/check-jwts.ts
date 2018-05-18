import { Request, Response, NextFunction } from 'express';
import * as HttpStatus from 'http-status';
import axios from 'axios';
import { getOrThrow } from '../utilities/utilities';
const jwkToPem = require('jwk-to-pem');
import * as jwt from 'jsonwebtoken';

const jwkUri = getOrThrow(process.env.JWK_URI);
const audience = getOrThrow(process.env.CLIENT_ID);
const issuer = getOrThrow(process.env.ISSUER);

let publicKeyPem = undefined as undefined | string;
export async function getPublicKeyFromJwk() {
  if (publicKeyPem) return publicKeyPem;

  const response = await axios.get(jwkUri);
  const jwk = response.data.keys[0];
  const pem = jwkToPem(jwk) as string;
  publicKeyPem = pem;
  return pem;
}

interface IdToken {
  sub: string;
}

/** middleware that checks the auth using JWTs taken directly from auth0's docs */
export const checkJwts = async (req: Request, res: Response, next: NextFunction) => {
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
  
  try {
    const pem = await getPublicKeyFromJwk();
    const result = jwt.verify(token, pem) as IdToken;
  
    req.user = result;
    req.user.nickname = result.sub;
    next();
  } catch (e) {
    res.sendStatus(HttpStatus.UNAUTHORIZED);
    return;
  }
};
