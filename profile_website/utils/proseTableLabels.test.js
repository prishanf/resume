import { describe, expect, it } from 'vitest'
import { parseMarkdown } from '@nuxtjs/mdc/runtime'
import {
  applyMarkdownTableDataLabels,
  applyProseTableDataLabels,
  markdownText,
  normalizeHeaderLabel,
  rehypeProseTableDataLabels
} from './proseTableLabels.js'

function labelsForFirstRow (tree) {
  const table = findTag(tree, 'table')
  const tbody = findTag(table, 'tbody')
  const row = findTag(tbody, 'tr')
  return (row?.children || [])
    .filter((child) => child.tag === 'td' || child.tag === 'th')
    .map((cell) => cell.props?.['data-label'] || '')
}

function findTag (node, tag) {
  if (!node) return null
  if (node.tag === tag || node.tagName === tag) return node
  for (const child of node.children || []) {
    const found = findTag(child, tag)
    if (found) return found
  }
  return null
}

async function labeled (markdown) {
  const parsed = await parseMarkdown(markdown)
  applyMarkdownTableDataLabels(parsed.body)
  return parsed.body
}

describe('normalizeHeaderLabel', () => {
  it('trims and collapses whitespace', () => {
    expect(normalizeHeaderLabel('  Interest   over the term \n')).toBe('Interest over the term')
  })

  it('turns empty / missing values into an empty string', () => {
    expect(normalizeHeaderLabel('')).toBe('')
    expect(normalizeHeaderLabel(null)).toBe('')
    expect(normalizeHeaderLabel(undefined)).toBe('')
  })
})

describe('applyMarkdownTableDataLabels', () => {
  it('copies every thead label onto the matching tbody cell, including 7-column tables', async () => {
    const body = await labeled(`
| Offer | Rate | Term | New P&I | Shock | Interest over the term | Balance at end of term |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| **5-year fixed** | 4.49% | 5 years | **$2,638** | **+$523 (+24.7%)** | $85,485 | $345,987 |
`)
    expect(labelsForFirstRow(body)).toEqual([
      'Offer',
      'Rate',
      'Term',
      'New P&I',
      'Shock',
      'Interest over the term',
      'Balance at end of term'
    ])
    const firstCell = findTag(findTag(findTag(body, 'tbody'), 'tr'), 'td')
    expect(markdownText(firstCell)).toContain('5-year fixed')
  })

  it('uses each table’s own headers, including the original AI-tools comparison columns', async () => {
    const body = await labeled(`
| Aspect | Cline (VS Code extension) | GitHub Copilot (2026 Agent Mode) | Claude Code (CLI + IDE diffing) | Cursor (VS Code fork IDE) |
|--------|----------------------------|-----------------------------------|----------------------------------|----------------------------|
| **Base form factor** | VS Code / fork extension (open-source) | Extension in VS Code | Primarily CLI | Full standalone IDE |
`)
    expect(labelsForFirstRow(body)).toEqual([
      'Aspect',
      'Cline (VS Code extension)',
      'GitHub Copilot (2026 Agent Mode)',
      'Claude Code (CLI + IDE diffing)',
      'Cursor (VS Code fork IDE)'
    ])
  })

  it('labels 2- and 4-column tables too (CSS may still scroll them on mobile)', async () => {
    const two = await labeled(`
| Input | Value |
|-------|--------|
| Rate | 5.2% |
`)
    expect(labelsForFirstRow(two)).toEqual(['Input', 'Value'])

    const four = await labeled(`
| Income type | Take-home | Tax + CPP + EI | Effective rate |
|-------------|-----------|----------------|-----------------|
| Employment | $39,390 | $10,610 | 21.2% |
`)
    expect(labelsForFirstRow(four)).toEqual(['Income type', 'Take-home', 'Tax + CPP + EI', 'Effective rate'])
  })

  it('does not set data-label when the header cell is empty', async () => {
    const body = await labeled(`
| Date | Stock | Bought | Sold | |
| --- | --- | --- | --- | --- |
| Sep 25 | DOL.TO | $546.00 | $549.63 | +$3.63 |
`)
    expect(labelsForFirstRow(body)).toEqual(['Date', 'Stock', 'Bought', 'Sold', ''])
    const row = findTag(findTag(body, 'tbody'), 'tr')
    const last = row.children.filter((child) => child.tag === 'td').at(-1)
    expect(last.props?.['data-label']).toBeUndefined()
  })

  it('labels every table in a document independently', async () => {
    const body = await labeled(`
| A | B | C | D | E |
| --- | --- | --- | --- | --- |
| 1 | 2 | 3 | 4 | 5 |

| Red | Green |
| --- | --- |
| apple | pear |
`)
    const tables = []
    function collect (node) {
      if (node?.tag === 'table') tables.push(node)
      for (const child of node?.children || []) collect(child)
    }
    collect(body)
    expect(tables).toHaveLength(2)
    applyMarkdownTableDataLabels(body)
    expect(tables[0].children.find((c) => c.tag === 'tbody').children[0].children[0].props['data-label']).toBe('A')
    expect(tables[1].children.find((c) => c.tag === 'tbody').children[0].children[0].props['data-label']).toBe('Red')
    expect(tables[1].children.find((c) => c.tag === 'tbody').children[0].children[1].props['data-label']).toBe('Green')
  })
})

