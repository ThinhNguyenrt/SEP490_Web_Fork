import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://api-gateway.grayforest-11aba44e.southeastasia.azurecontainerapps.io",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
      "/user-profile-api": {
        target: "https://userprofile-service.grayforest-11aba44e.southeastasia.azurecontainerapps.io",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/user-profile-api/, "/api"),
      },
    },
  },
  define: {
    "import.meta.env.VITE_API_BASE_URL": JSON.stringify(
      process.env.VITE_API_BASE_URL || "/api"
    ),
    "import.meta.env.VITE_USER_PROFILE_API_BASE_URL": JSON.stringify(
      process.env.VITE_USER_PROFILE_API_BASE_URL || "/user-profile-api"
    ),
  },
})