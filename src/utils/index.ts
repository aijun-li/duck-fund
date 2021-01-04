// judge if the current time 'HH:mm:ss' is in a specified period
export function isNowInTimePeriod(start: string, end: string): boolean {
  const now = new Date()
  const hours = now
    .getHours()
    .toString()
    .padStart(2, '0')
  const minutes = now
    .getMinutes()
    .toString()
    .padStart(2, '0')
  const seconds = now
    .getSeconds()
    .toString()
    .padStart(2, '0')
  const s = `${hours}:${minutes}:${seconds}`
  return s >= start && s <= end
}

// judge if today is weekday
export function isWeekday() {
  const day = new Date().getDay()
  return day !== 0 && day !== 6
}
