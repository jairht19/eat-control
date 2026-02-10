import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'eat-control'
const isGitHubPagesBuild = process.env.GITHUB_ACTIONS === 'true'
const base = isGitHubPagesBuild ? `/${repoName}/` : '/'

export default defineConfig({
  base,
  plugins: [
    vue(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Eat Control',
        short_name: 'EatControl',
        description: 'Seguimiento mensual de comidas',
        theme_color: '#0f172a',
        background_color: '#f8fafc',
        display: 'standalone',
        lang: 'es-MX',
        start_url: base
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: ['.vue', '.ts', '.tsx', '.mjs', '.js', '.jsx', '.json']
  }
})
