import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';

import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';

function setupServer() {
  const app = express();

  app.use(cookieParser());
  app.use(cors());
  app.use(pino());
  app.use(express.json());

  app.get('/', (req, res) => {
    res.send('API is running!');
  });

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const swaggerPath = path.join(__dirname, '..', 'docs', 'swagger.json');

  let swaggerDoc;
  try {
    const raw = fs.readFileSync(swaggerPath, 'utf-8');
    swaggerDoc = JSON.parse(raw);
  } catch {
    console.warn(
      '⚠️  docs/swagger.json не знайдено або не зчитується. Запусти "npm run build-docs".',
    );
    swaggerDoc = {
      openapi: '3.0.3',
      info: {
        title: 'API Docs',
        version: '1.0.0',
        description:
          'Файл docs/swagger.json відсутній. Згенеруй його командою "npm run build-docs".',
      },
      paths: {},
    };
  }

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export default setupServer;
