export default defineConfig({
  base: process.env.NODE_ENV === 'production'
    ? '/number_learning/'
    : '/',
  build: {
    target: ['es2017'],
  },
})
``
