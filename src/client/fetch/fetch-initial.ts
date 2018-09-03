import { fetchUser } from './user';
import { fetchCatalog } from './catalog';
import { fetchMasteredDegrees } from './mastered-degrees';

export async function fetchInitial() {
  const [user, catalog, masteredDegrees] = await Promise.all([
    fetchUser(),
    fetchCatalog(),
    fetchMasteredDegrees(),
  ]);
  return { user, catalog, masteredDegrees };
}