describe('rehypeProseTableDataLabels', () => {
  it('stamps data-label during markdown parse so static HTML can include it', async () => {
    const parsed = await parseMarkdown(`
| Offer | Rate | Shock |
| --- | --- | --- |
| 5-year fixed | 4.49% | +$523 |
`, {
      rehype: {
        plugins: {
          'prose-table-data-labels': {
            instance: rehypeProseTableDataLabels
          }
        }
      }
    })
    expect(labelsForFirstRow(parsed.body)).toEqual(['Offer', 'Rate', 'Shock'])
  })
})

describe('applyProseTableDataLabels', () => {
  it('is a no-op without a DOM root', () => {
    expect(applyProseTableDataLabels(null)).toBe(0)
    expect(applyProseTableDataLabels({})).toBe(0)
  })

  it('copies header text onto body cells in a minimal table DOM', () => {
    const cells = []
    function cell (tag, text, isHeader = false) {
      const attrs = {}
      const el = {
        tagName: tag.toUpperCase(),
        textContent: text,
        setAttribute (key, value) { attrs[key] = value },
        removeAttribute (key) { delete attrs[key] },
        getAttribute (key) { return attrs[key] },
        get attrs () { return attrs }
      }
      cells.push({ el, isHeader })
      return el
    }
    const ths = [cell('th', 'Offer', true), cell('th', 'Rate', true), cell('th', 'Shock', true)]
    const tds = [cell('td', '5-year fixed'), cell('td', '4.49%'), cell('td', '+$523')]
    const headerRow = { querySelectorAll: (sel) => sel.includes('th') || sel.includes('td') ? ths : [] }
    const bodyRow = {
      querySelectorAll: (sel) => sel.includes('td') || sel.includes('th') ? tds : []
    }
    const table = {
      matches: (sel) => sel === 'table',
      querySelector (sel) {
        if (sel === 'thead tr' || sel === 'tr') return headerRow
        return null
      },
      querySelectorAll (sel) {
        if (sel === 'table') return [table]
        if (sel === 'tr') return [headerRow, bodyRow]
        return []
      },
      tBodies: [{ rows: [bodyRow] }]
    }
    const count = applyProseTableDataLabels(table)
    expect(count).toBe(3)
    expect(tds[0].getAttribute('data-label')).toBe('Offer')
    expect(tds[1].getAttribute('data-label')).toBe('Rate')
    expect(tds[2].getAttribute('data-label')).toBe('Shock')
  })
})
