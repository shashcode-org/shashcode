import { useCallback, useEffect, useState } from "react";
import {
  dismissLeetCodeDailyCta,
  getChallengeDay,
  LCD_DISMISS_EVENT,
  LCD_JOIN_URL,
  LCD_TOTAL_DAYS,
  shouldShowLeetCodeCta,
} from "@/config/leetcodeDailyChallenge";

export function useLeetCodeDailyCta() {
  const [visible, setVisible] = useState(false);
  const [day, setDay] = useState(1);

  useEffect(() => {
    setDay(getChallengeDay());
    setVisible(shouldShowLeetCodeCta());

    const sync = () => setVisible(shouldShowLeetCodeCta());
    window.addEventListener(LCD_DISMISS_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(LCD_DISMISS_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const dismiss = useCallback(() => {
    dismissLeetCodeDailyCta();
    setVisible(false);
  }, []);

  return {
    visible,
    day,
    totalDays: LCD_TOTAL_DAYS,
    joinUrl: LCD_JOIN_URL,
    dismiss,
  };
}
