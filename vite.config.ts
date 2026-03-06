import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  server: {
    host: true,        // الاستماع على كل الواجهات (يساعد في حل مشاكل الاتصال)
    port: 5173,
    strictPort: false, // إذا كان المنفذ مشغولاً يجرب منفذاً آخر
    open: true,        // يفتح المتصفح تلقائياً عند التشغيل
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/react-router-dom/')) {
              return 'react-vendor';
            }
            if (id.includes('/@prisma/') || id.includes('/@supabase/')) {
              return 'db-vendor';
            }
            if (id.includes('/lucide-react/') || id.includes('/framer-motion/') || id.includes('/recharts/') || id.includes('/tailwindcss/')) {
              return 'ui-vendor';
            }
          }
        }
      }
    }
  }
})
