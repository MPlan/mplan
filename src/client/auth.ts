import { WebAuth } from 'auth0-js';
import { history } from './app';
import * as jwtDecode from 'jwt-decode';
import { encode } from '../utilities/utilities';
import { IdTokenPayload } from '../models/id-token';

const authorizeUrl = 'https://shibboleth.umich.edu/idp/profile/oidc/authorize';
const redirectUri = `${window.location.protocol}//${window.location.host}/callback`;

function login() {
  if (process.env.NODE_ENV !== 'production') {
    window.location.href = `${window.location.origin}/callback`;
  }
  
  window.location.href = `${authorizeUrl}?${encode({
    response_type: 'code',
    client_id: '7be756e5-fa58-4699-87b7-67acb051125f',
    redirect_uri: redirectUri
  })}`;
}

function logout() {
  localStorage.removeItem('idToken');
  history.push('/login');
}

function loggedIn() {
  if (process.env.NODE_ENV !== 'production') return true;

  const idToken = localStorage.getItem('idToken');
  if (!idToken) {
    return false;
  }
  const decoded = jwtDecode(idToken) as any;
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

  const idToken = localStorage.getItem('idToken');
  if (!idToken) {
    return undefined;
  }
  const decoded = jwtDecode(idToken) as any;
  if (!decoded) {
    return undefined;
  }
  return decoded.name || decoded.nickname || undefined;
}

function username() {
  if (process.env.NODE_ENV !== 'production') return process.env.TEST_USERNAME;

  const idToken = localStorage.getItem('idToken');
  if (!idToken) {
    return undefined;
  }
  const decoded = jwtDecode(idToken) as IdTokenPayload;
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

  localStorage.setItem('idToken', token);
}

async function fetchToken(code: string) {
  const result = await fetch('/api/auth/token', {
    method: 'POST',
    body: JSON.stringify({
      code,
      redirect_uri: redirectUri
    })
  });
  const data = await result.json();
  const token = data.id_token as string;
  return token;
}

export const Auth = {
  login,
  logout,
  loggedIn,
  userDisplayName,
  handleCallback,
  username
};
