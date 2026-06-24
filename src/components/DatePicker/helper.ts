import dayjs from 'dayjs';

// eslint-disable-next-line import/prefer-default-export
const generateTime = (): string[] => {
  const timeOptions: string[] = [];
  for (let hour: number = 0; hour < 24; hour += 1) {
    if (hour < 10) {
      timeOptions.push(`0${hour}:00`);
      timeOptions.push(`0${hour}:30`);
    } else {
      timeOptions.push(`${hour}:00`);
      timeOptions.push(`${hour}:30`);
    }
  }
  return timeOptions;
};

const generateCustomTimeList = (gapInMinutes: number): string[] => {
  const timeOptions: string[] = [];

  for (
    let totalMinutes = 0;
    totalMinutes < 24 * 60;
    totalMinutes += gapInMinutes
  ) {
    const hour = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;

    const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
    const formattedMinute = minute < 10 ? `0${minute}` : `${minute}`;

    timeOptions.push(`${formattedHour}:${formattedMinute}`);
  }

  return timeOptions;
};

const getLatestValidTimeFromOptions = () => {
  const now = dayjs();
  const timeOptions = generateTime();

  const validTimes = timeOptions.filter((time) => {
    const timeAsDayjs = dayjs(time, 'HH:mm');
    return timeAsDayjs.isBefore(now) || timeAsDayjs.isSame(now);
  });

  return validTimes.length > 0 ? (validTimes.at(-1) ?? '') : '';
};

export { getLatestValidTimeFromOptions, generateTime, generateCustomTimeList };
