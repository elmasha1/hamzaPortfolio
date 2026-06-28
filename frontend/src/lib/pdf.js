import { jsPDF } from 'jspdf'

/**
 * Generate a print-optimized, ATS-friendly PDF résumé from CV data and trigger
 * a download. Text is real (selectable) — no html2canvas — so it's crisp on
 * paper and reads well. Light background + dark text + blue accents.
 *
 * It's fully data-driven, so the file updates whenever the CV is edited in the
 * dashboard. Filename is derived from the CV name.
 */
const PAGE = { w: 210, h: 297 } // A4 mm
const M = 16 // margin mm
const PT = 0.3528 // pt → mm

const ACCENT = [37, 99, 235]
const HEADING = [15, 23, 42]
const BODY = [71, 85, 105]
const MUTED = [100, 116, 139]
const RULE = [221, 226, 233]

const cleanUrl = (u) =>
  u ? String(u).replace(/^https?:\/\//, '').replace(/\/$/, '') : ''

export function generateCvPdf(cv = {}) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const contentW = PAGE.w - M * 2
  let y = M
  const color = (c) => doc.setTextColor(c[0], c[1], c[2])
  const ensure = (need) => {
    if (y + need > PAGE.h - M) {
      doc.addPage()
      y = M
    }
  }

  const sectionLabel = (label) => {
    ensure(12)
    y += 3.5
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8.5)
    color(ACCENT)
    doc.setCharSpace(0.8)
    doc.text(label.toUpperCase(), M, y)
    doc.setCharSpace(0)
    doc.setDrawColor(ACCENT[0], ACCENT[1], ACCENT[2])
    doc.setLineWidth(0.3)
    doc.line(M, y + 1.8, PAGE.w - M, y + 1.8)
    y += 6.5
  }

  const paragraph = (str, { size = 9.5, c = BODY, lh = 1.45, indent = 0, gap = 0 } = {}) => {
    if (!str) return
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(size)
    color(c)
    const lines = doc.splitTextToSize(String(str), contentW - indent)
    const lineH = size * PT * lh
    for (const ln of lines) {
      ensure(lineH)
      doc.text(ln, M + indent, y)
      y += lineH
    }
    y += gap
  }

  /* ---------------- Header ---------------- */
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  color(HEADING)
  doc.text(cv.name || 'Your Name', M, y + 6)
  y += 11

  if (cv.role) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    color(ACCENT)
    doc.setCharSpace(1)
    doc.text(String(cv.role).toUpperCase(), M, y)
    doc.setCharSpace(0)
    y += 5.5
  }

  const contact = [cv.email, cleanUrl(cv.github), cv.location].filter(Boolean).join('    •    ')
  if (contact) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    color(MUTED)
    doc.text(contact, M, y)
    y += 4.5
  }
  doc.setDrawColor(RULE[0], RULE[1], RULE[2])
  doc.setLineWidth(0.2)
  doc.line(M, y, PAGE.w - M, y)
  y += 1

  /* ---------------- Profile ---------------- */
  if (cv.summary) {
    sectionLabel('Profile')
    paragraph(cv.summary, { gap: 1 })
  }

  /* ---------------- Experience ---------------- */
  if (Array.isArray(cv.experiences) && cv.experiences.length) {
    sectionLabel('Experience')
    cv.experiences.forEach((e) => {
      ensure(12)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10.5)
      color(HEADING)
      doc.text(e.title || '', M, y)
      const dates = [e.start, e.end].filter(Boolean).join(' – ')
      if (dates) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        color(MUTED)
        doc.text(dates, PAGE.w - M, y, { align: 'right' })
      }
      y += 4.6
      if (e.company) {
        doc.setFont('helvetica', 'italic')
        doc.setFontSize(9.5)
        color(ACCENT)
        doc.text(e.company, M, y)
        y += 4.6
      }
      if (e.description) {
        String(e.description)
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean)
          .forEach((b) => {
            doc.setFont('helvetica', 'normal')
            doc.setFontSize(9.5)
            const lines = doc.splitTextToSize(b, contentW - 4)
            const lineH = 9.5 * PT * 1.4
            ensure(lineH)
            color(ACCENT)
            doc.text('•', M, y)
            color(BODY)
            doc.text(lines, M + 4, y)
            y += lineH * lines.length
          })
      }
      y += 3
    })
  }

  /* ---------------- Education ---------------- */
  if (Array.isArray(cv.education) && cv.education.length) {
    sectionLabel('Education')
    cv.education.forEach((ed) => {
      ensure(9)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      color(HEADING)
      doc.text(ed.degree || '', M, y)
      const dates = [ed.start, ed.end].filter(Boolean).join(' – ')
      if (dates) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        color(MUTED)
        doc.text(dates, PAGE.w - M, y, { align: 'right' })
      }
      y += 4.6
      if (ed.school) {
        doc.setFont('helvetica', 'italic')
        doc.setFontSize(9.5)
        color(ACCENT)
        doc.text(ed.school, M, y)
        y += 4.6
      }
      if (ed.description) paragraph(ed.description, { size: 9 })
      y += 2
    })
  }

  /* ---------------- Skills ---------------- */
  if (Array.isArray(cv.skills) && cv.skills.length) {
    sectionLabel('Skills')
    paragraph(cv.skills.join('    •    '), { gap: 1 })
  }

  /* ---------------- Languages ---------------- */
  if (Array.isArray(cv.languages) && cv.languages.length) {
    sectionLabel('Languages')
    const langs = cv.languages
      .map((l) => (l.level ? `${l.name} (${l.level})` : l.name))
      .filter(Boolean)
      .join('    •    ')
    paragraph(langs, { gap: 1 })
  }

  /* ---------------- Certifications ---------------- */
  if (Array.isArray(cv.certifications) && cv.certifications.length) {
    sectionLabel('Certifications')
    cv.certifications.forEach((c) => {
      const line = [c.name, c.issuer, c.year].filter(Boolean).join(' · ')
      paragraph(line, { size: 9.5, indent: 4 })
    })
  }

  const safeName = (cv.name || 'CV')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^A-Za-z0-9-]/g, '')
  doc.save(`${safeName || 'CV'}-CV.pdf`)
}
