import { fetchUser } from './user';
import { fetchCatalog } from './catalog';

export async function fetchInitial() {
  const [user, catalog] = await Promise.all([fetchUser(), fetchCatalog()]);
  return { user, catalog };
}
