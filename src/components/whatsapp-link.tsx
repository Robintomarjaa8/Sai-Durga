import type { PropsWithChildren } from "react";
import { whatsappHref } from "@/lib/business";

type WhatsAppLinkProps = PropsWithChildren<{
  className?: string;
  message: string;
  label: string;
}>;

export function WhatsAppLink({ className, message, label, children }: WhatsAppLinkProps) {
  return (
    <a
      className={className}
      href={whatsappHref(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
    >
      {children}
    </a>
  );
}
