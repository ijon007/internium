const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * en-GB date formatter whose short months are always 3 letters ("Sep", never "Sept").
 * Drop-in for `new Intl.DateTimeFormat("en-GB", options)`.
 */
export function dateFormat(options: Intl.DateTimeFormatOptions) {
  const fmt = new Intl.DateTimeFormat("en-GB", options);
  return {
    format(date: Date | number) {
      const d = new Date(date);
      return fmt
        .formatToParts(d)
        .map((p) => (p.type === "month" && options.month === "short" ? (MONTHS[d.getMonth()] as string) : p.value))
        .join("");
    },
  };
}
