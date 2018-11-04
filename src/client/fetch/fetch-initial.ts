import { fetchUser } from './user';
import { fetchCatalog } from './catalog';
import { fetchMasteredDegrees } from './mastered-degrees';
import { fetchPrerequisiteOverrides } from './prerequisite-overrides';

export async function fetchInitial() {
  const [user, catalog, masteredDegrees, prerequisiteOverrides] = await Promise.all([
    fetchUser(),
    fetchCatalog(),
    fetchMasteredDegrees(),
    fetchPrerequisiteOverrides(),
  ]);
  return { user, catalog, masteredDegrees, prerequisiteOverrides };
}
