import { fetchWithAuth } from './fetch-with-auth';
import * as Model from 'models';

export async function fetchMasteredDegrees() {
  const response = await fetchWithAuth('/api/degrees');
  const masteredDegrees = (await response.json()) as Model.MasteredDegrees.Model;
  return masteredDegrees;
}
