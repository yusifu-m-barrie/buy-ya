import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { ENV } from './config/env.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..'); // points to the api folder

app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'API is healthy!' });
});

if (ENV.NODE_ENV === 'production') {
  const adminDistPath = path.resolve(projectRoot, '../admin/dist');

  app.use(express.static(adminDistPath));

  app.get(/.*/, (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }

    res.sendFile(path.join(adminDistPath, 'index.html'));
  });
}

app.listen(ENV.PORT, () => console.log('API server is running'));