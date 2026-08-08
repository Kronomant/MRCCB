import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const config = defineConfig({
  theme: {
    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: { value: 'var(--color-background)' },
          subtle: { value: 'var(--color-background-soft)' },
          muted: { value: 'var(--color-background-mute)' },
          panel: { value: 'var(--color-background)' }, // Alias for panel backgrounds
        },
        fg: {
          DEFAULT: { value: 'var(--color-text)' },
          muted: { value: 'var(--ev-c-text-2)' },
          subtle: { value: 'var(--ev-c-text-3)' },
        },
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)
