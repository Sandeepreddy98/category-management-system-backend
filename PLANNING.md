
# Category-Management-System

# Step 1: Low-Level Design (LLD)
## Core Functionality
 ### 1. CRUD Operations:
 - Create categories at any level (root or nested).
 - Update category names and relationships.
 - Delete a category and all its child categories.
### 2. Tree View Representation:
 - Query the categories in a hierarchical format.
## Logical Flow
 - Store categories in a tree-like structure using a parent-child relationship in MongoDB.
- Use a RESTful API architecture for backend services.
- Ensure efficient handling of nested categories.

# Step 2: Database Design
 ### Schema Design
 We’ll use a single `categories` collection with the following schema:
 | Field | Type    | Description                |
| :-------- | :------- | :------------------------- |
| `_id` | `ObjectId` | Unique identifier for the category. |
| `name` | `String` | Name of the category. |
| `parent_id` | `ObjectId(nullable)` | Points to the parent category. `null` for root categories. |
| `createdAt` | `Date` | Timestamp for when the category was created. |
| `updatedAt` | `Date` | Timestamp for when the category was last updated. |

# Step 3: API Design
| Method | Endpoint    | Description                |
| :-------- | :------- | :------------------------- |
| `GET` | `/categories` | Fetch all categories in a hierarchical tree structure. |
| `POST` | `/categories` | Create a new category. |
| `PUT` | `/categories/:id` | Update an existing category's name or parent-child relationship. |
| `DELETE` | `/categories/:id` | Delete a category and all its child categories. |

