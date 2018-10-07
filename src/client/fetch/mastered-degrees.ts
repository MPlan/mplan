import { fetchWithAuth } from './fetch-with-auth';
import * as Model from 'models';

export async function fetchMasteredDegrees() {
  const response = await fetchWithAuth('/api/degrees');
  const masteredDegrees = (await response.json()) as Model.MasteredDegrees.Model;
  return masteredDegrees;
}

export async function saveMasteredDegree(masteredDegree: Model.MasteredDegree.Model) {
  const response = await fetchWithAuth(`/api/degrees/${masteredDegree.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(masteredDegree),
  });
  if (response.status !== 204) throw new Error('Could not save mastered degree');
}

export async function deleteMasteredDegree(masteredDegreeId: string) {
  const response = await fetchWithAuth(`/api/degrees/${masteredDegreeId}`, {
    method: 'DELETE',
  });

  if (response.status !== 204) throw new Error('Could not delete mastered degree');
}
