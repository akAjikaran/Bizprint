"use client";

import { useState, type CSSProperties } from "react";
import { BackCard, CardSection, FrontCard } from "./card-designs";
import { businessWhatsAppNumber, pricingOptions, sampleCard, templates, type CardData, type SavedProject, type TemplateId } from "../lib/card-data";

export function TemplateGallery({
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
          <article
            className="template-card"
            key={template.id}
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
            <button
              className="template-card-action"
              type="button"
              onClick={() => onApply(template.id)}
              aria-label={`Edit ${template.name} business card template`}
            />
          </article>
        ))}
      </div>
    </section>
  );
}

export function SavedProjectsPanel({
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

export function PreviewPanel({
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

export function OrderSummary({
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


