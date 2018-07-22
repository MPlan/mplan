require('dotenv').config();
import { getPublicKeyFromJwk } from './check-jwts';

describe('getPublicKeyFromJwk', () => {
  it('gets the public key from the link', async () => {
    const pem = await getPublicKeyFromJwk();
    expect(pem).toBeDefined();
    expect(pem).toMatchSnapshot();
  });
});
