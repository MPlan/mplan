import { fetchCourses } from './';

describe('fetchCourses', () => {
  it('fetches all the undergrad ECE courses', async () => {
    const courses = await fetchCourses('undergraduate', 'ece');
    expect(courses).toMatchSnapshot();
  });
});
