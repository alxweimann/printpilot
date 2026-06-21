export type DocumentBrandingMode = "company" | "placeholder" | "printpilot-fallback";

export type DocumentCompanySettings = {
  companyName: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  taxNumber: string;
  vatId: string;
  bankName: string;
  iban: string;
  bic: string;
};

export type DocumentDefaults = {
  paymentTerms: string;
  offerValidity: string;
  currency: "EUR";
  taxRatePercent: number;
  footerNote: string;
};

export type DocumentBrandingSettings = {
  mode: DocumentBrandingMode;
  logoLabel: string;
  logoHint: string;
};

export type DocumentSettings = {
  company: DocumentCompanySettings;
  defaults: DocumentDefaults;
  branding: DocumentBrandingSettings;
};

export const demoDocumentSettings: DocumentSettings = {
  company: {
    companyName: "PrintPilot Demo-Druckerei",
    address: "Musterstraße 12 · 69151 Neckargemünd",
    phone: "06222 / 123456",
    email: "angebot@printpilot-demo.de",
    website: "www.printpilot-demo.de",
    taxNumber: "",
    vatId: "",
    bankName: "",
    iban: "",
    bic: "",
  },
  defaults: {
    paymentTerms: "zahlbar innerhalb von 14 Tagen ohne Abzug",
    offerValidity: "14 Tage",
    currency: "EUR",
    taxRatePercent: 19,
    footerNote: "Es gelten die vereinbarten Geschäftsbedingungen der Druckerei.",
  },
  branding: {
    mode: "placeholder",
    logoLabel: "",
    logoHint: "",
  },
};

export function getDocumentCompanyContactLine(settings: DocumentSettings) {
  return `${settings.company.phone} · ${settings.company.email}`;
}

export function getDocumentCompanyFooterLine(settings: DocumentSettings) {
  return `${settings.company.companyName} · ${settings.company.address}`;
}
