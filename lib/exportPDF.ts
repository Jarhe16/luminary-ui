import { jsPDF } from 'jspdf';

type Finding = {
  rule_id: string;
  clause_found: string;
  variance: string;
  severity: 'HIGH' | 'MED' | 'LOW';
};

type AuditResult = {
  status: string;
  findings: Finding[];
};

const COLORS = {
  background: [13, 15, 26],
  surface:    [19, 23, 43],
  accent:     [201, 168, 76],
  foreground: [232, 234, 240],
  muted:      [107, 114, 128],
  high:       [231, 76,  60],
  med:        [230, 126, 34],
  low:        [39,  174, 96],
  white:      [255, 255, 255],
  lightGray:  [240, 242, 248],
  border:     [37,  42,  69],
} as const;

const SEV_COLOR: Record<string, readonly number[]> = {
  HIGH: COLORS.high,
  MED:  COLORS.med,
  LOW:  COLORS.low,
};

function setFill(doc: jsPDF, color: readonly number[]) {
  doc.setFillColor(color[0], color[1], color[2]);
}

function setTextColor(doc: jsPDF, color: readonly number[]) {
  doc.setTextColor(color[0], color[1], color[2]);
}

function setDrawColor(doc: jsPDF, color: readonly number[]) {
  doc.setDrawColor(color[0], color[1], color[2]);
}

// Wrap text and return lines
function wrapText(doc: jsPDF, text: string, maxWidth: number): string[] {
  return doc.splitTextToSize(text, maxWidth);
}

