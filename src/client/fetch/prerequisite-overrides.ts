import * as Model from 'models';
import { fetchWithAuth } from './fetch-with-auth';

export async function fetchPrerequisiteOverrides() {
  const response = await fetchWithAuth('/api/prerequisite-overrides', {
    method: 'get',
  });

  const data = (await response.json()) as { [key: string]: Model.Prerequisite.Model };
  return data;
}

export async function savePrerequisiteOverride(
  catalogId: string,
  prerequisites: Model.Prerequisite.Model,
) {
  const response = await fetchWithAuth(`/api/prerequisite-overrides/${catalogId}`, {
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prerequisites }),
  });
  if (response.status !== 204) throw new Error('Could not save mastered degree');
}

export async function deletePrerequisiteOverride(catalogId: string) {
  const response = await fetchWithAuth(`/api/prerequisite-overrides/${catalogId}`, {
    method: 'delete',
  });
  if (response.status !== 204) throw new Error('Could not save mastered degree');
}
