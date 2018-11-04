import * as Model from 'models';
import { fetchWithAuth } from './fetch-with-auth';

export async function fetchPrerequisiteOverrides() {
  const response = await fetchWithAuth('/api/prerequisite-overrides', {
    method: 'get',
  });

  const data = (await response.json()) as { [key: string]: Model.Prerequisite.Model };
  return data;
}
