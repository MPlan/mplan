import { regularToCamelCase } from './regular-to-camel-case';

describe('regularToCamelCase', () => {
  it('regularToCamelCase', function() {
    const regularString = '  The quick Brown FOX juMps  Over the Lazy dog  ';
    expect(regularToCamelCase(regularString)).toBe('theQuickBrownFoxJumpsOverTheLazyDog');
  });
});
