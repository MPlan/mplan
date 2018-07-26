import { oneLine } from 'common-tags';
import { formDecode } from 'utilities/form-encode-decode';
import { Prerequisite } from '../models';

/** A simple interface that extends an array */
export interface ParseTree extends Array<string | ParseTree> {
  [key: number]: string | ParseTree;
}

/**
 * Given the HTML containing the prerequisites, this function will find all the anchors denoting
 * course in the catalog and replace them with a `__SUBJECT-CODE|COURSE-NUMBER__` directive. This
 * directive will be parsed out later.
 */
export function replacePrerequisiteAnchors(courseBlockExtra: Element) {
  const document = courseBlockExtra.ownerDocument;
  const anchors = Array.from(courseBlockExtra.querySelectorAll('a'))
    .filter(link => {
      const query = link.href.split('?')[1];
      if (!query) return false;
      const decoded = formDecode(query);
      if (!decoded.P) return false;
      const p = decoded.P;
      if (!/(\w*)\s*(\w*)/.test(p)) return false;
      return true;
    })
    .map(anchor => {
      const query = anchor.href.split('?')[1];
      const decoded = formDecode(query);
      const p = decoded.P;
      const subjectCodeCourseNumberMatch = /(\w*)\s*(\w*)/i.exec(p);
      if (!subjectCodeCourseNumberMatch) {
        throw new Error(
          'could get not course and subject code from anchor when parsing prerequisites',
        );
      }
      const subjectCode = subjectCodeCourseNumberMatch[1];
      const courseNumber = subjectCodeCourseNumberMatch[2];
      if (!subjectCode) throw new Error('subject code was falsy when parsing prerequisites');
      if (!courseNumber) throw new Error('course number was falsy when parsing prerequisites');

      return {
        anchor,
        subjectCode,
        courseNumber,
      };
    });

  for (const { anchor, subjectCode, courseNumber } of anchors) {
    const anchorParent = anchor.parentElement;
    if (!anchorParent) {
      throw new Error(`Anchor parent was null`); // should never happen
    }
    // replaces the anchor with an easily parsed string directive
    anchorParent.replaceChild(
      document.createTextNode(`__${subjectCode}|${courseNumber}__`),
      anchor,
    );
  }

  const arr = [courseBlockExtra.textContent || ''];
  const oneLined = oneLine(Object.assign(arr, { raw: arr }));
  const prerequisiteMatch = /prerequisite.*:([^:]*)/i.exec(oneLined);
  if (!prerequisiteMatch) throw new Error('could not info out of perquisite block');
  const textContent = prerequisiteMatch[1].trim();
  const withConcurrent = textContent.replace(/__(\w*)\|(\w*)__\s*\*/g, '__$1|$2|CONCURRENT__');
  const withPrevious = withConcurrent.replace(/__(\w*)\|(\w*)__(?!\*)/g, '__$1|$2|PREVIOUS__');
  return withPrevious;
}

/**
 * Recursive function that takes in a string which can include `(` `)` and transforms it into an
 * array of arrays. Strings get separated by spaces and substrings inside of `(` `)` will get put
 * into a sub array:
 *
 * e.g.:
 *
 * ```txt
 * the quick (brown (fox jumps) over the (lazy dog))
 * ```
 *
 * becomes:
 *
 * ```js
 * ['the', 'quick', ['brown', ['fox', 'jumps'], 'over', 'the', ['lazy', 'dog']]]
 * ```
 */
export function transformParenthesesToTree(
  expression: string,
): { tree: ParseTree; lastIndex: number } {
  const characters = expression.split('');
  const tokens = [] as ParseTree;
  let i = 0;
  let currentToken = '';
  while (i < expression.length) {
    const character = characters[i];
    if (character === ' ') {
      // terminal character
      if (currentToken) {
        // check to see if the `currentToken` is falsy
        tokens.push(currentToken);
        currentToken = '';
      }
    } else if (character === '(') {
      const subExpressionResult = transformParenthesesToTree(expression.substring(i + 1));
      i += subExpressionResult.lastIndex;
      tokens.push(subExpressionResult.tree);
    } else if (character === ')') {
      // also terminal character but returns the sub expression
      if (currentToken) {
        // check to see if the `currentToken` is falsy
        tokens.push(currentToken);
      }
      return { tree: tokens, lastIndex: i + 1 };
    } else {
      currentToken += character;
    }
    i += 1;
  }

  if (currentToken) {
    // adds the last current token if there is one
    tokens.push(currentToken);
  }

  return { tree: tokens, lastIndex: i };
}

