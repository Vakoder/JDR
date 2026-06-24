import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { RuleSet } from '../types';

const ACCENT = [232, 168, 56] as [number, number, number]; // amber-500
const BG_DARK = [19, 21, 28] as [number, number, number];
const TEXT_LIGHT = [226, 232, 240] as [number, number, number];
const TEXT_MUTED = [100, 116, 139] as [number, number, number];

function addSection(doc: jsPDF, title: string, y: number): number {
  const pageW = doc.internal.pageSize.getWidth();
  doc.setFillColor(...ACCENT);
  doc.rect(14, y, pageW - 28, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 17, y + 5);
  return y + 12;
}

export function exportToPDF(ruleSet: RuleSet): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();

  // ── Cover page ────────────────────────────────────────────────────────────
  doc.setFillColor(...BG_DARK);
  doc.rect(0, 0, pageW, 297, 'F');

  doc.setFillColor(...ACCENT);
  doc.rect(0, 80, pageW, 60, 'F');

  doc.setTextColor(...TEXT_LIGHT);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text(ruleSet.name, pageW / 2, 115, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...TEXT_MUTED);
  doc.text(`Version ${ruleSet.version}`, pageW / 2, 125, { align: 'center' });

  if (ruleSet.description) {
    doc.setTextColor(...TEXT_LIGHT);
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(ruleSet.description, pageW - 40);
    doc.text(lines, pageW / 2, 165, { align: 'center' });
  }

  doc.setTextColor(...TEXT_MUTED);
  doc.setFontSize(9);
  doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, pageW / 2, 285, { align: 'center' });

  // ── Stats ────────────────────────────────────────────────────────────────
  if (ruleSet.stats.length > 0) {
    doc.addPage();
    let y = 20;
    y = addSection(doc, 'Statistiques', y);
    autoTable(doc, {
      startY: y,
      head: [['Nom', 'Abrév.', 'Défaut', 'Description']],
      body: ruleSet.stats.map((s) => [s.name, s.abbreviation, s.defaultValue, s.description || '—']),
      theme: 'grid',
      headStyles: { fillColor: ACCENT, textColor: [255, 255, 255], fontSize: 9 },
      bodyStyles: { fontSize: 9, textColor: [30, 30, 30] },
      alternateRowStyles: { fillColor: [250, 245, 235] },
    });
  }

  // ── Races ─────────────────────────────────────────────────────────────────
  if (ruleSet.races.length > 0) {
    doc.addPage();
    let y = 20;
    y = addSection(doc, 'Races', y);
    for (const race of ruleSet.races) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(60, 60, 60);
      doc.text(race.name, 14, y + 5);
      y += 10;
      if (race.description) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80, 80, 80);
        const lines = doc.splitTextToSize(race.description, pageW - 28);
        doc.text(lines, 14, y);
        y += lines.length * 5 + 3;
      }
      if (race.statModifiers.length > 0) {
        const mods = race.statModifiers.map((m) => {
          const stat = ruleSet.stats.find((s) => s.id === m.statId);
          return `${stat?.abbreviation ?? m.statId}: ${m.modifier > 0 ? '+' : ''}${m.modifier}`;
        });
        doc.setFontSize(9);
        doc.setTextColor(...ACCENT);
        doc.text(`Modificateurs: ${mods.join(', ')}`, 14, y);
        y += 7;
      }
      if (race.specialRules) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(100, 100, 100);
        const lines = doc.splitTextToSize(`Règles spéciales: ${race.specialRules}`, pageW - 28);
        doc.text(lines, 14, y);
        y += lines.length * 5 + 5;
      }
      y += 5;
      if (y > 260) { doc.addPage(); y = 20; }
    }
  }

  // ── Classes ───────────────────────────────────────────────────────────────
  if (ruleSet.classes.length > 0) {
    doc.addPage();
    let y = 20;
    y = addSection(doc, 'Classes', y);
    for (const cls of ruleSet.classes) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(60, 60, 60);
      doc.text(cls.name, 14, y + 5);
      y += 10;
      if (cls.description) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80, 80, 80);
        const lines = doc.splitTextToSize(cls.description, pageW - 28);
        doc.text(lines, 14, y);
        y += lines.length * 5 + 3;
      }
      if (cls.specialRules) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(100, 100, 100);
        const lines = doc.splitTextToSize(`Règles spéciales: ${cls.specialRules}`, pageW - 28);
        doc.text(lines, 14, y);
        y += lines.length * 5;
      }
      y += 6;
      if (y > 260) { doc.addPage(); y = 20; }
    }
  }

  // ── Items ─────────────────────────────────────────────────────────────────
  if (ruleSet.items.length > 0) {
    doc.addPage();
    let y = 20;
    y = addSection(doc, 'Objets', y);
    autoTable(doc, {
      startY: y,
      head: [['Nom', 'Type', 'Emplacement', 'Poids', 'Valeur', 'Description']],
      body: ruleSet.items.map((item) => [
        item.name,
        item.type,
        item.slot,
        `${item.weight} kg`,
        `${item.value} po`,
        item.description || '—',
      ]),
      theme: 'grid',
      headStyles: { fillColor: ACCENT, textColor: [255, 255, 255], fontSize: 9 },
      bodyStyles: { fontSize: 8, textColor: [30, 30, 30] },
      columnStyles: { 5: { cellWidth: 60 } },
    });
  }

  // ── Skills ────────────────────────────────────────────────────────────────
  if (ruleSet.skills.length > 0) {
    doc.addPage();
    let y = 20;
    y = addSection(doc, 'Compétences', y);
    autoTable(doc, {
      startY: y,
      head: [['Nom', 'Statistique liée', 'Coût', 'Description']],
      body: ruleSet.skills.map((skill) => {
        const stat = ruleSet.stats.find((s) => s.id === skill.linkedStatId);
        const costLabel = skill.costType === 'CUSTOM' ? skill.costTypeCustomName : skill.costType;
        return [skill.name, stat?.name ?? '—', `${skill.cost} ${costLabel}`, skill.description || '—'];
      }),
      theme: 'grid',
      headStyles: { fillColor: ACCENT, textColor: [255, 255, 255], fontSize: 9 },
      bodyStyles: { fontSize: 8, textColor: [30, 30, 30] },
    });
  }

  // ── Characters ────────────────────────────────────────────────────────────
  if (ruleSet.characters.length > 0) {
    doc.addPage();
    let y = 20;
    y = addSection(doc, 'Personnages', y);
    for (const char of ruleSet.characters) {
      const race = ruleSet.races.find((r) => r.id === char.raceId);
      const cls = ruleSet.classes.find((c) => c.id === char.classId);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(60, 60, 60);
      doc.text(`${char.name} (${char.type === 'PC' ? 'PJ' : 'PNJ'})`, 14, y + 5);
      y += 10;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`Race: ${race?.name ?? '—'} | Classe: ${cls?.name ?? '—'}`, 14, y);
      y += 6;
      // stats
      const statEntries = Object.entries(char.stats);
      if (statEntries.length > 0) {
        const statsText = statEntries.map(([sid, val]) => {
          const stat = ruleSet.stats.find((s) => s.id === sid);
          return `${stat?.abbreviation ?? sid}: ${val}`;
        }).join('  ');
        doc.setTextColor(...ACCENT);
        doc.text(statsText, 14, y);
        y += 6;
      }
      y += 5;
      if (y > 260) { doc.addPage(); y = 20; }
    }
  }

  // ── Dice System ───────────────────────────────────────────────────────────
  doc.addPage();
  let y = 20;
  y = addSection(doc, 'Système de résolution', y);
  const ds = ruleSet.diceSystem;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 50, 50);
  doc.text(`Dé utilisé: ${ds.numberOfDice}${ds.diceType}`, 14, y + 5); y += 10;
  doc.text(`Seuil de réussite: ${ds.successThreshold}${ds.higherIsBetter ? ' (plus haut = mieux)' : ' (plus bas = mieux)'}`, 14, y); y += 7;
  doc.text(`Seuil d'échec: ${ds.failureThreshold}`, 14, y); y += 7;
  if (ds.criticalSuccessThreshold !== null) { doc.text(`Réussite critique: ${ds.criticalSuccessThreshold}`, 14, y); y += 7; }
  if (ds.criticalFailureThreshold !== null) { doc.text(`Échec critique: ${ds.criticalFailureThreshold}`, 14, y); y += 7; }
  if (ds.description) {
    y += 3;
    const lines = doc.splitTextToSize(ds.description, pageW - 28);
    doc.text(lines, 14, y);
  }

  // ── Blank character sheet ─────────────────────────────────────────────────
  doc.addPage();
  doc.setFillColor(...BG_DARK);
  doc.rect(0, 0, pageW, 297, 'F');
  doc.setFillColor(...ACCENT);
  doc.rect(0, 0, pageW, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('FICHE DE PERSONNAGE', pageW / 2, 8, { align: 'center' });

  doc.setTextColor(...TEXT_LIGHT);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');

  let py = 22;
  // Name, race, class, type
  [['Nom du personnage', ''], ['Race', ''], ['Classe', ''], ['Type (PJ/PNJ)', '']].forEach(([label]) => {
    doc.text(`${label}:`, 14, py);
    doc.setDrawColor(...TEXT_MUTED);
    doc.line(40, py, pageW / 2 - 5, py);
    py += 8;
  });

  py += 4;
  y = addSection(doc, 'Statistiques', py);
  py = y;
  const cols = 3;
  ruleSet.stats.forEach((stat, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = 14 + col * (pageW / cols);
    const yPos = py + row * 12;
    doc.setTextColor(...TEXT_MUTED);
    doc.text(`${stat.abbreviation}:`, x, yPos);
    doc.setDrawColor(...TEXT_MUTED);
    doc.line(x + 12, yPos, x + 40, yPos);
    doc.setTextColor(...TEXT_LIGHT);
    doc.setFontSize(7);
    doc.setFontSize(9);
  });
  py += Math.ceil(ruleSet.stats.length / cols) * 12 + 8;

  if (py < 260) {
    addSection(doc, 'Notes', py);
  }

  doc.save(`${slugify(ruleSet.name)}_v${ruleSet.version}.pdf`);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}
