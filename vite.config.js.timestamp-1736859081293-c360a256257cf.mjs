// vite.config.js
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///C:/Users/lucas/Documents/HEIG/DevMobil-AdopteUnAnimal/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/lucas/Documents/HEIG/DevMobil-AdopteUnAnimal/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueDevTools from "file:///C:/Users/lucas/Documents/HEIG/DevMobil-AdopteUnAnimal/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
var __vite_injected_original_import_meta_url = "file:///C:/Users/lucas/Documents/HEIG/DevMobil-AdopteUnAnimal/vite.config.js";
var vite_config_default = defineConfig({
  plugins: [
    vue()
    // vueDevTools(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      },
      "/ws": {
        target: "ws://localhost:3000",
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/ws/, "")
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxsdWNhc1xcXFxEb2N1bWVudHNcXFxcSEVJR1xcXFxEZXZNb2JpbC1BZG9wdGVVbkFuaW1hbFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcbHVjYXNcXFxcRG9jdW1lbnRzXFxcXEhFSUdcXFxcRGV2TW9iaWwtQWRvcHRlVW5BbmltYWxcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2x1Y2FzL0RvY3VtZW50cy9IRUlHL0Rldk1vYmlsLUFkb3B0ZVVuQW5pbWFsL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSBcIm5vZGU6dXJsXCI7XHJcblxyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgdnVlIGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWVcIjtcclxuaW1wb3J0IHZ1ZURldlRvb2xzIGZyb20gXCJ2aXRlLXBsdWdpbi12dWUtZGV2dG9vbHNcIjtcclxuXHJcbi8vIGh0dHBzOi8vdml0ZS5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG5cdHBsdWdpbnM6IFtcclxuXHRcdHZ1ZSgpLFxyXG5cdFx0Ly8gdnVlRGV2VG9vbHMoKSxcclxuXHRdLFxyXG5cdHJlc29sdmU6IHtcclxuXHRcdGFsaWFzOiB7XHJcblx0XHRcdFwiQFwiOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoXCIuL3NyY1wiLCBpbXBvcnQubWV0YS51cmwpKSxcclxuXHRcdH0sXHJcblx0fSxcclxuICBzZXJ2ZXI6IHtcclxuICAgIHByb3h5OiB7XHJcbiAgICAgIFwiL2FwaVwiOiB7XHJcbiAgICAgICAgdGFyZ2V0OiBcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMFwiLFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpLywgXCJcIiksXHJcbiAgICAgIH0sXHJcbiAgICAgIFwiL3dzXCI6IHtcclxuICAgICAgICB0YXJnZXQ6IFwid3M6Ly9sb2NhbGhvc3Q6MzAwMFwiLFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICB3czogdHJ1ZSxcclxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvd3MvLCBcIlwiKSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNlYsU0FBUyxlQUFlLFdBQVc7QUFFaFksU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxTQUFTO0FBQ2hCLE9BQU8saUJBQWlCO0FBSnFNLElBQU0sMkNBQTJDO0FBTzlRLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzNCLFNBQVM7QUFBQSxJQUNSLElBQUk7QUFBQTtBQUFBLEVBRUw7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNSLE9BQU87QUFBQSxNQUNOLEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsSUFDckQ7QUFBQSxFQUNEO0FBQUEsRUFDQyxRQUFRO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsUUFDTixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxTQUFTLENBQUMsU0FBUyxLQUFLLFFBQVEsVUFBVSxFQUFFO0FBQUEsTUFDOUM7QUFBQSxNQUNBLE9BQU87QUFBQSxRQUNMLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLElBQUk7QUFBQSxRQUNKLFNBQVMsQ0FBQyxTQUFTLEtBQUssUUFBUSxTQUFTLEVBQUU7QUFBQSxNQUM3QztBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
