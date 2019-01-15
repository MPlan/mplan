import * as Model from 'models';
import { fetchWithAuth } from './fetch-with-auth';
import { Auth } from 'client/auth';

export async function fetchUser() {
  const username = await Auth.username();
  if (!username) throw new Error('no username found when fetching user');
  const response = await fetchWithAuth(`/api/users/${username}`);
  if (response.status !== 200) throw new Error('Failed to fetch user from server');
  return (await response.json()) as Model.User.Model;
}

export async function saveUser(user: Model.User.Model) {
  const response = await fetchWithAuth(`/api/users/${user.username}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

  if (response.status !== 204) throw new Error('Could not save user');
}
