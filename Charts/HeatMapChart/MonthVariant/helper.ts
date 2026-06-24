import {
  monthAbbrMap,
  monthIndexMap,
  monthMap,
  monthRegex,
  MonthKey,
} from './constants';
import {
  HeatMapMonthBins,
  HeatMapMonthChartData,
  ParsedDateRange,
  ParsedEntry,
} from './types';

/**
 * Extract a normalized month name (e.g. "Jan", "February") from free-form text.
 * Uses `monthRegex` to find the first month-like token, then maps via `monthMap`.
 * Returns empty string if nothing is detected.
 */
function extractMonthName(input: string): string {
  if (!input) return '';

  const match = monthRegex.exec(input.toLowerCase());

  if (!match?.[1]) return '';

  return monthMap[match?.[1] as MonthKey] || '';
}

// Utilities to normalize missing week ranges within each month

/**
 * Convert a month name (e.g. "Jan", "September", "sept") to a zero-based month index.
 * Returns null if the name cannot be resolved.
 */
function getMonthIndexFromName(name: string): number | null {
  if (!name) return null;

  const monthName = name.toLowerCase();
  const idx = monthIndexMap[monthName];

  return idx ?? null;
}

/**
 * Compute number of days in the given month of a given year.
 * Defaults to current year when `year` is omitted.
 */
function getDaysInMonthByIndex(monthIndex: number, year?: number): number {
  const y = year ?? new Date().getFullYear();
  const m = Math.min(Math.max(monthIndex, 0), 11);

  return new Date(y, m + 1, 0).getDate();
}

/**
 * Parse a week range label such as "1 Jan - 7 Jan" or "29 Dec - 4 Jan 2024".
 * Returns the start day, end day, end month index (bucket month), and resolved year.
 * Returns null on parse failure.
 */
function parseDateRangeLabel(label: string): ParsedDateRange | null {
  if (!label) return null;

  // e.g. "1 Jan - 7 Jan" or "29 Dec - 4 Jan 2024"
  const pattern =
    /(\d+)\s+([A-Za-z]+)(?:\s+(\d{4}))?\s*-\s*(\d+)\s+([A-Za-z]+)(?:\s+(\d{4}))?/;
  const match = pattern.exec(label);

  if (!match) return null;

  const startDay = Number.parseInt(match[1] || '', 10);
  const startMonthIdx = getMonthIndexFromName(match[2] || '');
  const startYear = match[3] ? Number.parseInt(match[3], 10) : undefined;
  const endDay = Number.parseInt(match[4] || '', 10);
  const endMonthIdx = getMonthIndexFromName(match[5] || '');
  const endYear = match[6] ? Number.parseInt(match[6], 10) : startYear;

  if (
    Number.isNaN(startDay) ||
    Number.isNaN(endDay) ||
    startMonthIdx === null ||
    endMonthIdx === null
  ) {
    return null;
  }

  return {
    startDay,
    endDay,
    startMonthIndex: startMonthIdx,
    endMonthIndex: endMonthIdx,
    startYear,
    endYear,
  };
}

/**
 * Build canonical week buckets for a month as day ranges:
 * 1-7, 8-14, 15-21, 22-28, and 29-lastDay when applicable.
 */
function buildExpectedWeekRanges(
  daysInMonth: number,
): Array<{ start: number; end: number }> {
  const ranges = [
    { start: 1, end: 7 },
    { start: 8, end: 14 },
    { start: 15, end: 21 },
    { start: 22, end: 28 },
  ];

  if (daysInMonth > 28) ranges.push({ start: 29, end: daysInMonth });

  return ranges;
}

/**
 * Normalize rows so each month has all expected week ranges.
 * Missing ranges are filled with placeholder rows (bins with count: -1 / Null).
 * Unparsed rows are preserved and appended to the end.
 */
