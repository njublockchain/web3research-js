import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'Web3Research',
      formats: ['es', 'umd'],
      fileName: (format) => `web3research.${format}.js`
    },
    rollupOptions: {
      // Mark dependencies as external so they're not bundled
      external: ['@clickhouse/client-web', 'ethers', 'bs58'],
      output: {
        globals: {
          '@clickhouse/client-web': 'ClickHouseClientWeb',
          'ethers': 'ethers',
          'bs58': 'bs58'
        }
      }
    },
    sourcemap: true,
    minify: false, // Keep readable for development
  },
  server: {
    port: 3000,
    open: true
  }
})