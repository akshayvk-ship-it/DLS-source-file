/**
 * Helper functions for HeatMapBar (Week Variant)
 * Normalizes day-wise heat map data to ensure complete weeks
 */
interface Bins {
  count: number;
  label: string;
  tooltipElement?: JSX.Element;
}

interface HeatMapChartData {
  label: string;
  bins: Bins[];
}

/**
 * Parse a date label like "1 Jun", "15 Jan", "29 Dec"
 * Returns a Date object or null
 */
function parseDateLabel(label: string): Date | null {
  const match = /^(\d+)\s+([A-Za-z]+)(?:\s+(\d{4}))?$/.exec(label.trim());
  if (!match) return null;

  const day = Number.parseInt(match[1]!, 10);
  const month = match[2];
  const year = match[3]
    ? Number.parseInt(match[3], 10)
    : new Date().getFullYear();

  const dateStr = `${day} ${month} ${year}`;
  const date = new Date(dateStr);

  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Format a Date object as "D MMM" (e.g., "1 Jun", "15 Jan")
 */
function formatDateLabel(date: Date): string {
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' });
  return `${day} ${month}`;
}

/**
 * Normalize HeatMapBar data to ensure complete weeks
 *
 * Adds empty days to incomplete weeks with count: -1
 */
function normalizeHeatMapBarData(data: HeatMapChartData[]): HeatMapChartData[] {
  if (!data?.length) return data;

  const WEEK_DAYS = 7;

  // Parse and filter valid dates
  const entries = data
    .map((entry) => ({ entry, date: parseDateLabel(entry.label) }))
    .filter(
      (item): item is { entry: HeatMapChartData; date: Date } =>
        item.date !== null,
    );

  if (entries.length === 0) return data;

  // Check if we need to add days
  const remainder = entries.length % WEEK_DAYS;
  if (remainder === 0) return data;

  // Create template for null bins
  const nullBins: Bins[] =
    data[0]?.bins.map((bin) => ({
      count: -1,
      label: bin.label,
      tooltipElement: undefined,
    })) ?? [];

  // Add missing days
  const lastEntry = entries[entries.length - 1];
  if (!lastEntry) return data;

  const lastDate = lastEntry.date;
  const missingDays = WEEK_DAYS - remainder;
  const missingEntries: HeatMapChartData[] = [];

  for (let i = 1; i <= missingDays; i += 1) {
    const newDate = new Date(lastDate);
    newDate.setDate(lastDate.getDate() + i);

    missingEntries.push({
      label: formatDateLabel(newDate),
      bins: nullBins,
    });
  }

  return [...data, ...missingEntries];
}

let canvas: HTMLCanvasElement | null = null;
let context: CanvasRenderingContext2D | null = null;

function measureTextWidth(text: string, className: string): number {
  if (typeof document === 'undefined') return 0; // SSR fallback
  if (!text) return 0;

  // Lazy initialize canvas once globally
  if (!canvas) canvas = document.createElement('canvas');
  if (!context) context = canvas.getContext('2d');

  if (!context) return 0;

  const span = document.createElement('span');
  span.className = className;
  span.style.visibility = 'hidden';
  span.style.position = 'absolute';
  span.style.whiteSpace = 'nowrap';
  span.textContent = text;

  document.body.appendChild(span);

  const computed = window.getComputedStyle(span);
  context.font = `${computed.fontWeight} ${computed.fontSize} ${computed.fontFamily}`;

  const { width } = context.measureText(text);

  document.body.removeChild(span);

  return width;
}

function getFullMonthNameFromString(
  inputString: string | null | undefined,
): string {
  type MonthKey =
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

  // Handle null/undefined input
  if (!inputString) return '';

  const normalizedInput = inputString.toLowerCase().trim();
  const monthKeys = Object.keys(monthMap) as MonthKey[];
  const monthRegex = new RegExp(`\\b(${monthKeys.join('|')})\\b`, 'i');

  const match = normalizedInput.match(monthRegex);
  if (!match || !match[1]) return inputString;

  return inputString.replace(
    monthRegex,
    (substring: string) => monthMap[substring.toLowerCase() as MonthKey] || '',
  );
}

export {
  measureTextWidth,
  normalizeHeatMapBarData,
  getFullMonthNameFromString,
};
