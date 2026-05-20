"use client";

type FormConsentCheckboxProps = {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  /** Include SMS language when the form collects a phone number. */
  includeSms?: boolean;
  /** Shorter legal copy for dense modals. */
  compact?: boolean;
};

const PRIVACY_URL = "/policies/privacy-policy";
const TERMS_URL = "/policies/terms-of-service";

export default function FormConsentCheckbox({
  id,
  checked,
  onChange,
  disabled = false,
  includeSms = false,
  compact = false,
}: FormConsentCheckboxProps) {
  if (compact) {
    return (
      <div className="pt-0.5">
        <label htmlFor={id} className="flex cursor-pointer items-start gap-2">
          <input
            id={id}
            name={id}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            required
            disabled={disabled}
            className="mt-0.5 h-3.5 w-3.5 shrink-0 cursor-pointer rounded border-black text-black focus:ring-black focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <span className="font-mono text-[0.625rem] leading-[1.35] text-black/65">
            By checking this box, you consent to receive informational and
            marketing {includeSms ? "emails and texts" : "emails"} from Omnia
            Fitness (autodialer may be used). Not required to purchase. Msg/data
            rates may apply.{" "}
            {includeSms ? "Reply STOP or " : ""}
            unsubscribe anytime.{" "}
            <a
              href={PRIVACY_URL}
              className="text-black underline underline-offset-1 hover:opacity-70"
            >
              Privacy
            </a>
            {" · "}
            <a
              href={TERMS_URL}
              className="text-black underline underline-offset-1 hover:opacity-70"
            >
              Terms
            </a>
            .
          </span>
        </label>
      </div>
    );
  }

  const channel = includeSms
    ? "informational (e.g., class updates) and/or marketing emails and texts (e.g., reminders and promotions)"
    : "informational (e.g., class updates) and/or marketing emails (e.g., reminders and promotions)";

  const unsubscribe = includeSms
    ? "Unsubscribe at any time by replying STOP to texts or clicking the unsubscribe link (where available)."
    : "Unsubscribe at any time by clicking the unsubscribe link (where available).";

  return (
    <div className="pt-1">
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
        <input
          id={id}
          name={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          required
          disabled={disabled}
          className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-black text-black focus:ring-black focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <span className="font-mono text-[0.6875rem] leading-snug text-black/70 md:text-xs">
          By checking this box, you consent to receive {channel} from Omnia
          Fitness, including messages sent by autodialer. Consent is not a
          condition of purchase. Msg &amp; data rates may apply. Msg frequency
          varies. {unsubscribe}{" "}
          <a
            href={PRIVACY_URL}
            className="text-black underline underline-offset-2 hover:opacity-70"
          >
            Privacy Policy
          </a>
          {" & "}
          <a
            href={TERMS_URL}
            className="text-black underline underline-offset-2 hover:opacity-70"
          >
            Terms
          </a>
          .
        </span>
      </label>
    </div>
  );
}
