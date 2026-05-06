const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const SLASH_DATE_PATTERN = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;

function createUtcDateString(year: number, month: number, day: number): string {
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new Error("Date last seen is invalid.");
  }

  return date.toISOString();
}

export function toAnnouncementDateTimeOffset(dateText: string): string {
  const trimmedDateText = dateText.trim();

  if (ISO_DATE_PATTERN.test(trimmedDateText)) {
    return `${trimmedDateText}T00:00:00.000Z`;
  }

  const slashDateMatch = SLASH_DATE_PATTERN.exec(trimmedDateText);
  if (slashDateMatch !== null) {
    const day = Number(slashDateMatch[1]);
    const month = Number(slashDateMatch[2]);
    const year = Number(slashDateMatch[3]);
    return createUtcDateString(year, month, day);
  }

  const parsedDate = new Date(trimmedDateText);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error("Date last seen must be a valid date.");
  }

  return parsedDate.toISOString();
}
