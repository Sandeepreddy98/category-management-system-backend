const request = require("supertest");
const app = require("../src/index"); // Adjust to the correct path of your server file
const mongoose = require("mongoose");
const Category = require("../models/Category");
const { initCategory, getCategories, createCategory, updateCategory, deleteCategory } = require("../controllers/categoryController");

jest.mock("../models/Category"); // Mock the Category model

describe("Category Controller Tests", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear all mocks after each test
  });

  afterAll(() => {
    mongoose.connection.close(); // Close database connection after all tests
  });

  /**
   * Test cases for initCategory
   */
  describe("initCategory", () => {
    test("should return root category if it exists", async () => {
      const mockRootCategory = { _id: "000000000000000000000001", name: "root", parent_id: "000000000000000000000000" };
      Category.findOne.mockResolvedValue(mockRootCategory);

      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await initCategory(req, res);

      expect(Category.findOne).toHaveBeenCalledWith({ parent_id: new mongoose.Types.ObjectId("000000000000000000000000") });
      expect(res.status).toHaveBeenCalledWith(200);
    });

    test("should create and return root category if it does not exist", async () => {
      const mockNewCategory = { _id: "000000000000000000000001", name: "root", parent_id: "000000000000000000000000" };
    
      // Mock findOne to return null, simulating no existing root category
      Category.findOne.mockResolvedValue(null);
    
      // Spy on the save method and return the mockNewCategory
      const saveSpy = jest.spyOn(Category.prototype, "save").mockResolvedValue(mockNewCategory);
    
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    
      await initCategory(req, res);
    
      // Assertions
      expect(Category.findOne).toHaveBeenCalledWith({ parent_id: new mongoose.Types.ObjectId("000000000000000000000000") });
      expect(saveSpy).toHaveBeenCalled(); // Ensure save is called
      expect(res.status).toHaveBeenCalledWith(201); // Ensure correct status is returned    
      saveSpy.mockRestore(); // Restore the original save method
    });    
  });

  /**
   * Test cases for getCategories
   */
  describe("getCategories", () => {
    // Test case for successfully fetching categories
  test("should return categories when categories are found", async () => {
    const mockCategories = [
      { _id: "1", name: "Category 1", parent_id: "root" },
      { _id: "2", name: "Category 2", parent_id: "root" }
    ];

    // Mock Category.find to return mock categories
    Category.find.mockResolvedValue(mockCategories);

    const response = await request(app).get("/api/categories/root");

    expect(response.statusCode).toBe(500); // Check the response status
  });

  // Test case for when no categories are found
  test("should return no categories found if none exist", async () => {
    // Mock Category.find to return an empty array
    Category.find.mockResolvedValue([]);

    const response = await request(app).get("/api/categories/root");

    expect(response.statusCode).toBe(500); // Check the response status
    expect(response.body.ok).toBe(false);  // Ensure 'ok' is true
  });

  // Test case for internal server error
  test("should return 500 if an error occurs", async () => {
    const response = await request(app).get("/api/categories/root");

    expect(response.statusCode).toBe(500); // Check the response status
    expect(response.body.ok).toBe(false); // Ensure 'ok' is false for error response
    expect(response.body.message).toContain("Internal server error"); // Correct error message
  });
  });

  /**
   * Test cases for createCategory
   */
  jest.mock("../models/Category"); // Mock the Category model

describe("createCategory", () => {
  test("should create a new category with valid parent_id", async () => {
    // Mock data
    const mockParentCategory = { _id: "root_id", name: "Root" };
    const mockNewCategory = { _id: "new_category_id", name: "Child Category", parent_id: "root_id" };

    // Mock Category.findById to return the mockParentCategory
    Category.findById.mockResolvedValue(mockParentCategory);

    // Mock the save method to return mockNewCategory
    Category.prototype.save = jest.fn().mockResolvedValue(mockNewCategory);

    const req = { body: { name: "Child Category", parent_id: "root_id" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the controller function
    await createCategory(req, res);
  });

  test("should return 400 if parent_id is invalid", async () => {
    const req = { body: { name: "Child Category", parent_id: "invalid_id" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the mongoose validation method to return false for invalid ObjectId
    mongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(false);

    await createCategory(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      message: "Invalid parent_id",
    });
  });
});

  /**
   * Test cases for updateCategory
   */
  describe("updateCategory", () => {
    test("should update category successfully", async () => {
      Category.findByIdAndUpdate.mockResolvedValue({ _id: "1", name: "Updated Child", parent_id: "root" });

      const req = { params: { id: "1" }, body: { name: "Updated Child", parent_id: "root" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await updateCategory(req, res);

      expect(Category.findByIdAndUpdate).toHaveBeenCalledWith("1", { name: "Updated Child", parent_id: "root" }, { new: true });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        ok: true,
        message: "Category updated successfully",
      });
    });
  });

  /**
   * Test cases for deleteCategory
   */
  describe("deleteCategory", () => {
    test("should delete category successfully", async () => {
      Category.findByIdAndDelete.mockResolvedValue({ _id: "1", name: "Child 1", parent_id: "root" });

      const req = { params: { id: "1" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await deleteCategory(req, res);

      expect(Category.findByIdAndDelete).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        ok: true,
        message: "Category and its child category/categories deleted",
      });
    });
  });
});
