"use client";

import { type ChangeEvent, type CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { toJpeg, toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import Image from "next/image";
import {
  AtSign,
  ChevronDown,
  Download,
  Edit3,
  Globe2,
  MapPin,
  Phone,
  Printer,
  RefreshCcw,
  Ruler,
  Share2,
  Redo2,
  X,
  Undo2,
} from "lucide-react";

type CardData = {
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

type ViewMode = "front" | "back";
type DownloadFormat = "png" | "jpg" | "pdf";
type AppMode = "editor" | "templates" | "history" | "preview" | "summary";
type TemplateId = "architect" | "gallery" | "executive" | "blue-wave" | "brand-chevron";

type Template = {
  id: TemplateId;
  name: string;
  description: string;
  accent: string;
};

type DesignPalette = Pick<CardData, "primaryColor" | "secondaryColor" | "darkColor">;

type SavedProject = {
  id: string;
  name: string;
  card: CardData;
  template: TemplateId;
  updatedAt: string;
};

const savedProjectsKey = "cardarch-saved-projects";
const businessWhatsAppNumber = "94771234567";

const pricingOptions = [
  { quantity: 100, price: 3500 },
  { quantity: 250, price: 7500 },
  { quantity: 500, price: 13500 },
  { quantity: 1000, price: 24000 },
];

const initialCard: CardData = {
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

const sampleCard: CardData = {
  companyName: "CARDARCH",
  companyLogo: "",
  primaryColor: "#00AEEE",
  secondaryColor: "#016098",
  darkColor: "#08296C",
  tagline: "PREMIUM CARD DESIGN",
  employeeName: "AJI KARAN",
  jobTitle: "FOUNDER",
  phone: "+94 77 123 4567",
  email: "hello@cardarch.com",
  website: "cardarch.com",
  address: "Colombo, Sri Lanka",
  linkedin: "/in/ajikaran",
  instagram: "@cardarch",
  twitter: "@cardarch",
};

const templates: Template[] = [
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

function TrimMark() {
  return (
    <>
      <span className="corner corner-tl" />
      <span className="corner corner-tr" />
      <span className="corner corner-bl" />
      <span className="corner corner-br" />
    </>
  );
}

function FrontCard({
  card,
  template,
  exportId,
}: {
  card: CardData;
  template: TemplateId;
  exportId?: string;
}) {
  const cardStyle = {
    "--card-primary": card.primaryColor,
    "--card-secondary": card.secondaryColor,
    "--card-dark": card.darkColor,
  } as CSSProperties;

  if (template === "blue-wave") {
    const gradientIdPrefix = exportId ?? "blue-wave-front-preview";

    return (
      <div className="card-stage" aria-label="Front business card design">
        <TrimMark />
        <div id={exportId} className="business-card front-card template-blue-wave front-blue-wave-exact" style={cardStyle}>
          <BlueWaveFrontArtwork card={card} gradientIdPrefix={gradientIdPrefix} />
          <div className={card.companyLogo ? "wave-logo uploaded-logo" : "wave-logo"}>
            {card.companyLogo ? (
              <Image src={card.companyLogo} alt={`${card.companyName} logo`} fill sizes="76px" unoptimized />
            ) : (
              <>
                <div className="wave-logo-mark">
                  <span />
                  <Ruler size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <span>YOUR</span>
                  <strong>{card.companyName}</strong>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-stage" aria-label="Front business card design">
      <TrimMark />
      <div id={exportId} className={`business-card front-card template-${template}`} style={cardStyle}>
        <div className="safe-area">
          <div className={card.companyLogo ? "brand-mark uploaded-logo" : "brand-mark"}>
            {card.companyLogo ? (
              <Image src={card.companyLogo} alt={`${card.companyName} logo`} fill sizes="60px" unoptimized />
            ) : (
              <Ruler size={25} strokeWidth={2.6} />
            )}
          </div>
          <h2>{card.companyName}</h2>
          <p>{card.tagline}</p>
        </div>
      </div>
    </div>
  );
}

function BlueWaveFrontArtwork({ card, gradientIdPrefix }: { card: CardData; gradientIdPrefix: string }) {
  const primaryGradientId = `${gradientIdPrefix}-primary-gradient`;
  const secondaryGradientId = `${gradientIdPrefix}-secondary-gradient`;

  return (
    <svg
      className="blue-wave-front-artwork"
      viewBox="0 0 266 157"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="none"
    >
      <rect y="0.0683594" width="264.754" height="156.201" fill="white" />
      <path
        d="M183.878 84.8098C149.613 140.119 113.393 155.509 99.5664 156.29H211.641C186.03 80.5274 267.223 0.00141977 264.782 0.000967175C261.449 0.000349268 259.618 0.00110564 257.375 0C247.595 4.83383 218.142 29.5007 183.878 84.8098Z"
        fill={`url(#${primaryGradientId})`}
      />
      <path
        d="M212.616 156.273H210.196C202.652 138.547 201.446 102.237 221.271 62.0518C237.131 29.9034 257.447 5.86334 264.843 0.0957031L265.311 39.3065C224.075 74.9344 212.361 132.175 212.616 156.273Z"
        fill={`url(#${secondaryGradientId})`}
      />
      <path d="M264.522 156.293L265.222 39.0938C222.474 69.0805 211.596 130.682 212.153 156.293H264.522Z" fill={card.darkColor} />
      <defs>
        <linearGradient id={primaryGradientId} x1="258.31" y1="3.30434" x2="146.938" y2="152.96" gradientUnits="userSpaceOnUse">
          <stop stopColor={card.secondaryColor} />
          <stop offset="1" stopColor={card.primaryColor} />
        </linearGradient>
        <linearGradient id={secondaryGradientId} x1="261.012" y1="4.56446" x2="234.17" y2="156.571" gradientUnits="userSpaceOnUse">
          <stop stopColor={card.primaryColor} />
          <stop offset="1" stopColor={card.secondaryColor} />
        </linearGradient>
      </defs>
    </svg>
  );
}

function BlueWaveBackArtwork({ card, gradientIdPrefix }: { card: CardData; gradientIdPrefix: string }) {
  const primaryGradientId = `${gradientIdPrefix}-primary-gradient`;
  const secondaryGradientId = `${gradientIdPrefix}-secondary-gradient`;

  return (
    <svg
      className="blue-wave-back-artwork"
      viewBox="0 0 265 157"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="none"
    >
      <rect width="264.754" height="156.201" transform="matrix(1 0 0 -1 0 156.229)" fill="white" />
      <path
        d="M138.32 71.481C96.0938 16.172 51.4577 0.782272 34.418 0.00105286H172.534C140.972 75.7634 267.386 156.293 264.378 156.293C260.27 156.294 238.702 156.292 235.938 156.293C223.885 151.459 180.546 126.79 138.32 71.481Z"
        fill={`url(#${primaryGradientId})`}
      />
      <path
        d="M175.274 0.028244H172.293C162.996 17.754 161.509 54.0636 185.94 94.249C205.485 126.397 255.674 150.689 264.788 156.457V143.358C213.971 107.731 174.961 24.126 175.274 0.028244Z"
        fill={`url(#${secondaryGradientId})`}
      />
      <path d="M264.794 0.00439453V143.537C200.28 106.815 174.137 31.3679 174.977 0.00439453H264.794Z" fill={card.darkColor} />
      <defs>
        <linearGradient id={primaryGradientId} x1="230.046" y1="152.989" x2="127.147" y2="-17.4107" gradientUnits="userSpaceOnUse">
          <stop stopColor={card.secondaryColor} />
          <stop offset="1" stopColor={card.primaryColor} />
        </linearGradient>
        <linearGradient id={secondaryGradientId} x1="234.916" y1="151.736" x2="212.907" y2="-1.8567" gradientUnits="userSpaceOnUse">
          <stop stopColor={card.primaryColor} />
          <stop offset="1" stopColor={card.secondaryColor} />
        </linearGradient>
      </defs>
    </svg>
  );
}

function QrCode() {
  return (
    <div className="qr" aria-label="QR code preview">
      {Array.from({ length: 25 }).map((_, index) => (
        <span key={index} />
      ))}
    </div>
  );
}

function BackCard({
  card,
  template,
  exportId,
}: {
  card: CardData;
  template: TemplateId;
  exportId?: string;
}) {
  const cardStyle = {
    "--card-primary": card.primaryColor,
    "--card-secondary": card.secondaryColor,
    "--card-dark": card.darkColor,
  } as CSSProperties;

  if (template === "blue-wave") {
    const gradientIdPrefix = exportId ?? "blue-wave-back-preview";
    const contactRows = [
      { icon: MapPin, label: card.address },
      { icon: AtSign, label: card.email },
      { icon: Globe2, label: card.website },
      { icon: Phone, label: card.phone },
    ];

    return (
      <div className="card-stage" aria-label="Back business card design">
        <TrimMark />
        <div id={exportId} className="business-card back-card template-blue-wave back-blue-wave-exact" style={cardStyle}>
          <BlueWaveBackArtwork card={card} gradientIdPrefix={gradientIdPrefix} />
          <div className="wave-contact-block">
            <h2>{card.employeeName}</h2>
            <p>{card.jobTitle}</p>
            <div className="wave-contact-list">
              {contactRows.map(({ icon: Icon, label }, index) => (
                <div className="wave-contact-row" key={`${label}-${index}`}>
                  <span>
                    <Icon size={10} strokeWidth={2.3} />
                  </span>
                  <strong>{label}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const contactRows = [
    { icon: Phone, label: card.phone },
    { icon: AtSign, label: card.email },
    { icon: Globe2, label: card.website },
    { icon: MapPin, label: card.address },
  ];

  return (
    <div className="card-stage" aria-label="Back business card design">
      <TrimMark />
      <div id={exportId} className={`business-card back-card template-${template}`} style={cardStyle}>
        <div className="safe-area back-grid">
          <div className="profile">
            <h2>{card.employeeName}</h2>
            <p>{card.jobTitle}</p>
            <span className="divider" />
          </div>
          <div className="mini-brand">
            <span>COMPANY</span>
            <strong>{card.companyName}</strong>
          </div>
          <div className="contact-list">
            {contactRows.map(({ icon: Icon, label }) => (
              <div className="contact-row" key={label}>
                <Icon size={12} strokeWidth={1.8} />
                <span>{label}</span>
              </div>
            ))}
          </div>
          <QrCode />
        </div>
      </div>
    </div>
  );
}

function TemplateGallery({
  selectedTemplate,
  onApply,
}: {
  selectedTemplate: TemplateId;
  onApply: (template: TemplateId) => void;
}) {
  return (
    <section id="templates" className="templates-panel" aria-label="Business card templates">
      <div className="templates-head">
        <div>
          <span>Templates</span>
          <h1>Business Card</h1>
        </div>
        <p>Choose a template to start editing your business card design.</p>
      </div>
      <div className="home-banner" aria-label="Business card editor introduction">
        <div>
          <span>Design workspace</span>
          <h2>Create a print-ready business card in minutes</h2>
        </div>
        <p>Pick a template, update your brand details, then export the front and back sides for sharing or print.</p>
      </div>
      <div className="template-grid">
        {templates.map((template) => (
          <button
            className="template-card"
            type="button"
            key={template.id}
            onClick={() => onApply(template.id)}
            aria-label={`Edit ${template.name} business card template`}
          >
            <div className="template-preview" style={{ "--template-accent": template.accent } as CSSProperties}>
              <FrontCard card={sampleCard} template={template.id} />
            </div>
            <div className="template-meta">
              <div>
                <h2>{template.name}</h2>
                <p>{template.description}</p>
              </div>
              <span className={selectedTemplate === template.id ? "applied" : ""}>
                {selectedTemplate === template.id ? "Selected" : "Edit"}
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function SavedProjectsPanel({
  projects,
  onLoad,
  onDelete,
}: {
  projects: SavedProject[];
  onLoad: (project: SavedProject) => void;
  onDelete: (projectId: string) => void;
}) {
  return (
    <section id="history" className="templates-panel saved-projects-panel" aria-label="Saved business card projects">
      <div className="templates-head">
        <div>
          <span>History</span>
          <h1>Saved projects</h1>
        </div>
        <p>Load a saved card to continue editing, or remove projects you no longer need.</p>
      </div>

      {projects.length > 0 ? (
        <div className="saved-project-grid">
          {projects.map((project) => (
            <article className="saved-project-card" key={project.id}>
              <div className="saved-project-preview" aria-hidden="true">
                <span style={{ background: project.card.primaryColor }} />
                <span style={{ background: project.card.secondaryColor }} />
                <span style={{ background: project.card.darkColor }} />
              </div>
              <div className="saved-project-content">
                <div className="saved-project-title-row">
                  <h2>{project.name}</h2>
                  <span>{project.template.replace("-", " ")}</span>
                </div>
                <dl>
                  <div>
                    <dt>Company</dt>
                    <dd>{project.card.companyName}</dd>
                  </div>
                  <div>
                    <dt>Contact</dt>
                    <dd>{project.card.employeeName}</dd>
                  </div>
                  <div>
                    <dt>Updated</dt>
                    <dd>{new Date(project.updatedAt).toLocaleDateString()}</dd>
                  </div>
                </dl>
              </div>
              <div className="saved-project-actions">
                <button type="button" onClick={() => onLoad(project)}>
                  Edit
                </button>
                <button type="button" onClick={() => onDelete(project.id)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-projects">
          <h2>No saved projects yet</h2>
          <p>Use Save Project in the editor after creating a card.</p>
        </div>
      )}
    </section>
  );
}

function PreviewPanel({
  card,
  template,
  onBackToEdit,
  onContinue,
}: {
  card: CardData;
  template: TemplateId;
  onBackToEdit: () => void;
  onContinue: () => void;
}) {
  const reviewItems = [
    "Check spelling for the company name, employee name, job title, email, website, phone, and address.",
    "Confirm the logo is clear and the colors match your brand.",
    "Review both front and back sides before continuing to the order summary.",
  ];

  return (
    <section className="review-panel" aria-label="Business card preview and review">
      <div className="review-head">
        <div>
          <span>Preview</span>
          <h1>Review your business card</h1>
        </div>
        <p>Make sure the design and content are correct before moving to the order summary.</p>
      </div>

      <div className="review-layout">
        <div className="review-cards">
          <CardSection id="preview-front-side" title="Front Side" active>
            <FrontCard card={card} template={template} />
          </CardSection>
          <CardSection id="preview-back-side" title="Back Side" active>
            <BackCard card={card} template={template} />
          </CardSection>
        </div>

        <aside className="review-checklist" aria-label="Review checklist">
          <h2>Before you continue</h2>
          <ul>
            {reviewItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="review-actions">
            <button type="button" onClick={onBackToEdit}>
              Back to edit my design
            </button>
            <button type="button" onClick={onContinue}>
              Continue to order summary
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}

function OrderSummary({
  card,
  template,
  onBackToPreview,
  onBackToEdit,
}: {
  card: CardData;
  template: TemplateId;
  onBackToPreview: () => void;
  onBackToEdit: () => void;
}) {
  const selectedTemplate = templates.find((item) => item.id === template);
  const [selectedQuantity, setSelectedQuantity] = useState(pricingOptions[0].quantity);
  const selectedPricing = pricingOptions.find((option) => option.quantity === selectedQuantity) ?? pricingOptions[0];
  const formattedPrice = new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(selectedPricing.price);
  const whatsappMessage = [
    "Hi, I want to print my business card design.",
    `Template: ${selectedTemplate?.name ?? template}`,
    `Quantity: ${selectedPricing.quantity} cards`,
    `Estimated price: ${formattedPrice}`,
    `Company: ${card.companyName}`,
    `Name: ${card.employeeName}`,
    `Phone: ${card.phone}`,
    "Please check the design and send me the print-ready file/order confirmation.",
  ].join("\n");
  const whatsappUrl = `https://wa.me/${businessWhatsAppNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <section className="order-summary-panel" aria-label="Order summary">
      <div className="review-head">
        <div>
          <span>Order Summary</span>
          <h1>My order summary</h1>
        </div>
        <p>Confirm the selected design and business card details before placing the order.</p>
      </div>

      <div className="summary-layout">
        <div className="summary-preview">
          <FrontCard card={card} template={template} />
          <BackCard card={card} template={template} />
        </div>

        <div className="summary-card">
          <h2>Business card details</h2>
          <dl>
            <div>
              <dt>Template</dt>
              <dd>{selectedTemplate?.name ?? template}</dd>
            </div>
            <div>
              <dt>Company</dt>
              <dd>{card.companyName}</dd>
            </div>
            <div>
              <dt>Name</dt>
              <dd>{card.employeeName}</dd>
            </div>
            <div>
              <dt>Job title</dt>
              <dd>{card.jobTitle}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{card.email}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{card.phone}</dd>
            </div>
          </dl>

          <div className="summary-note">
            <strong>Ready to order</strong>
            <p>Review the details above one last time. If everything is correct, your business card design is ready for the final order step.</p>
          </div>

          <div className="pricing-card">
            <div>
              <span>Print quantity</span>
              <strong>{formattedPrice}</strong>
            </div>
            <div className="quantity-options" aria-label="Select print quantity">
              {pricingOptions.map((option) => (
                <button
                  className={selectedQuantity === option.quantity ? "selected" : ""}
                  type="button"
                  key={option.quantity}
                  onClick={() => setSelectedQuantity(option.quantity)}
                >
                  <span>{option.quantity}</span>
                  <strong>
                    {new Intl.NumberFormat("en-LK", {
                      style: "currency",
                      currency: "LKR",
                      maximumFractionDigits: 0,
                    }).format(option.price)}
                  </strong>
                </button>
              ))}
            </div>
          </div>

          <div className="review-actions">
            <button type="button" onClick={onBackToPreview}>
              Back to preview
            </button>
            <button type="button" onClick={onBackToEdit}>
              Edit design
            </button>
            <a className="whatsapp-order-button" href={whatsappUrl} target="_blank" rel="noreferrer">
              Contact us on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function CardSection({
  id,
  title,
  active,
  children,
}: {
  id: string;
  title: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={active ? "design-section" : "design-section muted-section"}>
      <div className="section-head">
        <h1>{title}</h1>
        <span>TRIM: 3.5&quot; X 2.0&quot;</span>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function rgbToHex(red: number, green: number, blue: number) {
  return `#${[red, green, blue].map((value) => value.toString(16).padStart(2, "0")).join("")}`;
}

function getColorScore([red, green, blue, count]: [number, number, number, number]) {
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const saturation = max === 0 ? 0 : (max - min) / max;
  const brightness = (red * 299 + green * 587 + blue * 114) / 1000;

  return count * (0.7 + saturation) * (brightness > 28 && brightness < 245 ? 1 : 0.35);
}

function getBrightness(hexColor: string) {
  const red = Number.parseInt(hexColor.slice(1, 3), 16);
  const green = Number.parseInt(hexColor.slice(3, 5), 16);
  const blue = Number.parseInt(hexColor.slice(5, 7), 16);

  return (red * 299 + green * 587 + blue * 114) / 1000;
}

function hexToRgb(hexColor: string) {
  return {
    red: Number.parseInt(hexColor.slice(1, 3), 16),
    green: Number.parseInt(hexColor.slice(3, 5), 16),
    blue: Number.parseInt(hexColor.slice(5, 7), 16),
  };
}

function rgbToHsl(red: number, green: number, blue: number) {
  const normalizedRed = red / 255;
  const normalizedGreen = green / 255;
  const normalizedBlue = blue / 255;
  const max = Math.max(normalizedRed, normalizedGreen, normalizedBlue);
  const min = Math.min(normalizedRed, normalizedGreen, normalizedBlue);
  const lightness = (max + min) / 2;
  const delta = max - min;

  if (delta === 0) {
    return { hue: 0, saturation: 0, lightness };
  }

  const saturation = delta / (1 - Math.abs(2 * lightness - 1));
  let hue = 0;

  if (max === normalizedRed) {
    hue = 60 * (((normalizedGreen - normalizedBlue) / delta) % 6);
  } else if (max === normalizedGreen) {
    hue = 60 * ((normalizedBlue - normalizedRed) / delta + 2);
  } else {
    hue = 60 * ((normalizedRed - normalizedGreen) / delta + 4);
  }

  return { hue: hue < 0 ? hue + 360 : hue, saturation, lightness };
}

function hslToHex(hue: number, saturation: number, lightness: number) {
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const huePrime = hue / 60;
  const x = chroma * (1 - Math.abs((huePrime % 2) - 1));
  const match = lightness - chroma / 2;
  let red = 0;
  let green = 0;
  let blue = 0;

  if (huePrime >= 0 && huePrime < 1) {
    red = chroma;
    green = x;
  } else if (huePrime < 2) {
    red = x;
    green = chroma;
  } else if (huePrime < 3) {
    green = chroma;
    blue = x;
  } else if (huePrime < 4) {
    green = x;
    blue = chroma;
  } else if (huePrime < 5) {
    red = x;
    blue = chroma;
  } else {
    red = chroma;
    blue = x;
  }

  return rgbToHex(
    Math.round((red + match) * 255),
    Math.round((green + match) * 255),
    Math.round((blue + match) * 255),
  );
}

function getColorDistance(firstColor: string, secondColor: string) {
  const first = hexToRgb(firstColor);
  const second = hexToRgb(secondColor);

  return Math.sqrt(
    (first.red - second.red) ** 2 +
      (first.green - second.green) ** 2 +
      (first.blue - second.blue) ** 2,
  );
}

function buildSuggestedPalette(colors: string[], fallback: DesignPalette): DesignPalette {
  const primaryColor = colors[0] ?? fallback.primaryColor;
  const secondaryLogoColor = colors.find(
    (color) => getColorDistance(color, primaryColor) > 72 && getBrightness(color) < 230,
  );
  const { red, green, blue } = hexToRgb(primaryColor);
  const primaryHsl = rgbToHsl(red, green, blue);
  const isNeutralLogo = primaryHsl.saturation < 0.16;
  const softBrandColor = hslToHex(primaryHsl.hue, Math.max(primaryHsl.saturation * 0.34, 0.12), 0.9);
  const deeperBrandColor = hslToHex(primaryHsl.hue, Math.min(primaryHsl.saturation * 1.05, 0.78), 0.23);

  if (isNeutralLogo) {
    return {
      primaryColor,
      secondaryColor: colors.find((color) => getBrightness(color) > 130 && getBrightness(color) < 235) ?? "#e5e7eb",
      darkColor: colors.find((color) => getBrightness(color) < 90) ?? "#111827",
    };
  }

  return {
    primaryColor,
    secondaryColor: secondaryLogoColor ?? softBrandColor,
    darkColor: colors.find((color) => getBrightness(color) < 90) ?? deeperBrandColor,
  };
}

function buildSuggestedPalettes(colors: string[], fallback: DesignPalette): DesignPalette[] {
  const basePalette = buildSuggestedPalette(colors, fallback);
  const primaryColor = basePalette.primaryColor;
  const secondaryLogoColor = colors.find(
    (color) => getColorDistance(color, primaryColor) > 72 && getBrightness(color) < 230,
  );
  const { red, green, blue } = hexToRgb(primaryColor);
  const { hue, saturation, lightness } = rgbToHsl(red, green, blue);
  const richSaturation = Math.max(saturation, 0.42);
  const softSaturation = Math.max(saturation * 0.28, 0.1);
  const darkNeutral = colors.find((color) => getBrightness(color) < 85) ?? "#111827";
  const softNeutral = colors.find((color) => getBrightness(color) > 150 && getBrightness(color) < 235) ?? "#e5e7eb";
  const darkBrand = hslToHex(hue, Math.min(richSaturation, 0.76), 0.22);
  const deepBrand = hslToHex(hue, Math.min(richSaturation, 0.7), 0.16);
  const softBrand = hslToHex(hue, softSaturation, 0.9);
  const midBrand = hslToHex(hue, Math.min(richSaturation, 0.72), Math.min(Math.max(lightness, 0.36), 0.52));
  const complement = hslToHex((hue + 180) % 360, Math.min(richSaturation, 0.58), 0.42);
  const analogous = hslToHex((hue + 28) % 360, Math.min(richSaturation, 0.62), 0.44);
  const secondAnalogous = hslToHex((hue + 332) % 360, Math.min(richSaturation, 0.62), 0.46);
  const palettes: DesignPalette[] = [
    basePalette,
    { primaryColor, secondaryColor: softBrand, darkColor: darkNeutral },
    { primaryColor: midBrand, secondaryColor: secondaryLogoColor ?? softNeutral, darkColor: deepBrand },
    { primaryColor, secondaryColor: complement, darkColor: darkNeutral },
    { primaryColor: analogous, secondaryColor: secondAnalogous, darkColor: darkBrand },
    { primaryColor, secondaryColor: "#f3f4f6", darkColor: "#111827" },
  ];
  const uniquePalettes = new Map<string, DesignPalette>();

  palettes.forEach((palette) => {
    uniquePalettes.set(`${palette.primaryColor}-${palette.secondaryColor}-${palette.darkColor}`, palette);
  });

  while (uniquePalettes.size < 6) {
    const index = uniquePalettes.size;
    const palette = {
      primaryColor: hslToHex((hue + index * 18) % 360, Math.min(richSaturation, 0.68), 0.46),
      secondaryColor: hslToHex((hue + index * 18) % 360, softSaturation, 0.88),
      darkColor: hslToHex((hue + index * 18) % 360, Math.min(richSaturation, 0.7), 0.18),
    };

    uniquePalettes.set(`${palette.primaryColor}-${palette.secondaryColor}-${palette.darkColor}`, palette);
  }

  return [...uniquePalettes.values()].slice(0, 6);
}

export default function Home() {
  const [card, setCard] = useState<CardData>(initialCard);
  const [undoStack, setUndoStack] = useState<CardData[]>([]);
  const [redoStack, setRedoStack] = useState<CardData[]>([]);
  const [view, setView] = useState<ViewMode>("front");
  const [mode, setMode] = useState<AppMode>("templates");
  const [template, setTemplate] = useState<TemplateId>("architect");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [suggestedPalettes, setSuggestedPalettes] = useState<DesignPalette[]>([]);
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    const storedProjects = window.localStorage.getItem(savedProjectsKey);

    if (!storedProjects) {
      return [];
    }

    try {
      return JSON.parse(storedProjects) as SavedProject[];
    } catch {
      return [];
    }
  });
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const shareText = useMemo(
    () => `${card.companyName} business card for ${card.employeeName} - ${card.website}`,
    [card.companyName, card.employeeName, card.website],
  );

  useEffect(() => {
    window.localStorage.setItem(savedProjectsKey, JSON.stringify(savedProjects));
  }, [savedProjects]);

  function commitCardChange(updater: CardData | ((current: CardData) => CardData)) {
    setCard((current) => {
      const nextCard = typeof updater === "function" ? updater(current) : updater;

      if (JSON.stringify(current) === JSON.stringify(nextCard)) {
        return current;
      }

      setUndoStack((pastCards) => [...pastCards.slice(-39), current]);
      setRedoStack([]);

      return nextCard;
    });
  }

  function updateCard(field: keyof CardData, value: string) {
    commitCardChange((current) => ({ ...current, [field]: value }));
  }

  function undoCardChange() {
    setUndoStack((pastCards) => {
      const previousCard = pastCards[pastCards.length - 1];

      if (!previousCard) {
        return pastCards;
      }

      setCard((currentCard) => {
        setRedoStack((futureCards) => [currentCard, ...futureCards].slice(0, 40));
        return previousCard;
      });
      setSuggestedPalettes([]);

      return pastCards.slice(0, -1);
    });
  }

  function redoCardChange() {
    setRedoStack((futureCards) => {
      const nextCard = futureCards[0];

      if (!nextCard) {
        return futureCards;
      }

      setCard((currentCard) => {
        setUndoStack((pastCards) => [...pastCards.slice(-39), currentCard]);
        return nextCard;
      });
      setSuggestedPalettes([]);

      return futureCards.slice(1);
    });
  }

  async function generatePaletteFromLogo(logoDataUrl = card.companyLogo) {
    if (!logoDataUrl) {
      return;
    }

    const image = document.createElement("img");
    image.decoding = "async";

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Could not read logo colors."));
      image.src = logoDataUrl;
    });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });

    if (!context) {
      return;
    }

    canvas.width = 80;
    canvas.height = 80;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    const buckets = new Map<string, [number, number, number, number]>();

    for (let index = 0; index < pixels.length; index += 16) {
      const alpha = pixels[index + 3];

      if (alpha < 128) {
        continue;
      }

      const red = pixels[index];
      const green = pixels[index + 1];
      const blue = pixels[index + 2];
      const brightness = (red * 299 + green * 587 + blue * 114) / 1000;

      if (brightness > 248 || brightness < 8) {
        continue;
      }

      const bucketRed = Math.round(red / 32) * 32;
      const bucketGreen = Math.round(green / 32) * 32;
      const bucketBlue = Math.round(blue / 32) * 32;
      const key = `${bucketRed},${bucketGreen},${bucketBlue}`;
      const bucket = buckets.get(key) ?? [bucketRed, bucketGreen, bucketBlue, 0];

      bucket[3] += 1;
      buckets.set(key, bucket);
    }

    const colors = [...buckets.values()]
      .sort((first, second) => getColorScore(second) - getColorScore(first))
      .map(([red, green, blue]) => rgbToHex(Math.min(red, 255), Math.min(green, 255), Math.min(blue, 255)));
    const fallback = {
      primaryColor: card.primaryColor,
      secondaryColor: card.secondaryColor,
      darkColor: card.darkColor,
    };

    setSuggestedPalettes(buildSuggestedPalettes(colors, fallback));
  }

  function uploadCompanyLogo(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateCard("companyLogo", reader.result);
        void generatePaletteFromLogo(reader.result);
      }

      event.target.value = "";
    };

    reader.readAsDataURL(file);
  }

  function removeCompanyLogo() {
    updateCard("companyLogo", "");
    setSuggestedPalettes([]);

    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
  }

  function applySuggestedPalette(palette: DesignPalette) {
    commitCardChange((current) => ({ ...current, ...palette }));
    setSuggestedPalettes([]);
  }

  function saveProject() {
    const defaultName = card.companyName === initialCard.companyName ? "Untitled card" : card.companyName;
    const projectName = window.prompt("Project name", defaultName);

    if (!projectName) {
      return;
    }

    const projectId = activeProjectId ?? crypto.randomUUID();
    const project: SavedProject = {
      id: projectId,
      name: projectName.trim() || defaultName,
      card,
      template,
      updatedAt: new Date().toISOString(),
    };

    setSavedProjects((currentProjects) => {
      if (!activeProjectId) {
        return [project, ...currentProjects];
      }

      return [
        project,
        ...currentProjects.filter((currentProject) => currentProject.id !== activeProjectId),
      ];
    });
    setActiveProjectId(projectId);
    setMode("history");
    setIsEditorOpen(false);
  }

  function loadProject(project: SavedProject) {
    setCard(project.card);
    setTemplate(project.template);
    setView("front");
    setMode("editor");
    setIsEditorOpen(true);
    setSuggestedPalettes([]);
    setUndoStack([]);
    setRedoStack([]);
    setActiveProjectId(project.id);
  }

  function deleteProject(projectId: string) {
    setSavedProjects((currentProjects) => currentProjects.filter((project) => project.id !== projectId));
  }

  function resetCard() {
    setCard(initialCard);
    setTemplate("architect");
    setView("front");
    setMode("editor");
    setSuggestedPalettes([]);
    setUndoStack([]);
    setRedoStack([]);
    setActiveProjectId(null);
  }

  function openEditor() {
    setMode("editor");
    setIsEditorOpen(true);
  }

  function openPreview() {
    setMode("preview");
    setIsEditorOpen(false);
    setView("front");
    window.setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 0);
  }

  function openSummary() {
    setMode("summary");
    setIsEditorOpen(false);
    window.setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 0);
  }

  function selectTemplate(nextTemplate: TemplateId) {
    setTemplate(nextTemplate);
    setView("front");
    setMode("editor");
    setIsEditorOpen(true);
    setSuggestedPalettes([]);
    setUndoStack([]);
    setRedoStack([]);
    setActiveProjectId(null);
    window.setTimeout(() => {
      document.getElementById("front-side")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  }

  function openTemplates() {
    setMode("templates");
    setIsEditorOpen(false);
    window.setTimeout(() => {
      document.getElementById("templates")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  }

  function openHistory() {
    setMode("history");
    setIsEditorOpen(false);
    window.setTimeout(() => {
      document.getElementById("history")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  }

  async function shareCard() {
    if (navigator.share) {
      await navigator.share({
        title: "CardArch business card",
        text: shareText,
      });
      return;
    }

    await navigator.clipboard.writeText(shareText);
    alert("Card details copied to clipboard.");
  }

  function getExportNode(side: ViewMode) {
    const node = document.getElementById(`${side}-card-export`);

    if (!node) {
      throw new Error(`Could not find ${side} card for export.`);
    }

    return node;
  }

  function saveDataUrl(dataUrl: string, filename: string) {
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
  }

  async function downloadImage(format: Extract<DownloadFormat, "png" | "jpg">) {
    const node = getExportNode(view);
    const filename = `cardarch-${view}.${format}`;
    const options = {
      cacheBust: true,
      pixelRatio: 4,
      backgroundColor: view === "front" && template !== "blue-wave" ? card.darkColor : "#ffffff",
    };
    const dataUrl =
      format === "png"
        ? await toPng(node, options)
        : await toJpeg(node, { ...options, quality: 0.96 });

    saveDataUrl(dataUrl, filename);
  }

  async function downloadPdf() {
    const frontImage = await toPng(getExportNode("front"), {
      cacheBust: true,
      pixelRatio: 4,
      backgroundColor: template !== "blue-wave" ? card.darkColor : "#ffffff",
    });
    const backImage = await toPng(getExportNode("back"), {
      cacheBust: true,
      pixelRatio: 4,
      backgroundColor: "#ffffff",
    });
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "in",
      format: [3.5, 2],
    });

    pdf.addImage(frontImage, "PNG", 0, 0, 3.5, 2);
    pdf.addPage([3.5, 2], "landscape");
    pdf.addImage(backImage, "PNG", 0, 0, 3.5, 2);
    pdf.save("cardarch-business-card.pdf");
  }

  async function downloadCard(format: DownloadFormat) {
    setIsDownloading(true);
    setIsDownloadMenuOpen(false);

    try {
      await document.fonts.ready;

      if (format === "pdf") {
        await downloadPdf();
      } else {
        await downloadImage(format);
      }
    } catch (error) {
      console.error(error);
      alert("Download failed. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  }

  function selectView(nextView: ViewMode) {
    setView(nextView);
    document.getElementById(`${nextView}-side`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <main className={isEditorOpen ? "app-shell editor-open" : "app-shell"}>
      <header className="topbar">
        <a className="logo" href="#" aria-label="BIZ CARD home">
          BIZ CARD
        </a>
        <nav className="main-nav" aria-label="Primary">
          <button className={mode === "templates" ? "nav-link active" : "nav-link"} type="button" onClick={openTemplates}>
            Designs
          </button>
          <button
            className={mode === "editor" || mode === "preview" || mode === "summary" ? "nav-link active" : "nav-link"}
            type="button"
            onClick={openEditor}
          >
            Editor
          </button>
          <button className={mode === "history" ? "nav-link active" : "nav-link"} type="button" onClick={openHistory}>
            Projects
          </button>
        </nav>
        {mode === "editor" ? (
          <div className="actions">
            <button
              className="icon-button"
              type="button"
              aria-label="Undo"
              onClick={undoCardChange}
              disabled={undoStack.length === 0}
            >
              <Undo2 size={18} />
            </button>
            <button
              className="icon-button"
              type="button"
              aria-label="Redo"
              onClick={redoCardChange}
              disabled={redoStack.length === 0}
            >
              <Redo2 size={18} />
            </button>
            <button className="icon-button" type="button" aria-label="Print" onClick={() => window.print()}>
              <Printer size={18} />
            </button>
            <button className="icon-button" type="button" aria-label="Share" onClick={shareCard}>
              <Share2 size={18} />
            </button>
            <div className="download-menu">
              <button
                className="export-button"
                type="button"
                onClick={() => setIsDownloadMenuOpen((isOpen) => !isOpen)}
                aria-expanded={isDownloadMenuOpen}
                aria-haspopup="menu"
                disabled={isDownloading}
              >
                <Download size={17} />
                {isDownloading ? "Downloading" : "Download"}
                <ChevronDown size={16} />
              </button>
              {isDownloadMenuOpen ? (
                <div className="download-options" role="menu">
                  <button type="button" role="menuitem" onClick={() => downloadCard("png")}>
                    PNG current side
                  </button>
                  <button type="button" role="menuitem" onClick={() => downloadCard("jpg")}>
                    JPG current side
                  </button>
                  <button type="button" role="menuitem" onClick={() => downloadCard("pdf")}>
                    PDF front + back
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="actions" />
        )}
      </header>

      <div className="workspace">
        {mode === "templates" ? (
          <TemplateGallery selectedTemplate={template} onApply={selectTemplate} />
        ) : null}

        {mode === "history" ? (
          <SavedProjectsPanel projects={savedProjects} onLoad={loadProject} onDelete={deleteProject} />
        ) : null}

        {mode === "editor" ? (
          <>
            <section className="editor-top-controls" aria-label="Logo and color controls">
              <div className="top-logo-card">
                <div className="top-control-title">
                  <span>Logo</span>
                  <strong>{card.companyLogo ? "Logo uploaded" : "Add your brand mark"}</strong>
                </div>
                <div className="top-logo-row">
                  <button className="top-logo-preview" type="button" onClick={() => logoInputRef.current?.click()}>
                    {card.companyLogo ? (
                      <Image src={card.companyLogo} alt={`${card.companyName} logo preview`} fill sizes="52px" unoptimized />
                    ) : (
                      <Ruler size={22} strokeWidth={2.4} />
                    )}
                  </button>
                  <input
                    ref={logoInputRef}
                    className="top-logo-file"
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                    onChange={uploadCompanyLogo}
                  />
                  <div className="top-logo-actions">
                    <button type="button" onClick={() => logoInputRef.current?.click()}>
                      {card.companyLogo ? "Change" : "Upload"}
                    </button>
                    {card.companyLogo ? (
                      <button type="button" onClick={() => void generatePaletteFromLogo()}>
                        Palette
                      </button>
                    ) : null}
                    {card.companyLogo ? (
                      <button type="button" onClick={removeCompanyLogo}>
                        Remove
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="top-color-card">
                <div className="top-control-title">
                  <span>Colors</span>
                  <strong>Tap a swatch to edit</strong>
                </div>
                <div className="top-swatch-list">
                  {[
                    { label: "Primary", field: "primaryColor" as const, value: card.primaryColor },
                    { label: "Secondary", field: "secondaryColor" as const, value: card.secondaryColor },
                    { label: "Dark", field: "darkColor" as const, value: card.darkColor },
                  ].map((color) => (
                    <label className="top-color-swatch" key={color.field}>
                      <input type="color" value={color.value} onChange={(event) => updateCard(color.field, event.target.value)} />
                      <i style={{ background: color.value }} aria-hidden="true" />
                      <span>{color.label}</span>
                      <strong>{color.value}</strong>
                    </label>
                  ))}
                </div>
              </div>

              {suggestedPalettes.length > 0 ? (
                <div className="top-palette-suggestion">
                  <span>Suggested palettes</span>
                  <div className="top-palette-options">
                    {suggestedPalettes.map((palette, index) => (
                      <button
                        className="palette-option"
                        type="button"
                        onClick={() => applySuggestedPalette(palette)}
                        key={`${palette.primaryColor}-${palette.secondaryColor}-${palette.darkColor}`}
                      >
                        <span>Palette {index + 1}</span>
                        <div className="palette-swatches" aria-hidden="true">
                          <i style={{ background: palette.primaryColor }} />
                          <i style={{ background: palette.secondaryColor }} />
                          <i style={{ background: palette.darkColor }} />
                        </div>
                      </button>
                    ))}
                  </div>
                  <button className="top-dismiss-palette" type="button" onClick={() => setSuggestedPalettes([])}>
                    Dismiss
                  </button>
                </div>
              ) : null}
            </section>

            <CardSection id="front-side" title="Front Side" active={view === "front"}>
              <FrontCard card={card} template={template} exportId="front-card-export" />
            </CardSection>

            <CardSection id="back-side" title="Back Side" active={view === "back"}>
              <BackCard card={card} template={template} exportId="back-card-export" />
            </CardSection>

          </>
        ) : null}

        {mode === "preview" ? (
          <PreviewPanel card={card} template={template} onBackToEdit={openEditor} onContinue={openSummary} />
        ) : null}

        {mode === "summary" ? (
          <OrderSummary card={card} template={template} onBackToPreview={openPreview} onBackToEdit={openEditor} />
        ) : null}
      </div>

      <aside className={isEditorOpen ? "edit-panel open" : "edit-panel"} aria-label="Card editor">
        <div className="panel-head">
          <div>
            <span>Editor</span>
            <h2>Card details</h2>
          </div>
          <button className="icon-button" type="button" aria-label="Close editor" onClick={() => setIsEditorOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="panel-actions">
          <button type="button" onClick={openPreview}>
            Preview Card
          </button>
          <button type="button" onClick={saveProject}>
            Save Project
          </button>
          <button type="button" onClick={resetCard}>
            <RefreshCcw size={15} />
            Reset
          </button>
        </div>

        <div className="panel-section">
          <h3>Brand</h3>
          <Field label="Company name" value={card.companyName} onChange={(value) => updateCard("companyName", value)} />
          <Field label="Tagline" value={card.tagline} onChange={(value) => updateCard("tagline", value)} />
        </div>

        <div className="panel-section">
          <h3>Person</h3>
          <Field label="Employee name" value={card.employeeName} onChange={(value) => updateCard("employeeName", value)} />
          <Field label="Job title" value={card.jobTitle} onChange={(value) => updateCard("jobTitle", value)} />
        </div>

        <div className="panel-section">
          <h3>Contact</h3>
          <Field label="Phone" value={card.phone} onChange={(value) => updateCard("phone", value)} />
          <Field label="Email" value={card.email} onChange={(value) => updateCard("email", value)} type="email" />
          <Field label="Website" value={card.website} onChange={(value) => updateCard("website", value)} />
          <Field label="Address" value={card.address} onChange={(value) => updateCard("address", value)} />
        </div>

      </aside>

      {mode === "editor" ? (
        <button className="floating-edit" type="button" aria-label="Edit card details" onClick={openEditor}>
          <Edit3 size={20} />
        </button>
      ) : null}

      {mode === "editor" ? (
        <footer className="view-switcher" aria-label="View switcher">
          <button className={view === "front" ? "selected" : ""} type="button" onClick={() => selectView("front")}>
            <span className="view-icon" />
            FRONT VIEW
          </button>
          <button className={view === "back" ? "selected" : ""} type="button" onClick={() => selectView("back")}>
            <span className="view-icon back" />
            BACK VIEW
          </button>
        </footer>
      ) : null}
    </main>
  );
}
