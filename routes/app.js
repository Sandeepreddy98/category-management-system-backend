const express = require('express');
const categoryRouter = require('./categoryRoutes');
const appRouter = express.Router();

// Middleware to parse JSON bodies
appRouter.use(express.json());

appRouter.use('/categories',categoryRouter);

module.exports = appRouter