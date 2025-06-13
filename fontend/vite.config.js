import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/v1': {
        target: 'https://cloud.appwrite.io',
        changeOrigin: true,
        secure: false, // Ignore SSL issues in dev
      },
    },
  },
})
