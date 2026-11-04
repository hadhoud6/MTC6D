import { siteConfig } from "@/data/siteConfig";

/**
 * Email delivery addresses, with test overrides.
 *
 * Production (no overrides): owner mail goes to the address in
 * siteConfig, sent from that same domain address.
 *
 * Test mode (no verified domain yet): set these two env vars on the host:
 *   FORM_OWNER_EMAIL=<the Resend account owner's own email>
 *   RESEND_FROM_EMAIL=onboarding@resend.dev
 * Resend's test sender can only deliver to the account owner's email,
 * so both the owner copy and the confirmation must go to that address
 * in test mode. The server actions handle that by sending the
 * confirmation only when it can actually be delivered; see the
 * actions for the exact fallback. Remove the overrides (or point
 * FORM_OWNER_EMAIL at the client mailbox) once the client domain is
 * verified in Resend and DNS (SPF/DKIM/DMARC) is live.
 */
export function getOwnerEmail(): string {
  return process.env.FORM_OWNER_EMAIL?.trim() || siteConfig.email;
}

export function getFromAddress(): string {
  const override = process.env.RESEND_FROM_EMAIL?.trim();
  if (override) return override;
  return `${siteConfig.name} <${siteConfig.email}>`;
}

/** True when the test sender is in use: confirmations to arbitrary
 *  customer addresses will be rejected by Resend. */
export function isTestSender(): boolean {
  return getFromAddress().includes("resend.dev");
}
