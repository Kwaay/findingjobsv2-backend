/**
 * @file Configuration file for app.
 * @author DUMONT Benoit <benoit.dum74@gmail.com>
 */

import express from 'express';

import HttpError from './class/HttpError';

const app = express();

// Request size limitation
// @ts-ignore
app.use(express.json({ limit: '50mb' }));

// Mise en place des headers
// @ts-ignore
app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN);
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization',
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  );
  next();
});

// Base URL pour les routes
// app.use('/api/acv', acvRoutes);

// Error handling
// @ts-ignore
app.use((error, req, res, next) => {
  if (error instanceof HttpError) {
    return res.status(error.code).json({ error: error.message });
  }
  return next();
});

export default app;