export function generateAuditPDF(
  result: AuditResult,
  filename: string,
  userName?: string
): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const W = 210;
  const H = 297;
  const margin = 16;
  const contentW = W - margin * 2;

  let y = 0;

  // ── Header background ──────────────────────────────────────────────
  setFill(doc, COLORS.background);
  doc.rect(0, 0, W, 42, 'F');

  // Gold accent bar
  setFill(doc, COLORS.accent);
  doc.rect(0, 0, 4, 42, 'F');

  // Brand name
  setTextColor(doc, COLORS.accent);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('LUMINARY FINANCIAL', margin, 14);

  // Subtitle
  setTextColor(doc, COLORS.muted);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('COMPLIANCE INTELLIGENCE PLATFORM  ·  ICM METHOD', margin, 20);

  // Report title
  setTextColor(doc, COLORS.foreground);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('RIA COMPLIANCE AUDIT REPORT', margin, 30);

  // Date + user on right side
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  setTextColor(doc, COLORS.muted);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(dateStr, W - margin, 14, { align: 'right' });
  if (userName) {
    doc.text(`Prepared for: ${userName}`, W - margin, 20, { align: 'right' });
  }

  y = 52;

  // ── Document metadata ──────────────────────────────────────────────
  setFill(doc, COLORS.lightGray);
  doc.roundedRect(margin, y, contentW, 18, 2, 2, 'F');

  setTextColor(doc, COLORS.muted);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('DOCUMENT', margin + 4, y + 5.5);
  doc.text('STATUS', margin + contentW / 2, y + 5.5);

  setTextColor(doc, COLORS.background);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(filename, margin + 4, y + 12.5);

  const statusColor = result.findings.length === 0 ? COLORS.low : COLORS.high;
  setTextColor(doc, statusColor);
  doc.text(result.status, margin + contentW / 2, y + 12.5);

  y += 26;

  // ── Summary cards ──────────────────────────────────────────────────
  const counts = { HIGH: 0, MED: 0, LOW: 0 };
  result.findings.forEach(f => { counts[f.severity]++; });

  const cardW = (contentW - 8) / 3;
  const sevKeys: Array<'HIGH' | 'MED' | 'LOW'> = ['HIGH', 'MED', 'LOW'];
  const sevLabels = { HIGH: 'HIGH RISK', MED: 'MEDIUM RISK', LOW: 'LOW RISK' };

  sevKeys.forEach((sev, i) => {
    const cx = margin + i * (cardW + 4);
    const color = SEV_COLOR[sev];

    // Card bg
    setFill(doc, COLORS.lightGray);
    doc.roundedRect(cx, y, cardW, 22, 2, 2, 'F');

    // Left accent bar
    setFill(doc, color);
    doc.roundedRect(cx, y, 3, 22, 1, 1, 'F');

    // Count
    setTextColor(doc, color);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text(String(counts[sev]), cx + 10, y + 13);

    // Label
    setTextColor(doc, COLORS.muted);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.text(sevLabels[sev], cx + 10, y + 19);
  });

  y += 30;

  // ── Clean bill or findings ─────────────────────────────────────────
  if (result.findings.length === 0) {
    setFill(doc, [232, 248, 238]);
    doc.roundedRect(margin, y, contentW, 20, 2, 2, 'F');
    setFill(doc, COLORS.low);
    doc.roundedRect(margin, y, 3, 20, 1, 1, 'F');
    setTextColor(doc, COLORS.low);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('✓  No compliance violations detected.', margin + 8, y + 8);
    setTextColor(doc, [39, 100, 60]);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Document passes all active RIA compliance rules.', margin + 8, y + 14.5);
    y += 28;
  } else {
    // Section header
    setTextColor(doc, COLORS.muted);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text('FINDINGS', margin, y);
    setDrawColor(doc, COLORS.border);
    doc.setLineWidth(0.3);
    doc.line(margin + 22, y - 1, W - margin, y - 1);
    y += 6;

    result.findings.forEach((finding, idx) => {
      const color = SEV_COLOR[finding.severity] ?? COLORS.muted;

      // Estimate block height
      const clauseLines = wrapText(doc, `"${finding.clause_found}"`, contentW - 20);
      const varianceLines = wrapText(doc, finding.variance, contentW - 20);
      const blockH = 10 + clauseLines.length * 4.5 + 4 + varianceLines.length * 4.5 + 10;

      // Page break if needed
      if (y + blockH > H - 20) {
        doc.addPage();
        y = 20;
      }

      // Card background
      setFill(doc, COLORS.lightGray);
      doc.roundedRect(margin, y, contentW, blockH, 2, 2, 'F');

      // Left severity bar
      setFill(doc, color);
      doc.roundedRect(margin, y, 3.5, blockH, 1, 1, 'F');

      // Finding number + rule ID
      setTextColor(doc, COLORS.muted);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text(`Finding ${idx + 1}`, margin + 8, y + 6);

      setTextColor(doc, COLORS.background);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.text(finding.rule_id, margin + 8, y + 12);

      // Severity badge
      setFill(doc, color);
      const badgeX = W - margin - 28;
      doc.roundedRect(badgeX, y + 5, 26, 7, 1, 1, 'F');
      setTextColor(doc, COLORS.white);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.text(finding.severity === 'MED' ? 'MEDIUM' : finding.severity, badgeX + 13, y + 10, { align: 'center' });

      let innerY = y + 18;

      // Clause label
      setTextColor(doc, COLORS.muted);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.text('CLAUSE IDENTIFIED', margin + 8, innerY);
      innerY += 4.5;

      // Clause text
      setTextColor(doc, [80, 90, 120]);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      clauseLines.forEach((line: string) => {
        doc.text(line, margin + 8, innerY);
        innerY += 4.5;
      });

      innerY += 2;

      // Variance label
      setTextColor(doc, COLORS.muted);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.text('VARIANCE', margin + 8, innerY);
      innerY += 4.5;

      // Variance text
      setTextColor(doc, [60, 70, 100]);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      varianceLines.forEach((line: string) => {
        doc.text(line, margin + 8, innerY);
        innerY += 4.5;
      });

      y += blockH + 5;
    });
  }

  // ── Footer on each page ────────────────────────────────────────────
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    setFill(doc, COLORS.background);
    doc.rect(0, H - 12, W, 12, 'F');

    setTextColor(doc, COLORS.muted);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.text('Luminary Financial · Compliance Intelligence Platform · Confidential', margin, H - 5);
    doc.text(`Page ${i} of ${pageCount}`, W - margin, H - 5, { align: 'right' });
  }

  // ── Save ───────────────────────────────────────────────────────────
  const safeName = filename.replace(/\.[^/.]+$/, '').replace(/[^a-z0-9]/gi, '_');
  const dateTag = new Date().toISOString().slice(0, 10);
  doc.save(`luminary_audit_${safeName}_${dateTag}.pdf`);
}
