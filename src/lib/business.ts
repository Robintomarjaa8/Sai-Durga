export const business = {
  name: "Sai Durga Motor Driving School",
  slogan: "Learn Safe and Confident Driving for a Better Tomorrow",
  tagline: "Learn Today. Drive Tomorrow.",
  branches: [
    { name: "Kondapur", location: "Kondapur, Hyderabad, Telangana" },
    { name: "Gowlidoddi", location: "Gowlidoddi, Hyderabad, Telangana" },
  ],
  gowlidoddiAddress:
    "Opposite Shivalayam Temple, Gowlidoddi, Gachibowli, Hyderabad, Telangana 500032, India",
  gowlidoddiMapsLink: "https://maps.app.goo.gl/bcHRRYb7c19g4G7H7?g_st=iw",
  services: [
    "Manual Car Training",
    "Automatic Car Training",
    "All RTO Work and Consultation",
    "Pick-up & Drop Service",
  ],
  phones: ["+91 9666146913", "+91 9000574542", "+91 9676617132"],
} as const;

// Override with the registered WhatsApp number, digits only, in .env.local.
export const whatsappNumber = (
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919666146913"
).replace(/\D/g, "");

export function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^+\d]/g, "")}`;
}

export function whatsappHref(message: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