/**
 * If the string provided matches `/__(.*)\|(.*)__/` (e.g. `blah __CIS|310__ blah`) then the
 * function will return just the `__CIS|310__` and leave out the `blah blah`
 */
export function replaceCourseDirective(token: string) {
  const match = /__(.+)\|(.+)\|(.+)__/.exec(token);
  if (!match) return undefined;

  const subjectCode = match[1].trim().toUpperCase();
  const courseNumber = match[2].trim().toUpperCase();
  const previousOrConcurrent = match[3].trim().toUpperCase();
  if (previousOrConcurrent !== 'PREVIOUS' && previousOrConcurrent !== 'CONCURRENT') {
    throw new Error(
      `Last value in match was neither "PREVIOUS" or "CONCURRENT". It was "${previousOrConcurrent}". Full string "${token}"`,
    );
  }

  return [subjectCode, courseNumber, previousOrConcurrent] as [
    string,
    string,
    'PREVIOUS' | 'CONCURRENT'
  ];
}

export function removeExtraFromDirective(token: string) {
  const result = replaceCourseDirective(token);
  if (!result) return token;

  const [subjectCode, courseNumber, previousOrConcurrent] = result;
  return `__${subjectCode}|${courseNumber}|${previousOrConcurrent}__`;
}

/**
 * Joins strings in an array tree based on whether or not they are operators (i.e. `and` or `or`).
 *
 * transforms:
 * ```
 * ['one', 'two', 'and', ['buckle', 'shoe', 'or', 'three', 'four']]
 * ```
 *
 * into:
 * ```
 * ['one two', 'and', ['buckle shoe', 'or', 'three four']]
 * ```
 */
export function groupByOperator(tree: ParseTree): ParseTree {
  const newTree = [] as ParseTree;
  let currentToken = '';
  for (const node of tree) {
    if (Array.isArray(node)) {
      newTree.push(groupByOperator(node));
    } else if (node.toLowerCase() === 'and' || node.toLowerCase() === 'or') {
      if (currentToken) {
        newTree.push(removeExtraFromDirective(currentToken.trim()));
      }
      newTree.push(node);
      currentToken = '';
    } else {
      currentToken += ' ' + node;
    }
  }
  if (currentToken) {
    newTree.push(removeExtraFromDirective(currentToken.trim()));
  }
  return newTree;
}

function isPrerequisite(obj: any): obj is Prerequisite {
  if (!obj) return false;
  if (typeof obj === 'string') return true;
  if (typeof obj !== 'object') return false;
  if (obj.and) return true;
  if (obj.or) return true;
  if (!Array.isArray(obj)) return false;
  if (obj.length !== 3) return false;
  const last = obj[obj.length - 1];
  if (last === 'CONCURRENT') return true;
  if (last === 'PREVIOUS') return true;
  return false;
}

/**
 * Recursively builds the `_Prerequisite` type given a `ParseTree` from the `tokenizeByOperator`
 * function.
 */
export function buildPrerequisiteTree(tokens: ParseTree | Prerequisite): Prerequisite | undefined {
  if (typeof tokens === 'string') {
    const result = replaceCourseDirective(tokens);
    if (!result) return tokens;
    return result;
  }
  if (isPrerequisite(tokens)) return tokens;

  const transformedTokens = tokens
    .map(token => {
      if (isPrerequisite(token)) return token;
      return buildPrerequisiteTree(token)!;
    })
    .filter(token => !!token);

  const rankedOperators = transformedTokens
    .map((token, index) => ({ token, index }))
    .filter(({ token }) => {
      if (token === 'and') return true;
      if (token === 'or') return true;
      return false;
    })
    .map(({ token, index }) => {
      const baseRank = token === 'and' ? 1000 : 0;
      const rank = baseRank - index;

      return {
        token,
        index,
        rank,
      };
    })
    .sort((a, b) => b.rank - a.rank);

  const bestOperator = rankedOperators[0];
  if (!bestOperator) return undefined;

  const operator = bestOperator.token as 'and' | 'or';
  const previous = transformedTokens[bestOperator.index - 1];
  const next = transformedTokens[bestOperator.index + 1];

  return { [operator]: [previous, next] } as Prerequisite;
}

/**
 * Used to parse both `prerequisites` and `corequisites`. Simply calls all the individual functions.
 */
export function parsePrerequisites(prerequisiteElement: Element) {
  const textContent = replacePrerequisiteAnchors(prerequisiteElement);
  const parseTree = transformParenthesesToTree(textContent);
  const tokens = groupByOperator(parseTree.tree);
  const result = buildPrerequisiteTree(tokens);
  // const result = replaceAllCourseDirectivesInTree(prefix);
  return result;
}
