<script setup lang="ts">
import { computed } from 'vue'

import {
  type SearchSection,
  type SearchSectionGroup,
  buildSectionsIndex,
  groupSectionsByCategory,
  searchSections
} from '~/utils/search-index'

definePageMeta({
  layout: 'docs'
})

useSeoMeta({
  title: 'Search'
})

const route = useRoute()
const router = useRouter()

const initialQuery = typeof route.query.q === 'string' ? route.query.q : ''
const query = ref<string>(initialQuery)
const selectedCategory = ref<string | null>(
  typeof route.query.section === 'string' ? route.query.section : null
)

const { data: sectionsRaw } = await useAsyncData('search-sections', () =>
  queryCollectionSearchSections('docs')
)

const sections = computed<SearchSection[]>(() => sectionsRaw.value ?? [])
const index = computed(() => buildSectionsIndex(sections.value))

const categories = computed<SearchSectionGroup[]>(() =>
  groupSectionsByCategory(sections.value)
)

const filtered = computed<SearchSection[]>(() =>
  searchSections(index.value, {
    query: query.value,
    category: selectedCategory.value ?? undefined
  })
)

const trimmedQuery = computed(() => query.value.trim())

watch([query, selectedCategory], ([q, cat]) => {
  router.replace({
    query: {
      ...(q ? { q } : {}),
      ...(cat ? { section: cat } : {})
    }
  })
}, { flush: 'post' })

function selectCategory(cat: string | null) {
  selectedCategory.value = cat
}
</script>

<template>
  <UPage>
    <UPageBody>
      <header class="space-y-3 pb-6 border-b border-default">
        <h1 class="text-3xl font-bold tracking-tight">
          Search the docs
        </h1>
        <p class="text-muted">
          Search every page, heading, and code block in the Zuno SDK
          documentation. Narrow results by section using the chips below.
        </p>

        <UInput
          v-model="query"
          size="lg"
          icon="i-lucide-search"
          placeholder="Type to search..."
          autocomplete="off"
          autofocus
          aria-label="Search docs"
        />

        <div
          v-if="categories.length > 0"
          class="flex flex-wrap items-center gap-2"
        >
          <UButton
            :variant="selectedCategory === null ? 'solid' : 'soft'"
            color="primary"
            size="xs"
            :label="`All (${sections.length})`"
            @click="selectCategory(null)"
          />
          <UButton
            v-for="cat in categories"
            :key="cat.key"
            :variant="selectedCategory === cat.key ? 'solid' : 'soft'"
            color="primary"
            size="xs"
            :label="`${cat.label} (${cat.sections.length})`"
            @click="selectCategory(cat.key)"
          />
        </div>
      </header>

      <section
        class="pt-6"
        aria-live="polite"
      >
        <p class="text-sm text-muted mb-4">
          <template v-if="!trimmedQuery && !selectedCategory">
            Showing all {{ sections.length }} sections.
          </template>
          <template v-else>
            {{ filtered.length }} of {{ sections.length }} sections
            <template v-if="trimmedQuery">
              match "<b>{{ trimmedQuery }}</b>"
            </template>
            <template v-if="selectedCategory">
              in <b>{{ selectedCategory }}</b>
            </template>.
          </template>
        </p>

        <ul
          v-if="filtered.length > 0"
          class="divide-y divide-default border-y border-default"
        >
          <li
            v-for="section in filtered"
            :key="section.id"
            class="py-4"
          >
            <NuxtLink
              :to="section.to ?? section.id"
              class="block group"
            >
              <p class="text-xs uppercase tracking-wide text-muted mb-1">
                {{ section.breadcrumb }}
              </p>
              <h2 class="text-lg font-semibold group-hover:text-primary transition-colors">
                {{ section.title }}
              </h2>
              <p
                v-if="section.content"
                class="text-sm text-muted line-clamp-2 mt-1"
              >
                {{ section.content }}
              </p>
            </NuxtLink>
          </li>
        </ul>

        <div
          v-else
          class="py-12 text-center"
        >
          <UIcon
            name="i-lucide-search-x"
            class="size-10 text-muted mx-auto mb-4"
          />
          <p class="text-sm text-muted">
            No sections match the current filters.
          </p>
          <UButton
            class="mt-4"
            variant="soft"
            color="primary"
            size="sm"
            label="Reset"
            @click="() => { query = ''; selectedCategory = null }"
          />
        </div>
      </section>
    </UPageBody>
  </UPage>
</template>
