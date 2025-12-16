import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from 'vite-plugin-pwa';
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    {
      name: "copy-404",
      closeBundle() {
        const distDir = path.resolve(__dirname, "dist");
        const indexHtml = path.join(distDir, "index.html");
        const notFoundHtml = path.join(distDir, "404.html");

        if (fs.existsSync(indexHtml)) {
          fs.copyFileSync(indexHtml, notFoundHtml);
          console.log("Created 404.html from index.html");
        } else {
          console.warn("index.html not found in dist directory");
        }
      },
    },
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'PFinances AI',
        short_name: 'PFinance',
        description: 'Personal Finance AI Application',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        version: 'dev-0.5.3',
        icons: [
          {
            src: 'web-app-manifest-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'web-app-manifest-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
  base: "/clients/financeapp/", // <<< IMPORTANT
});