function normalizeHeatMapMonthData(
  data: HeatMapMonthChartData[],
  enableSorting?: boolean,
): HeatMapMonthChartData[] {
  if (!Array.isArray(data) || data.length === 0) return data;

  const parsed: ParsedEntry[] = data.map((e) => ({
    entry: e,
    parsed: parseDateRangeLabel(e.label),
  }));

  // Group by end-month (the month that defines the week bucket)
  const { groups, unparsed } = parsed.reduce(
    (
      acc: {
        groups: Map<
          string,
          {
            monthIndex: number;
            year?: number;
            entries: HeatMapMonthChartData[];
          }
        >;
        unparsed: HeatMapMonthChartData[];
      },
      p: ParsedEntry,
    ) => {
      if (!p.parsed) {
        acc.unparsed.push(p.entry);
        return acc;
      }

      const key = `${p.parsed.endMonthIndex}_${p.parsed.endYear ?? 'na'}`;
      const existing = acc.groups.get(key);

      if (existing) {
        existing.entries.push(p.entry);
      } else {
        acc.groups.set(key, {
          monthIndex: p.parsed.endMonthIndex,
          year: p.parsed.endYear,
          entries: [p.entry],
        });
      }

      return acc;
    },
    { groups: new Map(), unparsed: [] as HeatMapMonthChartData[] },
  );

  // Sort groups chronologically: year, then month index
  const orderedGroups = Array.from(groups.values()).sort(
    (
      a: { monthIndex: number; year?: number },
      b: { monthIndex: number; year?: number },
    ) => {
      const ay = a.year ?? 0;
      const by = b.year ?? 0;

      if (ay !== by) return ay - by;

      return a.monthIndex - b.monthIndex;
    },
  );

  const normalized: HeatMapMonthChartData[] = [];

  const arrayOfGroupsValues = enableSorting
    ? orderedGroups
    : Array.from(groups.values());

  arrayOfGroupsValues.forEach(
    (g: {
      monthIndex: number;
      year?: number;
      entries: HeatMapMonthChartData[];
    }) => {
      // Use first entry's bins as schema reference for placeholder rows
      const refBins = g.entries[0]?.bins ?? [];
      const { year } = g;
      const days = getDaysInMonthByIndex(g.monthIndex, year);
      const expected = buildExpectedWeekRanges(days);

      // Map provided entries to canonical ranges they fully contain (same end-month).
      type Candidate = { entry: HeatMapMonthChartData; priority: number };
      const mapping: Array<Candidate | null> = Array.from(
        { length: expected.length },
        () => null,
      );

      g.entries.forEach((entry) => {
        const p = parseDateRangeLabel(entry.label);

        if (!p || p.endMonthIndex !== g.monthIndex) return;

        const sameMonth = p.startMonthIndex === p.endMonthIndex;

        expected.forEach((range, idx) => {
          const isLastBucket = range.end === days;

          // fully contains canonical range
          const contains =
            sameMonth && p.startDay <= range.start && p.endDay >= range.end;

          // accept last bucket partials only when anchored to start or end
          // (e.g., 29–30 or 25–31). Avoid mapping 28–30.
          const lastAnchored =
            sameMonth &&
            isLastBucket &&
            (p.startDay === range.start || p.endDay === range.end);

          // Accept mid-partials only if they anchor to bucket start OR end (avoid activating two buckets)
          const alignsByEnd =
            sameMonth &&
            !isLastBucket &&
            p.endDay === range.end &&
            p.startDay <= range.end;

          const alignsByStart =
            sameMonth &&
            !isLastBucket &&
            p.startDay === range.start &&
            p.endDay >= range.start;
          const anchoredOverlap = alignsByEnd || alignsByStart;

          if (!contains && !lastAnchored && !anchoredOverlap) return;

          // prefer exact > contains > lastAnchored > anchoredOverlap
          const isExact =
            sameMonth && p.startDay === range.start && p.endDay === range.end;

          let priority = 0;

          if (isExact) {
            priority = 3;
          } else if (contains) {
            priority = 2;
          } else if (lastAnchored) {
            priority = 1;
          } else {
            priority = 0;
          }

          const current = mapping[idx];

          if (!current || priority > current.priority) {
            mapping[idx] = { entry, priority };
          }
        });
      });

      expected.forEach((range, idx) => {
        const chosen = mapping[idx]?.entry ?? null;

        if (chosen) {
          normalized.push(chosen);
        } else {
          const abbr = monthAbbrMap[g.monthIndex] ?? '';
          const dummyBins: HeatMapMonthBins[] = refBins.map(
            (b: HeatMapMonthBins) => ({ count: -1, label: b.label }),
          );

          normalized.push({
            label: `${range.start} ${abbr} - ${range.end} ${abbr}`,
            bins: dummyBins,
          });
        }
      });
    },
  );

  // Append unparsed entries at the end to avoid data loss
  if (unparsed.length > 0) normalized.push(...unparsed);

  return normalized;
}

export { extractMonthName, normalizeHeatMapMonthData };
