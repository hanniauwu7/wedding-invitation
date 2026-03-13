import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const plugins = [react()]

// Dev-only admin plugin (local, not in git)
try {
  const { default: devAdminPlugin } = await import('./plugins/devAdminPlugin.js')
  plugins.push(devAdminPlugin())
} catch {
  // Plugin not found — production build, skip
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins,
})
