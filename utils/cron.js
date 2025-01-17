const cron = require("node-cron");
const Category = require("../models/Category");

/**
 * CRON job to clean up orphaned categories except those with '000000000000000000000000' as parentId
 */
const cleanupOrphanedCategories = async () => {
  try {
    console.log("Starting cleanup of orphaned categories...");

    // Find orphaned categories using aggregation
    const orphanedCategories = await Category.aggregate([
      {
        $lookup: {
          from: "categories", // Collection name for Category
          localField: "parentId",
          foreignField: "_id",
          as: "parentCategory",
        },
      },
      {
        $match: {
          parentCategory: { $size: 0 }, // No parent found
          parent_id: { $ne: "000000000000000000000000" }, // Exclude this specific parentId since it's the root
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          parentId: 1,
        },
      },
    ]);

    if (orphanedCategories.length > 0) {
      const idsToDelete = orphanedCategories.map((category) => category._id);

      // Delete orphaned categories
      await Category.deleteMany({ _id: { $in: idsToDelete } });

      console.log(`Deleted ${idsToDelete.length} orphaned categories.`);
    } else {
      console.log("No orphaned categories found.");
    }
  } catch (error) {
    console.error("Error cleaning up orphaned categories:", error);
  }
};

// Schedule the CRON job to run every hour
cron.schedule("0 * * * *", async () => {
  await cleanupOrphanedCategories();
  console.log("Orphaned categories cleanup job executed.");
});
