import express, { Application } from 'express';

export function createExpressApp() {
  const app: Application = express();
  app.use(express.json());
  return app;
}
