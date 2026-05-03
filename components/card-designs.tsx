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

  if (template === "orange-curve") {
    const gradientIdPrefix = exportId ?? "orange-curve-front-preview";
    const contactRows = [
      { icon: MapPin, label: card.address },
      { icon: AtSign, label: card.email },
      { icon: Globe2, label: card.website },
      { icon: Phone, label: card.phone },
    ];

    return (
      <div className="card-stage" aria-label="Front business card design">
        <TrimMark />
        <div id={exportId} className="business-card front-card template-orange-curve orange-curve-front" style={cardStyle}>
          <OrangeCurveFrontArtwork gradientIdPrefix={gradientIdPrefix} />
          <div className="orange-front-content">
            <div>
              <h2>{card.employeeName}</h2>
              <p>{card.jobTitle}</p>
            </div>
            <div className="orange-contact-list">
              {contactRows.map(({ icon: Icon, label }, index) => (
                <div className="orange-contact-row" key={`${label}-${index}`}>
                  <span>
                    <Icon size={13} strokeWidth={2.1} />
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

  if (template === "blue-ribbon") {
    const gradientIdPrefix = exportId ?? "blue-ribbon-front-preview";

    return (
      <div className="card-stage" aria-label="Front business card design">
        <TrimMark />
        <div id={exportId} className="business-card front-card template-blue-ribbon blue-ribbon-front" style={cardStyle}>
          <BlueRibbonFrontArtwork gradientIdPrefix={gradientIdPrefix} />
          <div className={card.companyLogo ? "blue-ribbon-logo uploaded-logo" : "blue-ribbon-logo"}>
            {card.companyLogo ? (
              <Image src={card.companyLogo} alt={`${card.companyName} logo`} fill sizes="132px" unoptimized />
            ) : (
              <>
                <span>LOGO</span>
                <strong>{card.companyName}</strong>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (template === "red-chevron") {
    return (
      <div className="card-stage" aria-label="Front business card design">
        <TrimMark />
        <div id={exportId} className="business-card front-card template-red-chevron red-chevron-front" style={cardStyle}>
          <div className={card.companyLogo ? "red-chevron-logo uploaded-logo" : "red-chevron-logo"}>
            {card.companyLogo ? (
              <Image src={card.companyLogo} alt={`${card.companyName} logo`} fill sizes="132px" unoptimized />
            ) : (
              <>
                <span>LOGO</span>
                <strong>{card.companyName}</strong>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (template === "gold-corners") {
    return (
      <div className="card-stage" aria-label="Front business card design">
        <TrimMark />
        <div id={exportId} className="business-card front-card template-gold-corners gold-corners-front" style={cardStyle}>
          <div className="gold-corner gold-corner-top" aria-hidden="true">
            <span />
          </div>
          <div className="gold-corner gold-corner-bottom" aria-hidden="true">
            <span />
          </div>
          <div className={card.companyLogo ? "gold-corners-logo uploaded-logo" : "gold-corners-logo"}>
            {card.companyLogo ? (
              <Image src={card.companyLogo} alt={`${card.companyName} logo`} fill sizes="132px" unoptimized />
            ) : (
              <>
                <span>LOGO</span>
                <strong>{card.companyName}</strong>
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

function OrangeCurveFrontArtwork({ gradientIdPrefix }: { gradientIdPrefix: string }) {
  const primaryGradientId = `${gradientIdPrefix}-primary-gradient`;

  return (
    <svg
      className="orange-curve-artwork"
      viewBox="0 0 263 151"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="none"
    >
      <rect width="263" height="151" fill="white" />
      <path
        d="M133.257 142.083C59.0499 146.983 8.33018 117.182 -1 116.588V152H264V59C255.068 74.1768 207.464 137.183 133.257 142.083Z"
        fill={`url(#${primaryGradientId})`}
      />
      <path d="M174.022 152C225.994 141.651 254.624 112.821 264 98.5L264 152H174.022Z" fill="#ff9939" />
      <defs>
        <linearGradient id={primaryGradientId} x1="131.046" y1="86.422" x2="131.046" y2="150.974" gradientUnits="userSpaceOnUse">
          <stop stopColor="#960c4b" />
          <stop offset="1" stopColor="#960c4d" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function OrangeCurveBackArtwork({ gradientIdPrefix }: { gradientIdPrefix: string }) {
  const primaryGradientId = `${gradientIdPrefix}-primary-gradient`;

  return (
    <svg
      className="orange-curve-artwork"
      viewBox="0 0 263 151"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="none"
    >
      <rect width="263" height="151" fill="white" />
      <path
        d="M244.033 161.321C400.9 171.68 508.118 108.682 525.676 107.428V180.116H-29V-12.5C-13.4653 17.7731 87.1664 150.962 244.033 161.321Z"
        fill={`url(#${primaryGradientId})`}
      />
      <path d="M145.704 160.5C59.4667 144.711 11.9602 96.8736 -1.5 74.5L-1.5 160.5H145.704Z" fill="#ff9939" />
      <path d="M145.704 -22.5C231.942 -6.58778 279.448 41.25 293 63.5L293 -22.5L145.704 -22.5Z" fill="#ff9939" />
      <defs>
        <linearGradient id={primaryGradientId} x1="248.706" y1="43.6584" x2="248.706" y2="180.116" gradientUnits="userSpaceOnUse">
          <stop stopColor="#960c4b" />
          <stop offset="1" stopColor="#960c4d" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function BlueRibbonFrontArtwork({ gradientIdPrefix }: { gradientIdPrefix: string }) {
  const topGradientId = `${gradientIdPrefix}-top-gradient`;
  const bottomGradientId = `${gradientIdPrefix}-bottom-gradient`;

  return (
    <svg
      className="blue-ribbon-artwork"
      viewBox="0 0 263 151"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="none"
    >
      <rect width="263" height="151" fill="white" />
      <path d="M97.0492 21.0118L184.301 0H-8.00932V15.6698C-1.48027 15.7886 18.0594 17.0232 43.9857 21.0118C69.912 25.0004 90.164 22.6737 97.0492 21.0118Z" fill="#ffbf1a" />
      <path d="M168.493 129.483L81.2412 150.495H273.551V134.825C267.022 134.706 247.483 133.472 221.556 129.483C195.63 125.494 175.378 127.821 168.493 129.483Z" fill="#ffbf1a" />
      <path d="M93.5179 18.6836L171.101 0H0.100998V13.9336C5.90656 14.0391 23.281 15.1369 46.3344 18.6836C69.3878 22.2302 87.3956 20.1613 93.5179 18.6836Z" fill={`url(#${topGradientId})`} />
      <path d="M172.024 131.811L94.4409 150.495H265.441V136.561C259.635 136.456 242.261 135.358 219.208 131.811C196.154 128.265 178.146 130.334 172.024 131.811Z" fill={`url(#${bottomGradientId})`} />
      <defs>
        <linearGradient id={topGradientId} x1="171.101" y1="1.55981" x2="35.2538" y2="50.1306" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2f88f2" />
          <stop offset="1" stopColor="#005dbf" />
        </linearGradient>
        <linearGradient id={bottomGradientId} x1="94.4409" y1="148.935" x2="230.288" y2="100.364" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2f88f2" />
          <stop offset="1" stopColor="#005dbf" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function BlueRibbonBackArtwork({ gradientIdPrefix }: { gradientIdPrefix: string }) {
  const topGradientId = `${gradientIdPrefix}-top-gradient`;
  const bottomGradientId = `${gradientIdPrefix}-bottom-gradient`;

  return (
    <svg
      className="blue-ribbon-artwork"
      viewBox="0 0 263 151"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="none"
    >
      <rect width="263" height="151" fill="white" />
      <path d="M164.048 129.251L75.8311 150.495H270.269V134.652C263.668 134.532 243.912 133.283 217.699 129.251C191.485 125.218 171.009 127.57 164.048 129.251Z" fill="#ffbf1a" />
      <path d="M95.1364 57.8523C74.3491 62.3715 22.0802 55.9693 -1.45581 52.2034V2.39893H262.069V16.4268C215.086 28.3523 115.924 53.3331 95.1364 57.8523Z" fill="#ffbf1a" />
      <path d="M96.5922 53.7547C75.8049 58.2738 23.536 51.8717 0 48.1057V-1.69873H263.524V12.3292C216.542 24.2547 117.379 49.2355 96.5922 53.7547Z" fill={`url(#${topGradientId})`} />
      <path d="M167.618 131.605L89.1768 150.495H262.069V136.407C256.199 136.301 238.632 135.191 215.324 131.605C192.015 128.019 173.808 130.111 167.618 131.605Z" fill={`url(#${bottomGradientId})`} />
      <defs>
        <linearGradient id={topGradientId} x1="0" y1="51.0016" x2="227.075" y2="5.69826" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2f88f2" />
          <stop offset="1" stopColor="#005dbf" />
        </linearGradient>
        <linearGradient id={bottomGradientId} x1="89.1768" y1="148.918" x2="226.527" y2="99.8098" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2f88f2" />
          <stop offset="1" stopColor="#005dbf" />
        </linearGradient>
      </defs>
    </svg>
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

  if (template === "orange-curve") {
    const gradientIdPrefix = exportId ?? "orange-curve-back-preview";

    return (
      <div className="card-stage" aria-label="Back business card design">
        <TrimMark />
        <div id={exportId} className="business-card back-card template-orange-curve orange-curve-back" style={cardStyle}>
          <OrangeCurveBackArtwork gradientIdPrefix={gradientIdPrefix} />
          <div className={card.companyLogo ? "orange-logo uploaded-logo" : "orange-logo"}>
            {card.companyLogo ? (
              <Image src={card.companyLogo} alt={`${card.companyName} logo`} fill sizes="120px" unoptimized />
            ) : (
              <>
                <span>LOGO</span>
                <strong>{card.companyName}</strong>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (template === "blue-ribbon") {
    const gradientIdPrefix = exportId ?? "blue-ribbon-back-preview";
    const contactRows = [
      { icon: MapPin, label: card.address },
      { icon: AtSign, label: card.email },
      { icon: Globe2, label: card.website },
      { icon: Phone, label: card.phone },
    ];

    return (
      <div className="card-stage" aria-label="Back business card design">
        <TrimMark />
        <div id={exportId} className="business-card back-card template-blue-ribbon blue-ribbon-back" style={cardStyle}>
          <BlueRibbonBackArtwork gradientIdPrefix={gradientIdPrefix} />
          <div className="blue-ribbon-contact-content">
            <div>
              <h2>{card.employeeName}</h2>
              <p>{card.jobTitle}</p>
            </div>
            <div className="blue-ribbon-contact-list">
              {contactRows.map(({ icon: Icon, label }, index) => (
                <div className="blue-ribbon-contact-row" key={`${label}-${index}`}>
                  <span>
                    <Icon size={13} strokeWidth={2.1} />
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

  if (template === "red-chevron") {
    const contactRows = [
      { icon: MapPin, label: card.address },
      { icon: AtSign, label: card.email },
      { icon: Globe2, label: card.website },
      { icon: Phone, label: card.phone },
    ];

    return (
      <div className="card-stage" aria-label="Back business card design">
        <TrimMark />
        <div id={exportId} className="business-card back-card template-red-chevron red-chevron-back" style={cardStyle}>
          <div className="red-chevron-panel" aria-hidden="true" />
          <div className="red-chevron-contact-list">
            {contactRows.map(({ icon: Icon, label }, index) => (
              <div className="red-chevron-contact-row" key={`${label}-${index}`}>
                <span>
                  <Icon size={13} strokeWidth={2.1} />
                </span>
                <strong>{label}</strong>
              </div>
            ))}
          </div>
          <div className="red-chevron-profile">
            <h2>{card.employeeName}</h2>
            <p>{card.jobTitle}</p>
          </div>
        </div>
      </div>
    );
  }

  if (template === "gold-corners") {
    const contactRows = [
      { icon: MapPin, label: card.address },
      { icon: AtSign, label: card.email },
      { icon: Globe2, label: card.website },
      { icon: Phone, label: card.phone },
    ];

    return (
      <div className="card-stage" aria-label="Back business card design">
        <TrimMark />
        <div id={exportId} className="business-card back-card template-gold-corners gold-corners-back" style={cardStyle}>
          <div className="gold-corner gold-corner-top" aria-hidden="true">
            <span />
          </div>
          <div className="gold-corners-contact-content">
            <div>
              <h2>{card.employeeName}</h2>
              <p>{card.jobTitle}</p>
            </div>
            <div className="gold-corners-contact-list">
              {contactRows.map(({ icon: Icon, label }, index) => (
                <div className="gold-corners-contact-row" key={`${label}-${index}`}>
                  <span>
                    <Icon size={13} strokeWidth={2.1} />
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


