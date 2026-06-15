import { resolve, dirname } from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '../..');

export default function serve404() {
  return {
    name: 'serve-404',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (
          req.url &&
          req.url !== '/' &&
          req.url !== '/404.html' &&
          !req.url.startsWith('/@') &&
          !req.url.startsWith('/css') &&
          !req.url.startsWith('/js') &&
          !req.url.includes('.')
        ) {
          req.url = '/404.html';
        }
        next();
      });
    },
    configurePreviewServer(server) {
      const notFoundPage = readFileSync(resolve(projectRoot, 'dist/404.html'), 'utf-8');
      server.middlewares.use((req, res, next) => {
        if (req.url === '/404.html') return next();
        if (req.url && (req.url.startsWith('/css') || req.url.startsWith('/js') || req.url.includes('.'))) return next();
        const origEnd = res.end;
        res.end = function (...args) {
          if (res.statusCode === 404) {
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            return origEnd.call(res, notFoundPage);
          }
          return origEnd.apply(res, args);
        };
        next();
      });
    },
  };
}
