<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

// Get SDK navigation children (only section needed)
const sdkNavigation = computed(() => {
  if (!navigation?.value) return []

  // Find the SDK navigation item by stem
  const sdkNav = navigation.value.find(item => item.stem === 'sdk')

  // Return only the children (index page is hidden via navigation: false in frontmatter)
  return sdkNav?.children || []
})
</script>

<template>
  <UContainer>
    <UPage>
      <template #left>
        <UPageAside>
          <UContentNavigation
            highlight
            :navigation="sdkNavigation"
          />
        </UPageAside>
      </template>

      <slot />
    </UPage>
  </UContainer>
</template>
