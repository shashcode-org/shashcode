/** 100-day LeetCode Daily Challenge campaign (YouTube membership CTA). */

export const LCD_START_DATE = "2026-09-15";
export const LCD_TOTAL_DAYS = 100;
export const LCD_JOIN_URL =
  "https://www.youtube.com/channel/UCegtbaD_t6PYm3eaAf_bvGQ/join";
export const LCD_STORAGE_KEY = "lcd_membership_cta_dismissed";
export const LCD_DISMISS_EVENT = "lcd-cta-dismissed";
/** Approximate sticky bar height for layout offset (px). */
export const LCD_STICKY_HEIGHT_PX = 44;

/** Today's calendar date in IST as YYYY-MM-DD. */
export function getTodayIST(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function parseISTDate(yyyyMmDd: string): number {
  return new Date(`${yyyyMmDd}T00:00:00+05:30`).getTime();
}

/** 1-based day number relative to LCD_START_DATE (IST). May be <1 or >TOTAL_DAYS. */
export function getChallengeDay(): number {
  const diffMs = parseISTDate(getTodayIST()) - parseISTDate(LCD_START_DATE);
  return Math.floor(diffMs / (24 * 60 * 60 * 1000)) + 1;
}

export function isChallengeActive(): boolean {
  const day = getChallengeDay();
  return day >= 1 && day <= LCD_TOTAL_DAYS;
}

export function isLeetCodeCtaDismissed(): boolean {
  try {
    return localStorage.getItem(LCD_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function dismissLeetCodeDailyCta(): void {
  try {
    localStorage.setItem(LCD_STORAGE_KEY, "true");
  } catch {
    // ignore quota / private mode
  }
  window.dispatchEvent(new Event(LCD_DISMISS_EVENT));
}

export function shouldShowLeetCodeCta(): boolean {
  return isChallengeActive() && !isLeetCodeCtaDismissed();
}
