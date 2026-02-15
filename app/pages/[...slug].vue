<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { findPageHeadline } from '@nuxt/content/utils'

definePageMeta({
  layout: 'docs'
})

const route = useRoute()
const { toc } = useAppConfig()
const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

// Internal content path always lives under /sdk, while public URL does not
const contentPath = computed(() => (route.path.startsWith('/sdk/') ? route.path : `/sdk${route.path}`))

const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('docs').path(contentPath.value).first()
)
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => {
  return queryCollectionItemSurroundings('docs', contentPath.value, {
    fields: ['description']
  })
})

interface SurroundItem {
  to?: string
  path?: string
  [key: string]: unknown
}

// Normalize prev/next links for public URLs (drop leading /sdk)
const normalizePublicPath = (p?: string) => {
  if (!p) return p
  if (p === '/sdk') return '/'
  return p.startsWith('/sdk/') ? p.slice(4) : p
}

const surroundUi = computed<any[]>(() => {
  const arr = Array.isArray(surround.value) ? (surround.value as unknown as SurroundItem[]) : []
  return arr
    .filter(Boolean)
    .map((item: SurroundItem) => {
      const rawTo = item.to ?? item.path
      const to = normalizePublicPath(typeof rawTo === 'string' ? rawTo : undefined) || '/'
      const path = normalizePublicPath(typeof item.path === 'string' ? item.path : undefined) || to
      return { ...(item as Record<string, unknown>), to, path }
    })
})

const title = page.value.seo?.title || page.value.title
const description = page.value.seo?.description || page.value.description

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

const headline = computed(() => findPageHeadline(navigation?.value, page.value?.path))

defineOgImageComponent('Docs', {
  headline: headline.value
})

const links = computed(() => {
  const links = []
  if (toc?.bottom?.edit) {
    links.push({
      icon: 'i-lucide-external-link',
      label: 'Edit this page',
      to: `${toc.bottom.edit}/${page?.value?.stem}.${page?.value?.extension}`,
      target: '_blank'
    })
  }

  return [...links, ...(toc?.bottom?.links || [])].filter(Boolean)
})
</script>

<template>
  <UPage v-if="page">
    <UPageHeader
      :title="page.title"
      :headline="headline"
    >
      <template #links>
        <UButton
          v-for="(link, index) in page.links"
          :key="index"
          v-bind="link"
        />

        <PageHeaderLinks />
      </template>
    </UPageHeader>

    <UPageBody>
      <ContentRenderer
        v-if="page"
        :value="page"
      />

      <USeparator v-if="surroundUi && surroundUi.length" />

      <UContentSurround :surround="surroundUi || []" />
    </UPageBody>

    <template
      v-if="page?.body?.toc?.links?.length"
      #right
    >
      <UContentToc
        :title="toc?.title"
        :links="page.body?.toc?.links"
      >
        <template
          v-if="toc?.bottom"
          #bottom
        >
          <div
            class="hidden lg:block space-y-6"
            :class="{ '!mt-6': page.body?.toc?.links?.length }"
          >
            <USeparator
              v-if="page.body?.toc?.links?.length"
              type="dashed"
            />

            <UPageLinks
              :title="toc.bottom.title"
              :links="links"
            />
          </div>
        </template>
      </UContentToc>
    </template>
  </UPage>
</template>
