export type MonthKey =
  | 'jan'
  | 'january'
  | 'feb'
  | 'february'
  | 'mar'
  | 'march'
  | 'apr'
  | 'april'
  | 'may'
  | 'jun'
  | 'june'
  | 'jul'
  | 'july'
  | 'aug'
  | 'august'
  | 'sep'
  | 'september'
  | 'oct'
  | 'october'
  | 'nov'
  | 'november'
  | 'dec'
  | 'december';

const monthMap: Record<MonthKey, string> = {
  jan: 'January',
  january: 'January',
  feb: 'February',
  february: 'February',
  mar: 'March',
  march: 'March',
  apr: 'April',
  april: 'April',
  may: 'May',
  jun: 'June',
  june: 'June',
  jul: 'July',
  july: 'July',
  aug: 'August',
  august: 'August',
  sep: 'September',
  september: 'September',
  oct: 'October',
  october: 'October',
  nov: 'November',
  november: 'November',
  dec: 'December',
  december: 'December',
};

const monthIndexMap: Record<string, number> = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

const monthAbbrMap: string[] = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const monthRegex = new RegExp(
  `\\b(${Object.keys(monthMap).join('|')})\\b`,
  'i',
);

export { monthMap, monthRegex, monthIndexMap, monthAbbrMap };
