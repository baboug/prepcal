import { format } from "date-fns";

export function formatDate(dateString: string): string {
  return format(new Date(dateString), "yyyy-MM-dd");
}

export function getDuration(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

export function getDayOptions(startDate: string, endDate: string) {
  if (!(startDate && endDate)) {
    return [{ value: 1, label: "Day 1", date: "" }];
  }

  const start = new Date(startDate);
  const totalDays = getDuration(startDate, endDate);

  return Array.from({ length: totalDays }, (_, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    return {
      value: i + 1,
      label: `Day ${i + 1}`,
      date: date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
    };
  });
}

export function getTomorrowISO(): string {
  return new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
}

export function getDaysFromNowISO(days: number): string {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}
