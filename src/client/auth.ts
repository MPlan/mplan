import * as jwtDecode from 'jwt-decode';
import * as Model from 'models';
import { history } from 'client/history';
import { encode } from '../utilities/utilities';
import { wait, getOrThrow } from 'utilities/utilities';

const authorizeUrl = getOrThrow(process.env.AUTHORIZATION_URI);
const clientId = getOrThrow(process.env.CLIENT_ID);
const redirectUri = getOrThrow(process.env.REDIRECT_URI);

function login() {
  if (process.env.NODE_ENV !== 'production') {
    window.location.href = `${window.location.origin}/callback`;
  }

  window.location.href = `${authorizeUrl}?${encode({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'openid profile email',
  })}`;
}

function logout() {
  localStorage.removeItem('token');
  history.push('/login');
}

function loggedIn() {
  if (process.env.NODE_ENV !== 'production') return true;

  const token = localStorage.getItem('token');
  if (!token) return false;

  const decoded = jwtDecode(token) as Model.IdTokenPayload;
  if (!decoded) return false;

  if (new Date().getTime() >= decoded.exp * 1000) return false;
  return true;
}

function userDisplayName() {
  if (process.env.NODE_ENV !== 'production') return process.env.TEST_USERNAME;

  const userInfoString = localStorage.getItem('userInfo');
  if (!userInfoString) return undefined;

  const decoded = JSON.parse(userInfoString) as Model.UserInfoResponse;
  if (!decoded) return undefined;

  return decoded.name || undefined;
}

function username() {
  if (process.env.NODE_ENV !== 'production') return process.env.TEST_USERNAME;

  const userInfoString = localStorage.getItem('userInfo');
  if (!userInfoString) return undefined;

  const decoded = JSON.parse(userInfoString) as any;
  if (!decoded) return undefined;

  return decoded.preferred_username || undefined;
}

async function handleCallback() {
  if (process.env.NODE_ENV !== 'production') return;

  const code = new URL(window.location.href).searchParams.get('code');
  if (!code) return;
  const { idToken, userInfo } = await fetchToken(code);

  localStorage.setItem('token', idToken);
  localStorage.setItem('userInfo', JSON.stringify(userInfo));
}

async function fetchToken(code: string) {
  const result = await fetch('/api/auth/token', {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify({
      code,
      redirect_uri: redirectUri,
    }),
  });
  const data = await result.json();
  const idToken = data.id_token as string;
  const userInfo = data.user_info as Model.UserInfoResponse;
  return { idToken, userInfo };
}

async function token() {
  if (process.env.NODE_ENV !== 'production') return 'fake_token';

  while (!loggedIn()) {
    await wait(500);
  }

  const token = localStorage.getItem('token');
  if (!token) throw new Error('Could not get token after log in');

  return token;
}

export const Auth = {
  login,
  logout,
  loggedIn,
  userDisplayName,
  handleCallback,
  username,
  token,
};
