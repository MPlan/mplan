import { WebAuth } from 'auth0-js';
import { history } from './app';
import * as jwtDecode from 'jwt-decode';
import { encode } from '../utilities/utilities';
import { AccessTokenPayload } from '../models/token';
import { wait } from 'utilities/utilities';

const authorizeUrl = 'https://shibboleth.umich.edu/idp/profile/oidc/authorize';
const redirectUri = `${window.location.protocol}//${window.location.host}/callback`;

function login() {
  if (process.env.NODE_ENV !== 'production') {
    window.location.href = `${window.location.origin}/callback`;
  }

  window.location.href = `${authorizeUrl}?${encode({
    response_type: 'code',
    client_id: '7be756e5-fa58-4699-87b7-67acb051125f',
    redirect_uri: redirectUri,
  })}`;
}

function logout() {
  localStorage.removeItem('accessToken');
  history.push('/login');
}

function loggedIn() {
  if (process.env.NODE_ENV !== 'production') return true;

  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    return false;
  }
  const decoded = jwtDecode(accessToken) as AccessTokenPayload;
  if (!decoded) {
    return false;
  }
  if (new Date().getTime() >= decoded.exp * 1000) {
    return false;
  }
  return true;
}

function userDisplayName() {
  if (process.env.NODE_ENV !== 'production') return 'Local Test User';

  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    return undefined;
  }
  const decoded = jwtDecode(accessToken) as any;
  if (!decoded) {
    return undefined;
  }
  return decoded.sub || undefined;
}

function username() {
  if (process.env.NODE_ENV !== 'production') return process.env.TEST_USERNAME;

  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    return undefined;
  }
  const decoded = jwtDecode(accessToken) as AccessTokenPayload;
  if (!decoded) {
    return undefined;
  }
  return decoded.sub || undefined;
}

async function handleCallback() {
  if (process.env.NODE_ENV !== 'production') return;

  const code = new URL(window.location.href).searchParams.get('code');
  if (!code) return;
  const token = await fetchToken(code);

  localStorage.setItem('accessToken', token);
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
  const token = data.access_token as string;
  return token;
}

async function token() {
  if (process.env.NODE_ENV !== 'production') return 'fake_token';
  
  while (!loggedIn()) {
    await wait(500);
  }

  const token = localStorage.getItem('accessToken');
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
