"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "@/components/icon";
import { business, whatsappHref } from "@/lib/business";
import {
  enquirySchema,
  enquiryTypeOptions,
  type EnquiryFormValues,
  type EnquiryPayload,
} from "@/lib/enquiry-schema";

type FormStatus = "idle" | "error";
type FieldName = keyof EnquiryFormValues;

const initialValues: EnquiryFormValues = {
  fullName: "",
  mobileNumber: "",
  enquiryType: "",
  message: "",
  consent: false,
  website: "",
};

function createWhatsAppMessage(parsed: EnquiryPayload) {
  return [
    `Hello ${business.name}, I would like to make a driving lesson enquiry.`,
    `Full name: ${parsed.fullName}`,
    `Mobile number: ${parsed.mobileNumber}`,
    `Enquiry type: ${parsed.enquiryType}`,
    parsed.message ? `Message: ${parsed.message}` : "",
  ].filter(Boolean).join("\n");
}

export function EnquiryForm() {
  const [values, setValues] = useState<EnquiryFormValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  function updateField(field: FieldName, value: string | boolean) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (status === "error") {
      setStatus("idle");
      setStatusMessage("");
    }
  }

  function validateForm() {
    const result = enquirySchema.safeParse(values);
    if (result.success) {
      setErrors({});
      return result.data;
    }

    const nextErrors: Partial<Record<FieldName, string>> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && !nextErrors[field as FieldName]) {
        nextErrors[field as FieldName] = issue.message;
      }
    }
    setErrors(nextErrors);
    setStatus("error");
    setStatusMessage("Please correct the fields marked below before submitting.");
    return null;
  }

  function submitEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsed = validateForm();
    if (!parsed) return;

    window.location.assign(whatsappHref(createWhatsAppMessage(parsed)));
  }

  const fieldError = (field: FieldName) => errors[field]
    ? <span className="enquiry-field-error" id={`${field}-error`}>{errors[field]}</span>
    : null;
  const describedBy = (field: FieldName, hintId?: string) => [hintId, errors[field] ? `${field}-error` : undefined].filter(Boolean).join(" ") || undefined;

  return (
    <form className="enquiry-form" onSubmit={submitEnquiry} noValidate>
      <div className="enquiry-form-heading">
        <div>
          <p className="eyebrow eyebrow-on-dark"><span className="eyebrow-mark" /> DRIVING LESSON ENQUIRY</p>
          <h3>Tell us what you need.</h3>
        </div>
        <span className="enquiry-form-note">Fields marked * are required.</span>
      </div>

      <div className="enquiry-form-fields">
        <label className="enquiry-field" htmlFor="enquiry-full-name">
          <span>Full name <span aria-hidden="true">*</span></span>
          <input
            id="enquiry-full-name" name="fullName" type="text" autoComplete="name" maxLength={100}
            value={values.fullName} onChange={(event) => updateField("fullName", event.target.value)}
            aria-required="true" aria-invalid={Boolean(errors.fullName)} aria-describedby={describedBy("fullName")}
          />
          {fieldError("fullName")}
        </label>

        <label className="enquiry-field" htmlFor="enquiry-mobile">
          <span>Indian mobile number <span aria-hidden="true">*</span></span>
          <input
            id="enquiry-mobile" name="mobileNumber" type="tel" autoComplete="tel" inputMode="tel"
            maxLength={16}
            value={values.mobileNumber} onChange={(event) => updateField("mobileNumber", event.target.value)}
            aria-required="true" aria-invalid={Boolean(errors.mobileNumber)} aria-describedby={describedBy("mobileNumber", "mobile-hint")}
          />
          <span className="enquiry-field-hint" id="mobile-hint">Enter a 10-digit Indian mobile number, with or without +91.</span>
          {fieldError("mobileNumber")}
        </label>

        <label className="enquiry-field enquiry-type-field" htmlFor="enquiry-type">
          <span>Enquiry type <span aria-hidden="true">*</span></span>
          <select id="enquiry-type" name="enquiryType" value={values.enquiryType} onChange={(event) => updateField("enquiryType", event.target.value)} aria-required="true" aria-invalid={Boolean(errors.enquiryType)} aria-describedby={describedBy("enquiryType")}>
            <option value="">Choose an enquiry type</option>
            {enquiryTypeOptions.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          {fieldError("enquiryType")}
        </label>

        <label className="enquiry-field enquiry-details-field" htmlFor="enquiry-message">
          <span>Optional message <span className="optional-label">Optional</span></span>
          <textarea id="enquiry-message" name="message" rows={3} maxLength={1000} value={values.message} onChange={(event) => updateField("message", event.target.value)} aria-invalid={Boolean(errors.message)} aria-describedby={describedBy("message", "message-hint")} placeholder="Share any details that may help with your enquiry" />
          <span className="enquiry-field-hint" id="message-hint">Up to 1000 characters.</span>
          {fieldError("message")}
        </label>
      </div>

      <label className="enquiry-consent" htmlFor="enquiry-consent">
        <input id="enquiry-consent" name="consent" type="checkbox" checked={values.consent} onChange={(event) => updateField("consent", event.target.checked)} aria-required="true" aria-invalid={Boolean(errors.consent)} aria-describedby={describedBy("consent")} />
        <span>I agree that Sai Durga Motor Driving School may contact me about this enquiry. <span aria-hidden="true">*</span>
          {fieldError("consent")}
        </span>
      </label>

      <div className="enquiry-honeypot" aria-hidden="true">
        <label htmlFor="enquiry-website">Website</label>
        <input id="enquiry-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={(event) => updateField("website", event.target.value)} />
      </div>

      {statusMessage && (
        <p className={`enquiry-status enquiry-status-${status}`} role={status === "error" ? "alert" : "status"} aria-live={status === "error" ? "assertive" : "polite"}>
          {statusMessage}
        </p>
      )}
      <button className="action-button enquiry-submit" type="submit">
        Submit Enquiry on WhatsApp <Icon name="ArrowUpRight" size={17} />
      </button>
      <p className="enquiry-send-note">WhatsApp opens with your message. Press Send in WhatsApp to deliver your enquiry.</p>
    </form>
  );
}
