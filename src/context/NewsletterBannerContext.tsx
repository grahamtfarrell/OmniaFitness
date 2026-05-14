"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "omnia_newsletter_dismissed";

/** Fixed `top` (px) for logo: below pink bar vs dismissed */
export const NEWSLETTER_LAYOUT = {
  logoTop: { withBanner: 56, withoutBanner: 12 },
  navTop: { withBanner: 72, withoutBanner: 28 },
} as const;

type NewsletterBannerContextValue = {
  /** Pink bar is shown (not dismissed). */
  bannerVisible: boolean;
  dismissBanner: () => void;
};

const NewsletterBannerContext = createContext<NewsletterBannerContextValue | null>(null);

export function NewsletterBannerProvider({ children }: { children: ReactNode }) {
  const [bannerVisible, setBannerVisible] = useState(true);

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY) === "1") {
        setBannerVisible(false);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const dismissBanner = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setBannerVisible(false);
  }, []);

  const value = useMemo(
    () => ({ bannerVisible, dismissBanner }),
    [bannerVisible, dismissBanner],
  );

  return (
    <NewsletterBannerContext.Provider value={value}>{children}</NewsletterBannerContext.Provider>
  );
}

export function useNewsletterBanner(): NewsletterBannerContextValue {
  const ctx = useContext(NewsletterBannerContext);
  if (!ctx) {
    return {
      bannerVisible: true,
      dismissBanner: () => {},
    };
  }
  return ctx;
}
