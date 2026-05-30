<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  code?: string
  language?: string | null
  filename?: string | null
  highlights?: number[]
  meta?: string | null
  class?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  code: '',
  language: null,
  filename: null,
  highlights: () => [],
  meta: null,
  class: null
})

const copied = ref(false)
const error = ref(false)
let resetTimer: ReturnType<typeof setTimeout> | null = null

const displayLanguage = computed(() => {
  if (!props.language) return null
  // Normalize a few common shorthand aliases that appear in our docs.
  const map: Record<string, string> = {
    ts: 'TypeScript',
    tsx: 'TSX',
    js: 'JavaScript',
    jsx: 'JSX',
    sh: 'Shell',
    bash: 'Bash',
    json: 'JSON',
    yaml: 'YAML',
    yml: 'YAML',
    md: 'Markdown',
    mdx: 'MDX',
    rs: 'Rust',
    sol: 'Solidity',
    py: 'Python'
  }
  return map[props.language.toLowerCase()] ?? props.language
})

async function copy() {
  if (!props.code) return
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(props.code)
    } else {
      // Fallback for older browsers / non-secure contexts.
      const ta = document.createElement('textarea')
      ta.value = props.code
      ta.setAttribute('readonly', '')
      ta.style.position = 'absolute'
      ta.style.left = '-9999px'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    copied.value = true
    error.value = false
  } catch {
    copied.value = false
    error.value = true
  } finally {
    if (resetTimer) clearTimeout(resetTimer)
    resetTimer = setTimeout(() => {
      copied.value = false
      error.value = false
    }, 1800)
  }
}
</script>

<template>
  <div
    class="prose-pre-wrapper group relative my-4 rounded-md border border-default bg-muted overflow-hidden"
  >
    <div
      v-if="props.filename || displayLanguage"
      class="flex items-center justify-between gap-2 px-3 py-1.5 border-b border-default text-xs"
    >
      <div class="flex items-center gap-2 min-w-0">
        <span
          v-if="props.filename"
          class="font-mono text-muted truncate"
          :title="props.filename"
        >{{ props.filename }}</span>
        <span
          v-if="displayLanguage && !props.filename"
          class="font-mono text-muted"
        >{{ displayLanguage }}</span>
      </div>
      <span
        v-if="props.filename && displayLanguage"
        class="font-mono text-muted shrink-0"
      >{{ displayLanguage }}</span>
    </div>

    <pre
      :class="[
        props.class,
        'overflow-x-auto p-4 text-sm'
      ]"
    ><slot /></pre>

    <button
      type="button"
      class="copy-button absolute right-2 top-2 inline-flex items-center gap-1 rounded-md border border-default bg-default px-2 py-1 text-xs text-muted opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 hover:text-default focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      :class="{ '!opacity-100': copied || error }"
      :aria-label="copied ? 'Copied to clipboard' : 'Copy code to clipboard'"
      :data-state="copied ? 'copied' : error ? 'error' : 'idle'"
      @click="copy"
    >
      <span
        v-if="copied"
        class="inline-flex items-center gap-1 text-success"
      >
        <UIcon
          name="i-lucide-check"
          class="h-3.5 w-3.5"
        />
        Copied
      </span>
      <span
        v-else-if="error"
        class="inline-flex items-center gap-1 text-error"
      >
        <UIcon
          name="i-lucide-circle-x"
          class="h-3.5 w-3.5"
        />
        Failed
      </span>
      <span
        v-else
        class="inline-flex items-center gap-1"
      >
        <UIcon
          name="i-lucide-copy"
          class="h-3.5 w-3.5"
        />
        Copy
      </span>
    </button>
  </div>
</template>

<style scoped>
.prose-pre-wrapper :deep(pre) {
  margin: 0;
  background: transparent;
}
.prose-pre-wrapper :deep(pre code .line) {
  display: block;
}
</style>
