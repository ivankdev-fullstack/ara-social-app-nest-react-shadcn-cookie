export const getTimeAgoShort = (isoDate: string): string => {
  const diff = Date.now() - new Date(isoDate).getTime();
  const sec = Math.floor(diff / 1000);
  const min = Math.floor(sec / 60);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);
  const week = Math.floor(day / 7);

  if (week > 0) return `${week}w`;
  if (day > 0) return `${day}d`;
  if (hr > 0) return `${hr}h`;
  if (min > 0) return `${min}m`;
  return '1m';
};
