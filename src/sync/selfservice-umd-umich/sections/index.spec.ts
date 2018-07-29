import { fetchSections } from './';

describe('fetchSections', () => {
  it('fetches the sections for CIS 450 201910', async () => {
    const sections = await fetchSections('201910', 'cis', '450');
    expect(sections).toBeTruthy();
    expect(sections).toMatchSnapshot();
  });
});
