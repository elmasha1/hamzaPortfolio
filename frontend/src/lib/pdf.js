import { jsPDF } from 'jspdf'

/**
 * Generate a professional, ATS-friendly A4 résumé from CV data and download it.
 *
 * - Real, selectable text (no html2canvas) → crisp on paper, parseable by ATS.
 * - Two columns: a left sidebar (grouped skills / languages / certifications)
 *   and a main column (profile / experience / projects / education).
 * - Embeds the profile photo (rounded square, top-right) when available.
 * - Monochrome / premium: black headings, grey body, hairline rules — matching
 *   the portfolio brand. Fully data-driven, so it always reflects the dashboard.
 * - The main column paginates onto full-width pages if content is long.
 */
const PAGE = { w: 210, h: 297 } // A4 mm
const M = 15 // margin
const PT = 0.3528 // pt → mm
const GAP = 8 // gap between columns
const SIDEBAR_W = 55

const INK = [20, 20, 20]
const BODY = [70, 70, 70]
const MUTED = [125, 125, 125]
const RULE = [219, 219, 219]

const cleanUrl = (u) =>
  u ? String(u).replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '') : ''

/* Fetch the photo as a base64 data-URI from the API. Locally-stored uploads
   under /storage carry no CORS headers, so drawing them on the canvas directly
   would fail — the API inlines the bytes instead (see GET /api/cv/photo). */
async function fetchPhotoDataUri(fallbackUrl) {
  try {
    const { default: api } = await import('./api')
    const { data } = await api.get('/cv/photo')
    return data?.data?.photo || fallbackUrl || null
  } catch {
    return fallbackUrl || null
  }
}

/* Load a photo and return a square-cropped JPEG data URL (or null on failure /
   cross-origin taint — the CV then falls back to no photo gracefully). */
function loadPhoto(url) {
  return new Promise((resolve) => {
    if (!url) return resolve(null)
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      try {
        const S = 512
        const c = document.createElement('canvas')
        c.width = c.height = S
        const ctx = c.getContext('2d')
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, S, S)
        const side = Math.min(img.naturalWidth, img.naturalHeight)
        const sx = (img.naturalWidth - side) / 2
        const sy = (img.naturalHeight - side) / 2
        ctx.drawImage(img, sx, sy, side, side, 0, 0, S, S)
        resolve(c.toDataURL('image/jpeg', 0.92))
      } catch {
        resolve(null)
      }
    }
    img.onerror = () => resolve(null)
    img.src = url
  })
}

