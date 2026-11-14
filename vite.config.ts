import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    {
      name: 'disable-vite-hmr-client',
      configureServer(server) {
        server.middlewares.use('/@vite/client', (_req, res) => {
          res.setHeader('Content-Type', 'application/javascript');
          res.end(
            'export const createHotContext = () => ({ data: {}, accept(){}, acceptExports(){}, dispose(){}, prune(){}, invalidate(){}, decline(){}, on(){}, off(){}, send(){} });' +
            'export const updateStyle = () => {};' +
            'export const removeStyle = () => {};' +
            'export const injectQuery = (id) => id;'
          );
        });
      },
    },
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
    hmr: false,
  },
});
