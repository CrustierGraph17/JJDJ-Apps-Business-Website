"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { icons } from "@/lib/icons";
import { copyToClipboard } from "@/lib/utils";

/**
 * The contact address, as the primary thing on the page.
 *
 * It is a real `mailto:` link first — clicking the address itself opens a
 * draft — and the copy button is the fallback for anyone reading on a device
 * with no mail client. The address wraps rather than overflowing, because a
 * long login-style address is easy to break on a narrow phone.
 */
export function EmailPanel({
  email,
  locationLine,
}: {
  email: string;
  locationLine: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const ok = await copyToClipboard(email);
    if (!ok) {
      toast.error("Couldn't copy", { description: email });
      return;
    }
    setCopied(true);
    toast.success("Email copied", { description: email });
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <article className="surface-card flex h-full flex-col p-7 sm:p-9">
      <p className="flex items-center gap-2 font-mono text-[0.625rem] tracking-[0.12em] text-subtle-foreground uppercase">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
        Email
      </p>

      <a
        href={`mailto:${email}`}
        className="mt-5 block font-display text-[clamp(1.25rem,3.4vw,1.875rem)] leading-tight font-black tracking-[-0.03em] break-words text-foreground link-underline"
      >
        {email}
      </a>

      <p className="mt-4 max-w-[46ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
        Mail goes straight to Joash and Darryl. No ticket number, no queue —
        tell us what you were trying to do and we will read it.
      </p>

      <div className="mt-7 flex flex-wrap items-center gap-2.5">
        <Button asChild>
          <a href={`mailto:${email}`}>
            <icons.mail />
            Email us
          </a>
        </Button>
        <Button variant="secondary" onClick={copy} aria-live="polite">
          <icons.copy />
          {copied ? "Copied" : "Copy address"}
        </Button>
      </div>

      <p className="mt-auto flex items-center gap-2 pt-8 font-mono text-[0.6875rem] tracking-[0.06em] text-subtle-foreground uppercase">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
        {locationLine}
      </p>
    </article>
  );
}
