export const generateHours = (is24Hour = false): string[] =>
  is24Hour
    ? Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
    : Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

export const generateMinutes = (): string[] => {
  const minutes: string[] = [];
  for (let minute = 0; minute < 60; minute += 1) {
    minutes.push(String(minute).padStart(2, '0'));
  }
  return minutes;
};

export const generatePeriods = (): string[] => ['AM', 'PM'];

export const autoCompleteAMPM = (value: string): string =>
  value.replace(
    /\s*([ap])m?$/i,
    (_, p1) => ` ${(p1 as string).toUpperCase()}M`,
  );

export const timeRegex12 = /^(0?[1-9]|1[0-2]):[0-5]\d\s*(AM|PM)$/i;
export const timeRegex24 = /^([01]\d|2[0-3]):[0-5]\d$/;

export const generateCustomMinutesList = (gapInMinutes: number): string[] => {
  const timeOptions: string[] = [];
  const safeGap = gapInMinutes > 0 ? gapInMinutes : 1;

  for (let minute = 0; minute < 60; minute += safeGap) {
    const formattedMinute = minute < 10 ? `0${minute}` : String(minute);
    timeOptions.push(formattedMinute);
  }

  return timeOptions;
};
