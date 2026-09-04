import { formatDate } from '@angular/common';

export function formatYYYYMMDDDate(date: Date | null): string {
  if (date == null) {
    return "";
  }
  return formatDate(date, "yyyy-MM-dd", "en-us");
}
