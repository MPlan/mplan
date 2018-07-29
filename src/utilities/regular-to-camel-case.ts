export function regularToCamelCase(reg: string) {
  const words = reg
    .trim()
    .toLowerCase()
    .split(' ')
    .filter(x => !!x)
    .map(s => s.substring(0, 1).toUpperCase() + s.substring(1));

  const firstWord = words[0];
  if (!firstWord) {
    return '';
  }

  return [firstWord.toLowerCase(), ...words.slice(1)].join('');
}
