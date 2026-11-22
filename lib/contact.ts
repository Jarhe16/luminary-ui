// Inquiry types offered on the contact form (shared by the form and /api/contact).
export const INQUIRY_TYPES = [
  'General Inquiry',
  'Institutional / Bank Inquiry',
  'Pricing Question',
  'Partnership',
  'Customer Support',
] as const;

export type InquiryType = (typeof INQUIRY_TYPES)[number];
