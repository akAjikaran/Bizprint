export type CardData = {
  companyName: string;
  companyLogo: string;
  primaryColor: string;
  secondaryColor: string;
  darkColor: string;
  tagline: string;
  employeeName: string;
  jobTitle: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  linkedin: string;
  instagram: string;
  twitter: string;
};

export type ViewMode = "front" | "back";
export type DownloadFormat = "png" | "jpg" | "pdf";
export type AppMode = "editor" | "templates" | "history" | "preview" | "summary";
export type TemplateId = "architect" | "gallery" | "executive" | "blue-wave" | "brand-chevron";

export type Template = {
  id: TemplateId;
  name: string;
  description: string;
  accent: string;
};

export type DesignPalette = Pick<CardData, "primaryColor" | "secondaryColor" | "darkColor">;

export type SavedProject = {
  id: string;
  name: string;
  card: CardData;
  template: TemplateId;
  updatedAt: string;
};

export const savedProjectsKey = "cardarch-saved-projects";
export const businessWhatsAppNumber = "94771234567";

export const pricingOptions = [
  { quantity: 100, price: 3500 },
  { quantity: 250, price: 7500 },
  { quantity: 500, price: 13500 },
  { quantity: 1000, price: 24000 },
];

export const initialCard: CardData = {
  companyName: "COMPANY_NAME",
  companyLogo: "",
  primaryColor: "#00AEEE",
  secondaryColor: "#016098",
  darkColor: "#08296C",
  tagline: "ARCHITECTURAL EXCELLENCE",
  employeeName: "EMPLOYEE_NAME",
  jobTitle: "JOB_TITLE",
  phone: "phone_number",
  email: "email_address",
  website: "website_url",
  address: "office_address",
  linkedin: "/in/username",
  instagram: "@handle",
  twitter: "@username",
};

export const sampleCard: CardData = {
  companyName: "BIZPRINT",
  companyLogo: "",
  primaryColor: "#00AEEE",
  secondaryColor: "#016098",
  darkColor: "#08296C",
  tagline: "PREMIUM CARD DESIGN",
  employeeName: "AJI KARAN",
  jobTitle: "FOUNDER",
  phone: "+94 77 123 4567",
  email: "hello@bizprint.com",
  website: "bizprint.com",
  address: "Colombo, Sri Lanka",
  linkedin: "/in/ajikaran",
  instagram: "@bizprint",
  twitter: "@bizprint",
};

export const templates: Template[] = [
  {
    id: "architect",
    name: "Architect",
    description: "Dark front, clean back, trim-safe layout.",
    accent: "#7e612e",
  },
  {
    id: "gallery",
    name: "Gallery",
    description: "Editorial white space with a sharp black identity block.",
    accent: "#111827",
  },
  {
    id: "executive",
    name: "Executive",
    description: "Deep charcoal face with a refined bronze contact side.",
    accent: "#a46f3b",
  },
  {
    id: "blue-wave",
    name: "Blue Wave",
    description: "Clean white identity face with blue curved edge graphics.",
    accent: "#009fdf",
  },
  {
    id: "brand-chevron",
    name: "Brand Chevron",
    description: "Navy texture front with a sharp angled contact panel.",
    accent: "#0d2438",
  },
];
