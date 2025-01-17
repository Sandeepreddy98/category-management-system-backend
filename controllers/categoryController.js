const Category = require("../models/Category");
const mongoose = require('mongoose');
/**
 * Description : This function is to check whether the root category is present or not
 * If it's present then it'll return the root category
 * If not new category is created with parent_id as null and name as root and return the root category.
 */
const initCategory = async (req,res) => {
  try {
    const _id = '000000000000000000000000'
    const root = await Category.findOne({parent_id : new mongoose.Types.ObjectId(_id)});
    if(!root){
      const category = new Category({ name : 'root', parent_id : new mongoose.Types.ObjectId(_id) });
      await category.save();
      res.status(201).json({ ok : true,message: "Root data fetched successfully!", data : category });
    }else{
      res.status(200).json({ ok : true,message: "Root data fetched successfully!", data : root });
    }
  } catch (err) {
    res.status(500).json({ ok : false,message : err.message });
  }
}

/**
 * Description : Takes parent_id from the request and sends all the categories with same parent_id
 * @param {parent_id} req.params 
 * @returns categories
 */
const getCategories = async (req, res) => {
  try {
    const { parent_id } = req.params;
    const categories = await Category.find({ parent_id }).lean();
    if (!categories.length) {
      return res.status(404).json({ ok : false,message: "No categories found" });
    }
    res.status(200).json({ ok : true,message : "Categories fetched successfully!",data : categories});
  } catch (error) {
    res.status(500).json({ ok : false,message: "Internal server error" + error });
  }
};

/**
 * Description : Take name,parent_id from req.body and create a brand new category.
 * @param {name,parent_id} req.body
 * @returns Newly created category
 */
const createCategory = async (req, res) => {
  try {
    const { name, parent_id } = req.body;
    if(!mongoose.Types.ObjectId.isValid(parent_id)){
      res.status(400).json({ ok : false,message: "Invalid parent_id" });
    }
    const category = await Category.findById(parent_id)
    if(!category){
      res.status(404).json({ ok : false,message: "Invalid parent_id" });
    }
    const newCategory = new Category({ name, parent_id });
    await newCategory.save();
    res.status(201).json({ok : true, message: "Category created", category : newCategory });
  } catch (err) {
    res.status(500).json({ ok : false,message: err.message });
  }
};

/**
 * Description : Takes name,parent_id from req and update name or parent_id and return the category with updated data.
 * @param { name, parent_id } req.body
 * @returns updatedCategory
 */
const updateCategory = async (req, res) => {
  try {
    const { name, parent_id } = req.body;
    await Category.findByIdAndUpdate(req.params.id, { name, parent_id }, { new: true });
    res.status(200).json({ok : true, message: "Category updated successfully"});
  } catch (err) {
    res.status(500).json({ ok : false,message: err.message });
  }
};

/**
 * Description : Takes id as params and deletes the category and nested categories recursively
 * @param {id} req.body 
 * @returns Deletes the category with the id and recursively deletes it's children  
 */
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res
      .status(200)
      .json({ ok : true,message: "Category and its child category/categories deleted" });
  } catch (err) {
    res.status(500).json({ ok : false,message: err.message });
  }
};

module.exports = {
  initCategory,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
