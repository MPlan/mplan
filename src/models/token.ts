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

export interface UserInfoResponse {
  sub: string;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
}
