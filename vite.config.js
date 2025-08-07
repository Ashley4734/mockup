import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  define: {
    // Exposes the API token to your frontend code via `import.meta.env.VITE_REPLICATE_API_TOKEN`
    'import.meta.env.VITE_REPLICATE_API_TOKEN': JSON.stringify(process.env.VITE_REPLICATE_API_TOKEN || '')
  }
})