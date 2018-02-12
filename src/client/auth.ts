import { WebAuth } from 'auth0-js';
import { history } from './app';
import * as jwtDecode from 'jwt-decode';

const webAuth = new WebAuth({
  domain: 'formandfocus.auth0.com',
  clientID: 'GT3zNDGUgKV9Rxu1a0Lz6zs51fHuyhY3',
  responseType: 'token id_token',
  audience: 'https://formandfocus.auth0.com/userinfo',
  scope: 'openid profile',
  redirectUri: 'http://localhost:8080/callback'
});

function login() {
  webAuth.authorize();
}

function logout() {
  localStorage.removeItem('idToken');
  history.push('/login');
}

function loggedIn() {
  const idToken = localStorage.getItem('idToken');
  if (!idToken) { return false; }
  const decoded = jwtDecode(idToken) as any;
  if (!decoded) { return false; }
  if (new Date().getTime() >= decoded.exp * 1000) { return false; } 
  return true;
}

function userDisplayName() {
  const idToken = localStorage.getItem('idToken');
  if (!idToken) { return undefined; }
  const decoded = jwtDecode(idToken) as any;
  if (!decoded) { return undefined; }
  return decoded.name || decoded.nickname || undefined;
}

function handleCallback() {
  return new Promise<void>((resolve, reject) => {
    webAuth.parseHash((error, decoded) => {
      if (error) { reject(error); }
      if (!decoded.idToken) { reject(new Error('No id token present in decoded hash')); return; }
      localStorage.setItem('idToken', decoded.idToken);
      resolve();
    });
  });
}

export const Auth = {
  login,
  logout,
  loggedIn,
  userDisplayName,
  handleCallback,
};
