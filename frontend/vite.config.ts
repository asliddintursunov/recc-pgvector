import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const DEV_SERVER_PORT = 3000

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: DEV_SERVER_PORT,
    strictPort: true,
    hmr: {
      clientPort: DEV_SERVER_PORT,
    },
    watch: {
      usePolling: true,
    },
  },
  preview: {
    port: DEV_SERVER_PORT,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    "process.env.VITE_KEY": JSON.stringify(process.env.VITE_KEY),
    "process.env.VITE_BASE_URL": JSON.stringify(process.env.VITE_BASE_URL),
  },
})
