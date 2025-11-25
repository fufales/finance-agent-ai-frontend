import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
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
  ],
  base: "/clients/financeapp/", // <<< IMPORTANT
});
