import { JSDOM } from 'jsdom';
import { formDecode } from 'utilities/form-encode-decode';
import { regularToCamelCase } from 'utilities/regular-to-camel-case';
import { range } from 'lodash';
import { decode } from 'he';

export function parseCapacityAndRemaining(seatsTbody: HTMLTableSectionElement) {
  const empty = { capacity: NaN, remaining: NaN };
  const rows = Array.from(seatsTbody.children).filter(
    elem => elem.tagName.toLowerCase().trim() === 'tr',
  );

  const headerRow = rows[0];

  if (!headerRow) {
    return empty;
  }

  const headings = Array.from(headerRow.children)
    .slice(1)
    .map(cell => cell.textContent || '')
    .map(text => regularToCamelCase(text));

  const result = rows.slice(1).reduce(
    (obj, row) => {
      const cells = Array.from(row.children);
      const firstCell = cells[0];
      if (!firstCell) {
        return obj;
      } // continue

      const key = regularToCamelCase(firstCell.textContent || '').toLowerCase();
      const values = cells
        .slice(1)
        .map(cell => cell.textContent || '')
        .map(text => parseInt(text.trim()));

      const value = range(values.length)
        .map(i => ({ key: headings[i], value: values[i] }))
        .reduce(
          (obj, { key, value }) => {
            obj[key] = value;
            return obj;
          },
          {} as { [key: string]: number },
        );

      obj[key] = value;

      return obj;
    },
    {} as { [seatType: string]: { [heading: string]: number } },
  );

  if (result.crosslistseats) {
    const capacity = result.crosslistseats && result.crosslistseats.capacity;
    const remaining = result.crosslistseats && result.crosslistseats.remaining;
    return { capacity, remaining };
  } else if (result.seats) {
    const capacity = result.seats && result.seats.capacity;
    const remaining = result.seats && result.seats.remaining;
    return { capacity, remaining };
  }

  return empty;
}

export function parseCrossListedCourses(infoCell: Element) {
  const innerHtml = infoCell.innerHTML;
  const matchWithPrerequisites = /cross\s*list\s*courses([\s\S]*)(?:prerequisites)/i.exec(
    innerHtml,
  );
  const matchWithoutPrerequisites = /cross\s*list\s*courses([\s\S]*)/i.exec(infoCell.innerHTML);
  const match = matchWithPrerequisites || matchWithoutPrerequisites;
  if (!match) {
    return [];
  }

  try {
    const document = new JSDOM(match[1]).window.document;
    const anchors = Array.from(document.querySelectorAll('a'));

    const crossListedCourses = anchors
      .map(anchor => anchor.href)
      .filter(x => !!x)
      .map(href => {
        const match = /\?(.*)/.exec(href);
        if (!match) {
          return undefined;
        }
        const decoded = formDecode(decode(match[1]));
        return [
          decoded.one_subj.trim().toUpperCase(),
          decoded.sel_crse_strt.trim().toUpperCase(),
        ] as [string, string];
      })
      .filter(x => x && x.length == 2)
      .map(x => x!);

    return crossListedCourses;
  } catch (e) {
    console.warn('Error in parsing cross listed courses.', e);
    return [];
  }
}

/**
 * captures the `capacity` and `remaining` of a section detail HTML
 */
export function parseScheduleDetail(html: string, logger?: (message: string) => void) {
  const log = logger || console.warn.bind(console);
  try {
    const document = new JSDOM(html).window.document;

    const seatsTbody = (document.querySelector('.datadisplaytable tbody .datadisplaytable tbody') ||
      document.createElement('tbody')) as HTMLTableSectionElement;

    const infoCell =
      document.querySelector('.datadisplaytable tbody .dddefault') || document.createElement('td');

    const capAndRem = parseCapacityAndRemaining(seatsTbody);
    const crossList = parseCrossListedCourses(infoCell);

    return {
      ...capAndRem,
      crossList,
    };
  } catch (e) {
    log(`Failed to parse a schedule detail: ${e && e.message}`);
    return undefined;
  }
}
