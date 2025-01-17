const express  = require('express')
const categoryRouter = express.Router()

categoryRouter.get('/categories');
categoryRouter.post('/categories');
categoryRouter.patch('/categories/:id');
categoryRouter.delete('/categories/:id');
module.exports = categoryRouter