export async function generateCvPdf(cv = {}) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true })
  const color = (c) => doc.setTextColor(c[0], c[1], c[2])
  const draw = (c) => doc.setDrawColor(c[0], c[1], c[2])

  const photo = await loadPhoto(await fetchPhotoDataUri(cv.photo))

  /* ------------------------------ Header ------------------------------ */
  const photoSize = 26
  const hasPhoto = !!photo
  const textRight = hasPhoto ? PAGE.w - M - photoSize - 8 : PAGE.w - M
  let y = M + 4

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(23)
  color(INK)
  doc.text(cv.name || 'Your Name', M, y + 3)
  y += 9

  if (cv.role) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9.5)
    color(MUTED)
    doc.setCharSpace(0.5)
    doc.text(String(cv.role).toUpperCase(), M, y)
    doc.setCharSpace(0)
    y += 5
  }
  if (cv.tagline) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9.5)
    color(BODY)
    const lines = doc.splitTextToSize(cv.tagline, textRight - M)
    doc.text(lines, M, y)
    y += lines.length * (9.5 * PT * 1.35)
  }

  if (hasPhoto) {
    const px = PAGE.w - M - photoSize
    const py = M
    doc.addImage(photo, 'JPEG', px, py, photoSize, photoSize, undefined, 'FAST')
    draw(RULE)
    doc.setLineWidth(0.3)
    doc.roundedRect(px, py, photoSize, photoSize, 2, 2)
    y = Math.max(y, py + photoSize + 1)
  }

  y += 3
  const contact = [
    cv.email,
    cv.phone,
    cv.location,
    cleanUrl(cv.website),
    cleanUrl(cv.github),
    cleanUrl(cv.linkedin),
  ]
    .filter(Boolean)
    .join('   |   ')
  if (contact) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    color(BODY)
    const lines = doc.splitTextToSize(contact, PAGE.w - M * 2)
    doc.text(lines, M, y)
    y += lines.length * (8.5 * PT * 1.45)
  }

  y += 1.5
  draw(INK)
  doc.setLineWidth(0.5)
  doc.line(M, y, PAGE.w - M, y)
  const bodyTop = y + 7

  /* ------------------------------ Columns ----------------------------- */
  const side = { x: M, w: SIDEBAR_W, y: bodyTop }
  const mainX0 = M + SIDEBAR_W + GAP
  const main = { x: mainX0, w: PAGE.w - M - mainX0, y: bodyTop }

  // vertical hairline divider between the columns (page 1 only)
  draw(RULE)
  doc.setLineWidth(0.2)
  doc.line(M + SIDEBAR_W + GAP / 2, bodyTop - 1, M + SIDEBAR_W + GAP / 2, PAGE.h - M)

  const heading = (col, label) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    color(INK)
    doc.setCharSpace(0.7)
    doc.text(label.toUpperCase(), col.x, col.y)
    doc.setCharSpace(0)
    draw(INK)
    doc.setLineWidth(0.4)
    doc.line(col.x, col.y + 1.6, col.x + col.w, col.y + 1.6)
    col.y += 6.5
  }

  const para = (col, str, { size = 9, c = BODY, lh = 1.4, bold = false, italic = false, gap = 0, indent = 0 } = {}) => {
    if (!str) return
    doc.setFont('helvetica', bold ? 'bold' : italic ? 'italic' : 'normal')
    doc.setFontSize(size)
    color(c)
    const lines = doc.splitTextToSize(String(str), col.w - indent)
    const lineH = size * PT * lh
    for (const ln of lines) {
      doc.text(ln, col.x + indent, col.y)
      col.y += lineH
    }
    col.y += gap
  }

  // Main paginates to a full-width page when it overflows.
  const ensureMain = (need) => {
    if (main.y + need > PAGE.h - M) {
      doc.addPage()
      main.y = M + 2
      main.x = M
      main.w = PAGE.w - M * 2
    }
  }

  /* ----------------------------- Sidebar ------------------------------ */
  const groups = Array.isArray(cv.skill_groups) && cv.skill_groups.length ? cv.skill_groups : null
  heading(side, 'Skills')
  if (groups) {
    groups.forEach((g) => {
      para(side, g.label, { size: 8.5, bold: true, c: INK, gap: 0.6 })
      para(side, (g.items || []).join(', '), { size: 8.5, c: BODY, gap: 3 })
    })
  } else if (Array.isArray(cv.skills) && cv.skills.length) {
    para(side, cv.skills.join(', '), { size: 8.5, gap: 3 })
  }

  if (Array.isArray(cv.languages) && cv.languages.length) {
    side.y += 3
    heading(side, 'Languages')
    cv.languages.forEach((l) =>
      para(side, l.level ? `${l.name} — ${l.level}` : l.name, { size: 8.5, gap: 1.6 })
    )
  }

  if (Array.isArray(cv.certifications) && cv.certifications.length) {
    side.y += 3
    heading(side, 'Certifications')
    cv.certifications.forEach((c) =>
      para(side, [c.name, c.issuer, c.year].filter(Boolean).join(' · '), { size: 8.5, gap: 1.6 })
    )
  }

  /* ------------------------------- Main ------------------------------- */
  if (cv.summary) {
    heading(main, 'Profile')
    para(main, cv.summary, { gap: 3.5, lh: 1.45 })
  }

  if (Array.isArray(cv.experiences) && cv.experiences.length) {
    heading(main, 'Experience')
    cv.experiences.forEach((e) => {
      ensureMain(16)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      color(INK)
      doc.text(e.title || '', main.x, main.y)
      const dates = [e.start, e.end].filter(Boolean).join(' – ')
      if (dates) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8.5)
        color(MUTED)
        doc.text(dates, main.x + main.w, main.y, { align: 'right' })
      }
      main.y += 4.4
      if (e.company) {
        doc.setFont('helvetica', 'italic')
        doc.setFontSize(9)
        color(BODY)
        doc.text(e.company, main.x, main.y)
        main.y += 4.4
      }
      String(e.description || '')
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((b) => {
          doc.setFont('helvetica', 'normal')
          doc.setFontSize(9)
          const lines = doc.splitTextToSize(b, main.w - 4)
          const lineH = 9 * PT * 1.4
          ensureMain(lineH * lines.length)
          color(INK)
          doc.text('•', main.x, main.y)
          color(BODY)
          doc.text(lines, main.x + 4, main.y)
          main.y += lineH * lines.length
        })
      main.y += 3.5
    })
  }

  if (Array.isArray(cv.projects) && cv.projects.length) {
    main.y += 1
    heading(main, 'Key Projects')
    cv.projects.forEach((p) => {
      ensureMain(13)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9.5)
      color(INK)
      doc.text(p.name || '', main.x, main.y)
      if (p.link) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        color(MUTED)
        doc.text(cleanUrl(p.link), main.x + main.w, main.y, { align: 'right' })
      }
      main.y += 4.2
      if (p.description) para(main, p.description, { size: 9, gap: 0.8 })
      if (p.tech) para(main, p.tech, { size: 8, c: MUTED, italic: true, gap: 3 })
    })
  }

  if (Array.isArray(cv.education) && cv.education.length) {
    main.y += 1
    heading(main, 'Education')
    cv.education.forEach((ed) => {
      ensureMain(11)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9.5)
      color(INK)
      doc.text(ed.degree || '', main.x, main.y)
      const dates = [ed.start, ed.end].filter(Boolean).join(' – ')
      if (dates) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8.5)
        color(MUTED)
        doc.text(dates, main.x + main.w, main.y, { align: 'right' })
      }
      main.y += 4.2
      if (ed.school) {
        doc.setFont('helvetica', 'italic')
        doc.setFontSize(9)
        color(BODY)
        doc.text(ed.school, main.x, main.y)
        main.y += 4.2
      }
      if (ed.description) para(main, ed.description, { size: 8.5, gap: 1 })
      main.y += 2.5
    })
  }

  const safeName = (cv.name || 'CV').trim().replace(/\s+/g, '-').replace(/[^A-Za-z0-9-]/g, '')
  doc.save(`${safeName || 'CV'}-CV.pdf`)
}
