import * as Model from 'models';
import { fetchWithAuth } from './fetch-with-auth';

export async function fetchUser(username: string) {
  const response = await fetchWithAuth(`/api/users/${username}`);
  if (response.status !== 200) throw new Error('Failed to fetch user from server');
  return (await response.json()) as Model.User.Model;
}
