<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

interface NavItemWithPath extends ContentNavigationItem {
  to?: string
  path?: string
  children?: NavItemWithPath[]
}

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

// Use full navigation (SDK is default)
const sdkNavigation = computed<ContentNavigationItem[]>(() => {
  if (!navigation?.value) return []
  // Flatten: show children of the first root section if only one
  const roots = navigation.value
  if (roots.length === 1 && roots[0].children) {
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

// Deep map navigation items to provide `to` used by UI links
const mapForUi = (items: NavItemWithPath[]): NavItemWithPath[] =>
  items?.map(item => ({
    ...item,
    // Ensure both `to` and `path` point to public URLs (no /sdk)
    to: normalizeTo(item.to || item.path),
    path: normalizeTo(item.path),
    children: item.children ? mapForUi(item.children) : undefined
  })) || []

// Navigation used by UContentNavigation (with correct public links)
const uiNavigation = computed(() => mapForUi(sdkNavigation.value))
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
