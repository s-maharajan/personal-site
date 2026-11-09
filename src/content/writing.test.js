import { describe, expect, it } from 'vitest'
import { articles, isoMonth, sortedArticles } from './writing'

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

  it('rejects a date it cannot parse instead of returning month "00"', () => {
    // A typo used to sort the essay to the top of the site and publish
    // "Invalid Date" to the feed, so the build has to stop here.
    expect(() => isoMonth('Sept 2025')).toThrow(/Unrecognised article date/)
    expect(() => isoMonth('October')).toThrow(/Unrecognised article date/)
    expect(() => isoMonth('October 25')).toThrow(/Unrecognised article date/)
    expect(() => isoMonth('')).toThrow(/Unrecognised article date/)
  })
})

describe('sortedArticles', () => {
  it('contains every article once, newest first, in a separate array', () => {
    expect(sortedArticles).not.toBe(articles)
    expect(sortedArticles).toHaveLength(articles.length)
    expect(new Set(sortedArticles)).toEqual(new Set(articles))
    // Derive the expected order independently of isoMonth and the production sort.
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December']
    const rank = ({ date }) => {
      const [month, year] = date.split(' ')
      return Number(year) * 12 + months.indexOf(month)
    }
    expect(sortedArticles).toEqual([...articles].sort((a, b) => rank(b) - rank(a)))
    expect(sortedArticles[0].date).toBe('November 2025')
    expect(sortedArticles.at(-1).date).toBe('January 2025')
    expect(articles[0].slug).toBe('why-rag-hallucinates-chunking')
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
