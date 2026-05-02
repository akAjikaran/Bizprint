import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import { AtSign, Globe2, MapPin, Phone, Ruler } from "lucide-react";
import type { CardData, TemplateId } from "../lib/card-data";

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

export function FrontCard({
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

export function BackCard({
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


export function CardSection({
  id,
  title,
  active,
  children,
}: {
  id: string;
  title: string;
  active: boolean;
  children: ReactNode;
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


