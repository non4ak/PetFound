const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const SLASH_DATE_PATTERN = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
const DOT_DATE_PATTERN = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/;

export function formatCurrentAnnouncementDate(): string {
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const year = String(currentDate.getFullYear());

  return `${day}.${month}.${year}`;
}

export function isValidAnnouncementDate(dateText: string): boolean {
  try {
    toAnnouncementDateTimeOffset(dateText);
    return true;
***REMOVED*** catch {
    return false;
***REMOVED***
}

function createUtcDateString(year: number, month: number, day: number): string {
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new Error("Date last seen is invalid.");
***REMOVED***

  return date.toISOString();
}

export function toAnnouncementDateTimeOffset(dateText: string): string {
  const trimmedDateText = dateText.trim();

  if (ISO_DATE_PATTERN.test(trimmedDateText)) {
    return `${trimmedDateText}T00:00:00.000Z`;
***REMOVED***

  const slashDateMatch = SLASH_DATE_PATTERN.exec(trimmedDateText);
  if (slashDateMatch !== null) {
    const day = Number(slashDateMatch[1]);
    const month = Number(slashDateMatch[2]);
    const year = Number(slashDateMatch[3]);
    return createUtcDateString(year, month, day);
***REMOVED***

  const dotDateMatch = DOT_DATE_PATTERN.exec(trimmedDateText);
  if (dotDateMatch !== null) {
    const day = Number(dotDateMatch[1]);
    const month = Number(dotDateMatch[2]);
    const year = Number(dotDateMatch[3]);
    return createUtcDateString(year, month, day);
***REMOVED***

  const parsedDate = new Date(trimmedDateText);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error("Date last seen must be a valid date.");
***REMOVED***

  return parsedDate.toISOString();
}
