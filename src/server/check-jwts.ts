import * as jwt from 'express-jwt';
import * as jwksRsa from 'jwks-rsa';

const jwksUri = process.env.AUTH0_JWKS_URI;
const audience = process.env.CLIENT_ID;
const issuer = process.env.AUTH0_ISS;
if (!jwksUri) throw new Error('no AUTH0_JWKS_URI found in env');
if (!audience) throw new Error('no CLIENT_ID found in env');
if (!issuer) throw new Error('no AUTH0_ISS found in env');

/** middleware that checks the auth using JWTs taken directly from auth0's docs */
export const checkJwts = jwt({
  // Dynamically provide a signing key
  // based on the kid in the header and
  // the singing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri,
  }),
  // Validate the audience and the issuer.
  audience,
  issuer,
  algorithms: ['RS256'],
});
