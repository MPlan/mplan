import { fetchWithAuth } from './fetch-with-auth';
import * as Model from 'models';

export async function fetchCatalog() {
  const response = await fetchWithAuth('/api/catalog');
  const catalog = (await response.json()) as Model.Catalog.Model;
  return catalog;
}
