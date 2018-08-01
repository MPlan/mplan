import { JSDOM } from 'jsdom';
import { isEqual } from 'lodash';
import { formDecode } from 'utilities/form-encode-decode';
import { regularToCamelCase } from 'utilities/regular-to-camel-case';

interface SectionTableParseResult {
  instructors: string[];
  times: string[];
  days: string[];
  locations: string[];
}

export function parseScheduleListing(html: string, logger?: (message: string) => void) {
  const log = logger || console.warn.bind(console);
  const document = new JSDOM(html).window.document;

  const dataDisplayTable = document.querySelector('.pagebodydiv > .datadisplaytable');
  if (!dataDisplayTable) {
    return [];
  }

  const tableBody = dataDisplayTable.querySelector('tbody');
  if (!tableBody) {
    return [];
  }

  const tableRows = Array.from(tableBody.children).filter(
    child => child.tagName === 'TR',
  ) as HTMLTableRowElement[];

  const sectionGroups = tableRows.reduce(
    (arr, headerOrBody, index) => {
      const arrIndex = Math.floor(index / 2);
      arr[arrIndex] = arr[arrIndex] || {};
      if (index % 2 === 0) {
        arr[arrIndex].header = headerOrBody;
      } else {
        arr[arrIndex].body = headerOrBody;
      }
      return arr;
    },
    [] as Array<{ header: HTMLTableRowElement; body: HTMLTableRowElement }>,
  );

  const result = sectionGroups
    .map(group => {
      const anchorWithCrn = group.header.querySelector('a');
      const crn = (anchorWithCrn && formDecode(anchorWithCrn.href || '').crn_in) || '';
      try {
        const section = parseSectionElement(group.body);
        return { crn, section };
      } catch (e) {
        log(`Could not parse scheduling list with CRN ${crn}: ${e && e.message}`);
        return { crn, section: (undefined as any) as SectionTableParseResult };
      }
    })
    .filter(({ crn, section }) => {
      if (!crn) return false;
      if (!section) return false;
      return true;
    })
    .map(({ crn, section }) => ({
      courseRegistrationNumber: crn,
      ...section,
    }));

  return result;
}

function findUniqueName(element: Element) {
  const anchor = element.querySelector('a');
  if (!anchor) {
    return undefined;
  }
  const href = anchor.href;
  if (!href) {
    return undefined;
  }
  const match = /mailto:(.*)@umich\.edu/i.exec(href);
  if (!match) {
    return undefined;
  }
  return match[1].trim().toLowerCase();
}

const emptySectionResult: SectionTableParseResult = {
  days: [],
  instructors: [],
  locations: [],
  times: [],
};

function parseSectionElement(body: HTMLTableRowElement | undefined | null) {
  if (!body) {
    return emptySectionResult;
  }

  const sectionTBody = body.querySelector('.datadisplaytable > tbody');
  if (!sectionTBody) {
    return emptySectionResult;
  }

  const rows = Array.from(sectionTBody.children).filter(
    child => child.tagName.toLowerCase().trim() === 'tr',
  ) as HTMLTableRowElement[];

  const headerRow = rows[0];
  if (!headerRow) {
    return emptySectionResult;
  }

  const headers = Array.from(headerRow.children)
    .filter(child => child.classList.contains('ddheader'))
    .map(child => child.textContent || '')
    .map(text => regularToCamelCase(text));

  const result = rows.slice(1).reduce(
    (obj, nextRow) => {
      const cells = Array.from(nextRow.querySelectorAll('.dddefault'))
        .map(cell => findUniqueName(cell) || cell.textContent || '')
        .map(text => text.trim());

      for (let i = 0; i < cells.length; i += 1) {
        const next = cells[i];
        const current = obj[headers[i]] || [];
        if (isEqual([next], current)) {
          continue;
        }
        const arr = current;
        obj[headers[i]] = [...arr, next];
      }

      return obj;
    },
    {} as { [key: string]: undefined | string[] },
  );

  const section: SectionTableParseResult = {
    instructors: result.instructors || [],
    times: result.time || [],
    days: result.days || [],
    locations: result.where || [],
  };

  return section;
}
