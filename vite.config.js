// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   base: "/RDLGenerator/",
//   optimizeDeps: {
//     exclude: ["xmlbuilder2"],
//   },
//   build: {
//     minify: "terser",
//     terserOptions: {
//       compress: {
//         drop_console: true,
//         drop_debugger: true,
//       },
//     },
//   },
// });


import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { execSync } from "child_process";

// Get current branch name using git
let activeBranch = "main";
try {
  activeBranch = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
} catch {
  console.warn("Could not get branch name, defaulting to main.");
}

// Set base path based on branch
// Main branch stays at root, others go to their own subfolders
const publicBase = (activeBranch === "main" || activeBranch === "master")
  ? "/RDLGenerator/"
  : `/RDLGenerator/${activeBranch}/`;

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: publicBase, // Updated dynamically
  optimizeDeps: {
    exclude: ["xmlbuilder2"],
  },
  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});