const cron = require("node-cron");
const Category = require("../models/Category");
const cleanupOrphanedCategories = require("../utils/cron");

jest.mock("../models/Category"); // Mock the Category model
jest.useFakeTimers(); // Use fake timers to control cron job execution

describe("Cleanup Orphaned Categories Cron Job", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear any mocks before each test
  });

  test("should run the cron job and clean up orphaned categories", async () => {
    const mockOrphanedCategories = [
      { _id: "1", name: "Category 1", parentId: "parent1" },
      { _id: "2", name: "Category 2", parentId: "parent2" },
    ];

    // Mock Category.aggregate to return orphaned categories
    Category.aggregate.mockResolvedValue(mockOrphanedCategories);

    // Mock Category.deleteMany to simulate deletion
    Category.deleteMany.mockResolvedValue({ deletedCount: mockOrphanedCategories.length });

    // Mock console.log to capture output
    console.log = jest.fn();

    // Simulate cron job execution
    await cleanupOrphanedCategories();
  });

  test("should handle errors gracefully", async () => {
    // Mock Category.aggregate to throw an error
    Category.aggregate.mockRejectedValue(new Error("Database error"));

    // Capture console.error
    console.error = jest.fn();

    // Run the cleanup function, which should catch and log the error
    await cleanupOrphanedCategories();

    // Assertions
    expect(console.error).toHaveBeenCalledWith("Error cleaning up orphaned categories:", new Error("Database error"));
  });

  test("should not delete orphaned categories if none are found", async () => {
    // Mock Category.aggregate to return an empty array
    Category.aggregate.mockResolvedValue([]);

    // Mock Category.deleteMany to simulate no deletion
    Category.deleteMany.mockResolvedValue({ deletedCount: 0 });

    // Simulate cron job execution
    await cleanupOrphanedCategories();

    // Assertions
    expect(Category.deleteMany).not.toHaveBeenCalled(); // No orphaned categories, so delete should not be called
  });
});
