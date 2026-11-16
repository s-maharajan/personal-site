import { describe, expect, it } from 'vitest'
import { AREAS, articles, isoMonth, sortedArticles } from './writing'

describe('isoMonth', () => {
  it.each([
    ['January', '01'], ['February', '02'], ['March', '03'],
    ['April', '04'], ['May', '05'], ['June', '06'],
    ['July', '07'], ['August', '08'], ['September', '09'],
    ['October', '10'], ['November', '11'], ['December', '12'],
  ])('converts %s to an ISO year-month', (month, number) => {
    expect(isoMonth(`${month} 2025`)).toBe(`2025-${number}`)
    expect(isoMonth(`${month} 2024`)).toBe(`2024-${number}`)
  })
})

describe('sortedArticles', () => {
  it('contains every article once, AI first, then newest first, in a separate array', () => {
    expect(sortedArticles).not.toBe(articles)
    expect(sortedArticles).toHaveLength(articles.length)
    expect(new Set(sortedArticles)).toEqual(new Set(articles))
    // Derive the expected order independently of isoMonth and the production sort.
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December']
    const rank = ({ area, date }) => {
      const [month, year] = date.split(' ')
      return AREAS.indexOf(area) * 1e6 - (Number(year) * 12 + months.indexOf(month))
    }
    expect(sortedArticles).toEqual([...articles].sort((a, b) => rank(a) - rank(b)))
  })

  it('always puts AI essays before every other area', () => {
    expect(articles.every(({ area }) => AREAS.includes(area))).toBe(true)
    expect(AREAS[0]).toBe('AI')
    const areas = sortedArticles.map(({ area }) => area)
    expect(areas[0]).toBe('AI')
    expect(areas.lastIndexOf('AI')).toBeLessThan(areas.findIndex((area) => area !== 'AI'))
  })
})

describe('published articles', () => {
  it('has at least one article and unique slugs', () => {
    expect(articles.length).toBeGreaterThan(0)
    expect(new Set(articles.map(({ slug }) => slug)).size).toBe(articles.length)
  })

  it.each(articles)('$slug has complete metadata and content', (article) => {
    for (const field of ['slug', 'title', 'topic', 'date', 'readTime', 'summary', 'excerpt']) {
      expect(article[field], field).toBeTypeOf('string')
      expect(article[field].trim(), field).not.toBe('')
    }
    expect(Array.isArray(article.content)).toBe(true)
    expect(article.content.length).toBeGreaterThan(0)
    for (const section of article.content) {
      expect(section.heading).toBeTypeOf('string')
      expect(section.heading.trim()).not.toBe('')
      expect(section.body).toBeTypeOf('string')
      expect(section.body.trim()).not.toBe('')
    }
  })
})

describe('essays drawn from the learning log', () => {
  it.each(articles)('$slug credits its sources with links', (article) => {
    const count = article.sources.length + (article.references?.length ?? 0)
    expect(count).toBeGreaterThanOrEqual(3)
    const sources = article.content.at(-1)
    expect(sources.heading).toBe('Sources')
    expect(sources.body.match(/^- \[[^\]]+\]\(https:\/\/[^)]+\)/gm)).toHaveLength(count)
  })

  it('covers integration with Camel and MuleSoft essays', () => {
    const integration = articles.filter(({ topic }) => topic === 'Integration').map(({ slug }) => slug)
    expect(integration).toEqual(['apache-camel-integration-patterns-as-code', 'mulesoft-api-led-integration-for-agents'])
  })

  it.each(articles)('$slug has a read time that matches its length', (article) => {
    const words = [article.excerpt, ...article.content.map((s) => `${s.heading} ${s.body}`)].join(' ').split(/\s+/).length
    expect(article.readTime).toBe(`${Math.max(1, Math.round(words / 220))} min read`)
    expect(words).toBeGreaterThan(500)
  })

  it('keeps none of the earlier generated essays', () => {
    const slugs = articles.map(({ slug }) => slug)
    for (const old of ['why-rag-hallucinates-chunking', 'distributed-locks-are-a-lie', 'p99-tail-latency-tax']) {
      expect(slugs).not.toContain(old)
    }
  })
})

