export const CONTACT_INTEREST_OPTIONS = [
  "Are you interested in Membership?",
  "Wanna get jacked? Explore personal training",
  "Nutrition Coaching",
  "General Questions",
] as const;

export type ContactInterest = (typeof CONTACT_INTEREST_OPTIONS)[number];

export function isValidContactInterest(v: string): v is ContactInterest {
  return (CONTACT_INTEREST_OPTIONS as readonly string[]).includes(v);
}
