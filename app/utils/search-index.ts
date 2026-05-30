/**
 * Pure helpers for the dedicated `/search` page.
 *
 * `queryCollectionSearchSections('docs')` (from `@nuxt/content`) returns one
 * search section per heading in the docs. This module wraps that raw output
 * so the page can:
 *
 *   - score + rank matches against a typed query
 *   - group results by top-level category (`getting-started`, `core-modules`,
 *     `react-hooks`, `api-reference`, `integration-guides`, `advanced`, ...)
 *   - render a category-chip filter alongside the search input
 *
 * Everything here is dependency-free and easy to unit-test.
 */

/**
 * Shape we accept from `queryCollectionSearchSections`. The real type from
 * `@nuxt/content` has extra fields we don't care about — keep this minimal so
 * the helper is easy to test in isolation.
 */
export interface SearchSection {
  id: string
  /** Heading text (e.g. "Quick Start"). */
  title: string
  /** Path to navigate to, when different from `id`. */
  to?: string
  /** Body text under the heading (may be empty). */
  content?: string
  /** Breadcrumb-style label (e.g. "SDK > Getting Started"). */
  breadcrumb?: string
  /** Optional level (h1, h2, ...). */
  level?: number
  /** Optional tags / keywords from frontmatter. */
  keywords?: string[]
}

export interface SearchSectionGroup {
  /** URL-safe key (`getting-started`, `api-reference`, ...). */
  key: string
  /** Human-readable label (`Getting Started`, `API Reference`, ...). */
  label: string
  sections: SearchSection[]
}

export interface SearchOptions {
  /** Free-text query. Whitespace is trimmed; empty = no constraint. */
  query?: string
  /** Limit to a category key produced by `groupSectionsByCategory`. */
  category?: string
}

interface IndexedSection {
  section: SearchSection
  category: string
  haystack: string
}

export interface SectionsIndex {
  sections: IndexedSection[]
}

const NUMBER_PREFIX = /^[0-9]+\./

/**
 * Convert a folder-like segment ("1.getting-started", "api-reference") into
 * a clean category key ("getting-started", "api-reference").
 */
export function normaliseCategoryKey(segment: string): string {
  return segment.replace(NUMBER_PREFIX, '').toLowerCase()
}

/**
 * Convert a category key into a display label. "getting-started" → "Getting Started".
 */
export function categoryLabel(key: string): string {
  if (!key) return 'Other'
  return key
    .split('-')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Pull the top-level category out of a section's path. Falls back to "other"
 * when nothing parseable is present.
 */
export function categoryFor(section: SearchSection): string {
  const path = section.to ?? section.id
  if (!path) return 'other'
  const parts = path
    .replace(/^\/+/, '')
    .split('/')
    .filter(Boolean)
  // The docs are nested under /sdk/<category>/... on disk. We want the
  // <category> segment, not the leading "sdk".
  const start = parts[0] === 'sdk' ? 1 : 0
  const segment = parts[start]
  if (!segment) return 'other'
  return normaliseCategoryKey(segment)
}

/**
 * Build a search index from a list of sections. The returned `haystack`
 * string for each section is lower-cased + concatenated once, so
 * `searchSections` can do a single `String.includes` per section.
 */
export function buildSectionsIndex(
  sections: readonly SearchSection[]
): SectionsIndex {
  return {
    sections: sections.map(section => ({
      section,
      category: categoryFor(section),
      haystack: [
        section.title,
        section.content,
        section.breadcrumb,
        ...(section.keywords ?? [])
      ]
        .filter((value): value is string => Boolean(value))
        .join(' ')
        .toLowerCase()
    }))
  }
}

/**
 * Run a filter over a previously-built index.
 */
export function searchSections(
  index: SectionsIndex,
  options: SearchOptions = {}
): SearchSection[] {
  const trimmed = options.query?.trim().toLowerCase() ?? ''
  const category = options.category

  return index.sections
    .filter((entry) => {
      if (category && entry.category !== category) return false
      if (trimmed && !entry.haystack.includes(trimmed)) return false
      return true
    })
    .map(entry => entry.section)
}

/**
 * Group sections by category so the page can render filter chips with counts.
 * Categories are returned sorted alphabetically by label.
 */
export function groupSectionsByCategory(
  sections: readonly SearchSection[]
): SearchSectionGroup[] {
  const buckets = new Map<string, SearchSection[]>()
  for (const section of sections) {
    const key = categoryFor(section)
    const existing = buckets.get(key)
    if (existing) {
      existing.push(section)
    } else {
      buckets.set(key, [section])
    }
  }

  return Array.from(buckets.entries())
    .map(([key, items]) => ({ key, label: categoryLabel(key), sections: items }))
    .sort((a, b) => a.label.localeCompare(b.label))
}
