import { fetchUndergraduateSubjects } from './';

describe('fetchUndergraduateSubjects', () => {
  it('fetches undergraduate subjects', async () => {
    const subjects = await fetchUndergraduateSubjects();
    expect(subjects).toMatchSnapshot();
  });
});
