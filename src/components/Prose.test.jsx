import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import Prose, { inline, parse } from './Prose'

describe('Prose parser', () => {
  it('joins paragraph lines and separates paragraphs at blank lines', () => {
    expect(parse('  First line  \nsecond line\n\n\nLast paragraph\n')).toEqual([
      { type: 'p', text: 'First line second line' },
      { type: 'p', text: 'Last paragraph' },
    ])
    expect(parse(' \n\n')).toEqual([])
  })

  it.each([
    ['-', false], ['1.', true],
  ])('parses a %s list immediately after an intro line', (marker, ordered) => {
    const next = ordered ? '2.' : '-'
    expect(parse(`Intro:\n${marker} First\n${next} Second\n\nAfter.`)).toEqual([
      { type: 'p', text: 'Intro:' },
      { type: 'list', ordered, items: ['First', 'Second'] },
      { type: 'p', text: 'After.' },
    ])
  })

  it('separates lists when their type changes or a blank line intervenes', () => {
    expect(parse('- One\n1. Two\n\n2. Three')).toEqual([
      { type: 'list', ordered: false, items: ['One'] },
      { type: 'list', ordered: true, items: ['Two'] },
      { type: 'list', ordered: true, items: ['Three'] },
    ])
  })

  it('preserves blank lines, indentation, and markdown inside fenced code', () => {
    const code = '  const value = 1;\n\n- literal list\n**literal bold**\n`literal code`\n'
    expect(parse(`Before\n\`\`\`js\n${code}\n\`\`\`\nAfter`)).toEqual([
      { type: 'p', text: 'Before' },
      { type: 'code', text: code },
      { type: 'p', text: 'After' },
    ])
  })
})

describe('Prose renderer', () => {
  it('renders bold and inline code in paragraphs and both list types', () => {
    const html = renderToStaticMarkup(
      <Prose body={'Use **bold** and `inline code`.\n- **Strong item**\n1. Run `command`'} />,
    )
    expect(html).toMatch(/<p>Use <strong[^>]*>bold<\/strong> and <code[^>]*>inline code<\/code>\.<\/p>/)
    expect(html).toMatch(/<ul[^>]*><li[^>]*><strong[^>]*>Strong item<\/strong><\/li><\/ul>/)
    expect(html).toMatch(/<ol[^>]*><li[^>]*>Run <code[^>]*>command<\/code><\/li><\/ol>/)
  })

  it('renders fenced code literally and escapes HTML', () => {
    const html = renderToStaticMarkup(
      <Prose body={'```\n<div>\n\n**literal**\n```'} />,
    )
    expect(html).toMatch(/<pre[^>]*><code>&lt;div&gt;\n\n\*\*literal\*\*<\/code><\/pre>/)
    expect(html).not.toContain('<strong')
  })
})

describe('inline markdown', () => {
  it('renders https links as external links and leaves other brackets alone', () => {
    const html = renderToStaticMarkup(<p>{inline('See [agentics](https://github.com/githubnext/agentics) and [x](javascript:alert(1)).')}</p>)
    expect(html).toContain('<a href="https://github.com/githubnext/agentics" target="_blank" rel="noreferrer"')
    expect(html).toContain('>agentics</a>')
    expect(html).not.toContain('href="javascript')
    expect(html).toContain('[x](javascript:alert(1))')
  })

  it('still renders bold and code', () => {
    const html = renderToStaticMarkup(<p>{inline('**bold** and `code`')}</p>)
    expect(html).toContain('<strong')
    expect(html).toContain('<code')
  })
})
