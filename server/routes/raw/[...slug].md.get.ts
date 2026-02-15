import { withLeadingSlash } from 'ufo'
import { stringify } from 'minimark/stringify'
import { queryCollection } from '@nuxt/content/nitro'
import type { Collections } from '@nuxt/content'

export default eventHandler(async (event) => {
  const slug = getRouterParams(event)['slug.md']
  if (!slug?.endsWith('.md')) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
  }

  // Public URLs don't include "/sdk"; content paths may. Try public path first, then fallback.
  const publicPath = withLeadingSlash(slug.replace('.md', ''))
  const sdkPath = withLeadingSlash(`/sdk${slug.replace('.md', '')}`)

  let page = await queryCollection(event, 'docs' as keyof Collections).path(publicPath).first()
  if (!page) {
    page = await queryCollection(event, 'docs' as keyof Collections).path(sdkPath).first()
  }
  if (!page) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
  }

  // Add title and description to the top of the page if missing
  if (page.body.value[0]?.[0] !== 'h1') {
    page.body.value.unshift(['blockquote', {}, page.description])
    page.body.value.unshift(['h1', {}, page.title])
  }

  setHeader(event, 'Content-Type', 'text/markdown; charset=utf-8')
  return stringify({ ...page.body, type: 'minimark' }, { format: 'markdown/html' })
})
