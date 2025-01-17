const express = require('express');
const categoryRouter = require('./category');
const appRouter = express.Router();

appRouter.use('/categories',categoryRouter);

module.exports = appRouter