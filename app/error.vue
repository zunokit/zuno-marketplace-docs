<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const router = useRouter()
const route = useRoute()

const isNotFound = computed(() => Number(props.error?.statusCode) === 404)
const statusCode = computed(() => Number(props.error?.statusCode) || 500)
const headline = computed(() => isNotFound.value ? 'Page not found' : `Error ${statusCode.value}`)
const description = computed(() => {
  if (isNotFound.value) {
    return `We couldn't find anything at "${route.path}". The page may have moved, been renamed, or never existed.`
  }
  return props.error?.statusMessage || 'Something went wrong while loading this page.'
})

useHead({
  htmlAttrs: { lang: 'en' }
})

useSeoMeta({
  title: headline.value,
  description: description.value
})

const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('docs'))
const { data: files } = useLazyAsyncData('search', () => queryCollectionSearchSections('docs'), {
  server: false
})

provide('navigation', navigation)

const popularLinks = [
  { label: 'Getting started', to: '/getting-started/installation', icon: 'i-lucide-rocket' },
  { label: 'Quick start', to: '/getting-started/quick-start', icon: 'i-lucide-zap' },
  { label: 'API reference', to: '/api-reference', icon: 'i-lucide-book-open' },
  { label: 'Integration guides', to: '/integration-guides', icon: 'i-lucide-puzzle' }
]

function goHome() {
  return router.push('/')
}

function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>

<template>
  <UApp>
    <AppHeader />

    <UMain>
      <UContainer class="py-12 sm:py-20">
        <div class="mx-auto max-w-2xl text-center">
          <p
            data-testid="error-status"
            class="text-sm font-mono uppercase tracking-wide text-primary"
          >
            Error {{ statusCode }}
          </p>
          <h1
            data-testid="error-headline"
            class="mt-2 text-3xl sm:text-4xl font-bold text-highlighted"
          >
            {{ headline }}
          </h1>
          <p
            data-testid="error-description"
            class="mt-4 text-base sm:text-lg text-muted"
          >
            {{ description }}
          </p>

          <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
            <UButton
              data-testid="error-home"
              icon="i-lucide-home"
              size="lg"
              @click="goHome"
            >
              Back to docs home
            </UButton>
            <UButton
              data-testid="error-back"
              icon="i-lucide-arrow-left"
              variant="ghost"
              size="lg"
              @click="goBack"
            >
              Go back
            </UButton>
          </div>

          <div
            v-if="isNotFound"
            class="mt-12 text-left"
          >
            <h2 class="text-sm font-semibold uppercase tracking-wide text-muted">
              Popular pages
            </h2>
            <ul
              data-testid="error-popular"
              class="mt-4 grid gap-3 sm:grid-cols-2"
            >
              <li
                v-for="link in popularLinks"
                :key="link.to"
              >
                <ULink
                  :to="link.to"
                  class="flex items-center gap-3 rounded-md border border-default p-3 hover:bg-elevated/50 transition-colors"
                >
                  <UIcon
                    :name="link.icon"
                    class="h-5 w-5 text-primary"
                  />
                  <span class="text-sm font-medium">{{ link.label }}</span>
                </ULink>
              </li>
            </ul>

            <p class="mt-6 text-sm text-muted">
              Tip: press
              <kbd class="px-1.5 py-0.5 rounded border border-default font-mono text-xs">⌘</kbd>
              <kbd class="px-1.5 py-0.5 rounded border border-default font-mono text-xs">K</kbd>
              to search the docs, or
              <ULink
                to="https://github.com/ZunoKit/zuno-marketplace-docs/issues/new"
                target="_blank"
                class="underline"
              >open an issue</ULink>
              if you think this is a bug.
            </p>
          </div>
        </div>
      </UContainer>
    </UMain>

    <AppFooter />

    <ClientOnly>
      <LazyUContentSearch
        :files="files"
        :navigation="navigation"
      />
    </ClientOnly>
  </UApp>
</template>
