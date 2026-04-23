import { defineConfig } from 'vite'

function resolveBase() {
  if (process.env.DEPLOY_BASE) {
    return process.env.DEPLOY_BASE
  }

  if (process.env.VERCEL || process.env.CF_PAGES) {
    return '/'
  }

  return '/number_learning/'
}

export default defineConfig({
  base: resolveBase(),
  build: {
    target: ['es2017']
  }
})
