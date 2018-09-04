/**
 * searches a list with a semi decent ranking algorithm that considers
 * different parts of each word and the query
 */
export function searchList<T>(list: T[], getListString: (t: T) => string, query: string) {
  if (!query) return list;

  const queryParts = query
    .toLowerCase()
    .split(' ')
    .map(x => x.trim())
    .filter(x => !!x);

  return list
    .map(item => ({
      item,
      normalized: getListString(item)
        .toLowerCase()
        .split(' ')
        .map(subword => subword.trim())
        .filter(x => !!x),
    }))
    .map(({ item, normalized }) => ({
      item,
      rank: normalized.reduce(
        (wordRank, subword) =>
          wordRank +
          queryParts.reduce((partRank, queryPart) => {
            // if the `subword` matches a `queryPart` exactly, rank it higher
            if (subword === queryPart) return partRank + 3;
            // if it only starts with the query part, rank it, but lower
            if (subword.startsWith(queryPart)) return partRank + 2;
            return partRank;
          }, 0),
        0,
      ),
    }))
    .filter(({ rank }) => rank > 0)
    .sort((a, b) => b.rank - a.rank) // descending
    .map(({ item }) => item);
}
