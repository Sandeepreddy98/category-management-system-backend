const express = require("express");
const {
  initCategory,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const categoryRouter = express.Router();

// Routes for handling CRUD operations to categories
categoryRouter.get("/init",initCategory)
categoryRouter.get("/:parent_id", getCategories);
categoryRouter.patch("/:id", updateCategory);
categoryRouter.delete("/:id", deleteCategory);
categoryRouter.post("", createCategory);

module.exports = categoryRouter;
