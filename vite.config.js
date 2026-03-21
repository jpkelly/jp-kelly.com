import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(async () => {
  const { default: mdx } = await import('@mdx-js/rollup');

  return {
    plugins: [{ ...mdx(), enforce: 'pre' }, react({ include: /\.(mdx|js|jsx|ts|tsx)$/ })],
    envPrefix: ['VITE_', 'REACT_APP_'],
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.js$/,
      exclude: []
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          '.js': 'jsx'
        }
      }
    },
    ssr: {
      noExternal: true
    },
    build: {
      outDir: 'build',
      emptyOutDir: true
    }
  };
});