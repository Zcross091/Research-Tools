import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Plugin to remove crossorigin attributes for seamless Electron & local file execution
function removeCrossorigin() {
  return {
    name: 'remove-crossorigin',
    transformIndexHtml(html) {
      return html.replace(/crossorigin/g, '')
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), removeCrossorigin()],
  base: './', // CRITICAL for Electron (file://) and Android Capacitor (file:///android_asset)
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      }
    }
  }
})



