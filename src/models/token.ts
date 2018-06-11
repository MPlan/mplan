export interface AccessTokenPayload {
  sub: string;
  azp: string;
  iss: string;
  exp: number;
  iat: number;
  jti: string;
}

export interface IdTokenPayload {
  acr: string;
  sub: string;
  aud: string;
  auth_time: string;
  amr: string;
  kid: string;
  iss: string;
  exp: number;
  iat: number;
  jti: string;
}