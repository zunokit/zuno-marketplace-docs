<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

// Use full navigation (SDK is default)
const sdkNavigation = computed<ContentNavigationItem[]>(() => {
  const roots = navigation?.value || []
  // Flatten: show children of the first root section if only one
  if (roots.length === 1 && roots[0]?.children) {
    return roots[0].children as ContentNavigationItem[]
  }
  return roots as ContentNavigationItem[]
})

// Normalize links to drop the leading "/sdk" in URLs
const normalizeTo = (p?: string) => {
  if (!p) return '/'
  if (p === '/sdk') return '/'
  return p.startsWith('/sdk/') ? p.slice(4) : p
}

type NavLink = {
  path: string
  to?: string
  title: string
  children?: NavLink[]
  [key: string]: unknown
}

// Convert ContentNavigationItem tree to a link object with normalized public URLs
const toLink = (item: ContentNavigationItem): NavLink => {
  const title = (item as any).title || (item.path?.split('/').pop()?.replace(/-/g, ' ') ?? '')
  return {
    ...(item as unknown as Record<string, unknown>),
    title,
    to: normalizeTo((item as any).to || item.path),
    path: normalizeTo(item.path),
    children: item.children?.map(toLink)
  }
}

// Navigation used by UContentNavigation (with correct public links)
const uiNavigation = computed<NavLink[]>(() => (sdkNavigation.value || []).map(toLink))
</script>

<template>
  <UContainer>
    <UPage>
      <template #left>
        <UPageAside>
          <UContentNavigation
            highlight
            :navigation="uiNavigation"
          />
        </UPageAside>
      </template>

      <slot />
    </UPage>
  </UContainer>
</template>
