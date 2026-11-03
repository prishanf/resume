/**
 * Label markdown / HTML table cells from their column headers.
 * Used so mobile stacked-card CSS can show `content: attr(data-label) ": "`
 * for any column count, instead of hardcoded names.
 */

function walk (node, visit) {
  if (!node || typeof node !== 'object') return
  visit(node)
  const children = node.children
  if (Array.isArray(children)) {
    for (const child of children) walk(child, visit)
  }
}

function isTag (node, tag) {
  if (!node || typeof node !== 'object') return false
  return node.tag === tag || node.tagName === tag
}

export function markdownText (node) {
  if (node == null) return ''
  if (typeof node === 'string') return node
  if (Array.isArray(node)) return node.map(markdownText).join('')
  if (node.type === 'text' || node.type === 'static') return String(node.value ?? '')
  if (typeof node.value === 'string' && !node.children) return String(node.value)
  if (Array.isArray(node.children)) return node.children.map(markdownText).join('')
  return ''
}

export function normalizeHeaderLabel (text) {
  return String(text ?? '').replace(/\s+/g, ' ').trim()
}

function headerCellsFromTable (table) {
  const children = table.children || []
  const thead = children.find((child) => isTag(child, 'thead'))
  if (thead) {
    const tr = (thead.children || []).find((child) => isTag(child, 'tr'))
    return (tr?.children || []).filter((child) => isTag(child, 'th') || isTag(child, 'td'))
  }
  const tbody = children.find((child) => isTag(child, 'tbody'))
  const firstRow = children.find((child) => isTag(child, 'tr')) ||
    (tbody?.children || []).find((child) => isTag(child, 'tr'))
  return (firstRow?.children || []).filter((child) => isTag(child, 'th') || isTag(child, 'td'))
}

function bodyRowsFromTable (table) {
  const children = table.children || []
  const tbody = children.find((child) => isTag(child, 'tbody'))
  if (tbody) return (tbody.children || []).filter((child) => isTag(child, 'tr'))
  const rows = children.filter((child) => isTag(child, 'tr'))
  const hasThead = children.some((child) => isTag(child, 'thead'))
  return hasThead ? rows : rows.slice(1)
}

function setDataLabel (cell, label) {
  if (!cell.props || typeof cell.props !== 'object') cell.props = { ...(cell.props || {}) }
  if (label) cell.props['data-label'] = label
  else delete cell.props['data-label']
}

/**
 * Set `data-label` on each tbody cell from that table's `thead` text.
 * Mutates the Nuxt Content / MDC AST in place (prerender + payload JSON).
 */
export function applyMarkdownTableDataLabels (root) {
  if (!root) return 0
  let count = 0
  walk(root, (node) => {
    if (!isTag(node, 'table')) return
    const headers = headerCellsFromTable(node).map((cell) => normalizeHeaderLabel(markdownText(cell)))
    for (const row of bodyRowsFromTable(node)) {
      const cells = (row.children || []).filter((child) => isTag(child, 'td') || isTag(child, 'th'))
      cells.forEach((cell, index) => {
        setDataLabel(cell, headers[index] || '')
        count++
      })
    }
  })
  return count
}

function hastText (node) {
  if (!node) return ''
  if (node.type === 'text') return String(node.value ?? '')
  if (Array.isArray(node.children)) return node.children.map(hastText).join('')
  return ''
}

function hastChildren (node) {
  return Array.isArray(node?.children) ? node.children : []
}

function hastByTag (nodes, tag) {
  return nodes.filter((child) => child?.type === 'element' && child.tagName === tag)
}

/**
 * Rehype plugin: stamp `data-label` onto body cells during markdown parse
 * so prerendered HTML already has the attributes.
 */
export function rehypeProseTableDataLabels () {
  return (tree) => {
    walk(tree, (node) => {
      if (node?.type !== 'element' || node.tagName !== 'table') return
      const sections = hastChildren(node)
      const thead = hastByTag(sections, 'thead')[0]
      const tbody = hastByTag(sections, 'tbody')[0]
      const headerRow = hastByTag(hastChildren(thead), 'tr')[0] ||
        hastByTag(hastChildren(tbody), 'tr')[0] ||
        hastByTag(sections, 'tr')[0]
      const headers = hastChildren(headerRow)
        .filter((child) => child?.type === 'element' && (child.tagName === 'th' || child.tagName === 'td'))
        .map((cell) => normalizeHeaderLabel(hastText(cell)))
      const bodyRows = tbody
        ? hastByTag(hastChildren(tbody), 'tr')
        : hastByTag(sections, 'tr').slice(thead ? 0 : 1)
      for (const row of bodyRows) {
        if (row === headerRow) continue
        const cells = hastChildren(row)
          .filter((child) => child?.type === 'element' && (child.tagName === 'td' || child.tagName === 'th'))
        cells.forEach((cell, index) => {
          const label = headers[index] || ''
          if (!cell.properties || typeof cell.properties !== 'object') cell.properties = {}
          if (label) {
            cell.properties.dataLabel = label
            cell.properties['data-label'] = label
          } else {
            delete cell.properties.dataLabel
            delete cell.properties['data-label']
          }
        })
      }
    })
  }
}

/**
 * DOM counterpart: read `thead th` (or the first row) and set `data-label`
 * on each body cell. Safe to run more than once.
 */
export function applyProseTableDataLabels (root) {
  if (!root || typeof root.querySelectorAll !== 'function') return 0
  const tables = []
  if (typeof root.matches === 'function' && root.matches('table')) tables.push(root)
  else tables.push(...root.querySelectorAll('table'))

  let count = 0
  for (const table of tables) {
    const headerRow = table.querySelector('thead tr') || table.querySelector('tr')
    if (!headerRow) continue
    const headers = Array.from(headerRow.querySelectorAll('th, td')).map((cell) =>
      normalizeHeaderLabel(cell.textContent)
    )
    const bodyRows = table.tBodies && table.tBodies.length
      ? Array.from(table.tBodies).flatMap((body) => Array.from(body.rows || []))
      : Array.from(table.querySelectorAll('tr')).filter((row) => row !== headerRow)

    for (const row of bodyRows) {
      if (row === headerRow) continue
      const cells = row.querySelectorAll ? row.querySelectorAll('td, th') : []
      Array.from(cells).forEach((cell, index) => {
        const label = headers[index] || ''
        if (label) cell.setAttribute('data-label', label)
        else cell.removeAttribute('data-label')
        count++
      })
    }
  }
  return count
}
