import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.VERCEL
    ? '/'                 // ✅ Vercel
    : '/number_learning/',// ✅ GitHub Pages
  build: {
    target: ['es2017'],
  },
});
``
