import { z } from "zod";

export const enquiryTypeOptions = [
  "Manual Training",
  "Automatic Training",
  "RTO Consultation",
] as const;
export const enquirySchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name.").max(100, "Name must be 100 characters or fewer."),
  mobileNumber: z.string().trim()
    .regex(/^(?:\+?91[\s-]?)?[6-9]\d{9}$/, "Enter a valid Indian mobile number, such as +91 9876543210.")
    .transform((value) => {
      const compact = value.replace(/[\s-]/g, "");
      if (compact.startsWith("+91")) return compact;
      if (compact.startsWith("91") && compact.length === 12) return `+${compact}`;
      return `+91${compact}`;
    }),
  enquiryType: z.enum(enquiryTypeOptions, { error: "Choose an enquiry type." }),
  contactMethod: z.literal("WhatsApp").default("WhatsApp"),
  message: z.string().trim().max(1000, "Message must be 1000 characters or fewer.").optional().transform((value) => value || undefined),
  consent: z.boolean().refine((value) => value, "Please consent to being contacted about this enquiry."),
  website: z.string().max(0, "Invalid submission.").optional(),
}).strict();

export type EnquiryFormValues = {
  fullName: string;
  mobileNumber: string;
  enquiryType: string;
  message: string;
  consent: boolean;
  website: string;
};

export type EnquiryPayload = z.output<typeof enquirySchema>;
