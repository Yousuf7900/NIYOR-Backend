const { ObjectId } = require('mongodb');
const { getDB } = require('../../config/db');

const db = getDB(); // Get initialized MongoDB instance

// Get all products
const getProducts = async (req, res) => {
    try {
        const products = await db.collection("products").find().toArray();
        res.send(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send({ message: "Failed to fetch products" });
    }
}

// Get a single product by ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await db.collection("products").findOne({ _id: new ObjectId(id) });
        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }
        res.send(product);
    } catch (error) {
        console.error("Error fetching product by ID:", error);
        res.status(500).send({ message: "Failed to fetch product" });
    }
}

// Create a new product
const createProduct = async (req, res) => {
    try {
        const data = { ...req.body };
        const result = await db.collection("products").insertOne({
            ...data,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        if (!result.acknowledged) {
            return res.status(500).send({ message: "Failed to create product" });
        }

        const createdProduct = await db.collection("products").findOne({ _id: result.insertedId });
        res.status(201).send(createdProduct); // Return the newly created product
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).send({ message: "Server error while creating product" });
    }
}

// Update an existing product by ID
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const data = { ...req.body };

        // Prevent overwriting _id
        delete data._id;

        const query = { _id: new ObjectId(id) };
        const result = await db.collection("products").updateOne(query, {
            $set: {
                ...data,
                updatedAt: new Date()
            }
        });

        if (result.matchedCount === 0) {
            return res.status(404).send({ message: "Product not found" });
        }

        const updatedProduct = await db.collection("products").findOne(query);
        res.send(updatedProduct);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).send({ message: "Server error while updating product" });
    }
}

// Delete a product by ID
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.collection("products").deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).send({ message: "Product not found" });
        }

        res.send({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).send({ message: "Server error while deleting product" });
    }
}

module.exports = { createProduct, deleteProduct, updateProduct, getProducts, getProductById };