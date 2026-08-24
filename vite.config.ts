import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
  const base = process.env.VITE_BASE || (isGitHubActions ? '/Rusty.Lub/' : './');
  return {
    base,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      minify: 'terser' as const,
      terserOptions: {
        compress: {
          passes: 3,
          drop_console: true,
          drop_debugger: true,
          pure_funcs: [
            'console.log',
            'console.info',
            'console.debug',
            'console.trace',
            'console.warn'
          ],
          unsafe_arrows: true,
          unsafe_methods: true,
          unsafe_comps: true,
          unsafe_math: true,
          unsafe_proto: true,
          booleans_as_integers: true,
          evaluate: true,
          hoist_funs: true,
          hoist_vars: true,
        },
        mangle: {
          toplevel: true,
          eval: true,
          keep_classnames: false,
          keep_fnames: false,
          properties: {
            regex: /^_private_/,
          },
        },
        format: {
          comments: false,
          ascii_only: true,
          quote_style: 3,
        },
      },
    },
  };
});
