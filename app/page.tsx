"use client";

import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { toJpeg, toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import Image from "next/image";
import { ChevronDown, Download, Edit3, Printer, RefreshCcw, Ruler, Share2, Redo2, X, Undo2 } from "lucide-react";
import { BackCard, CardSection, FrontCard } from "../components/card-designs";
import { Field } from "../components/field";
import { OrderSummary, PreviewPanel, SavedProjectsPanel, TemplateGallery } from "../components/panels";
import { initialCard, savedProjectsKey, type AppMode, type CardData, type DesignPalette, type DownloadFormat, type SavedProject, type TemplateId, type ViewMode } from "../lib/card-data";
import { buildSuggestedPalettes, getColorScore, rgbToHex } from "../lib/color-palette";

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
    window.history.replaceState(null, "", "#editor");
    window.setTimeout(() => {
      document.getElementById("editor-workspace")?.scrollIntoView({
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
            <section id="editor-workspace" className="editor-top-controls" aria-label="Logo and color controls">
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
