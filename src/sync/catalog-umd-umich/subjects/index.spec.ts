import { fetchSubjects } from './';

describe('fetchUndergraduateSubjects', () => {
  it('fetches undergraduate subjects', async () => {
    const subjects = await fetchSubjects('undergraduate');
    expect(subjects).toMatchSnapshot();
  });
});
