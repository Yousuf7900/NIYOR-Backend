const { ObjectId } = require("mongodb");
const { getDB } = require("../../../config/db")

//post products to cart
const addCart = async (req, res) => {
    const db = getDB();
    try {
        const { email, productId, uid, name, price, qty, size, image } = req.body;
        if (!email || !productId || !name || price == null || qty == null) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing"
            });
        }

        const existingItem = await db.collection('carts').findOne({ email, productId, size: size || null });

        if (existingItem) {
            await db.collection('carts').updateOne({ _id: existingItem._id }, {
                $inc: { qty: qty },
                $set: { updatedAt: new Date() }
            });
            return res.status(200).json({
                success: true,
                message: "Cart quantity updated successfully"
            })
        }

        const cartItem = {
            email,
            productId,
            uid: uid || null,
            name,
            price,
            qty,
            size: size || null,
            image: image || null,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection("carts").insertOne(cartItem);

        return res.status(201).json({
            success: true,
            message: "Product added to cart successfully",
            insertedId: result.insertedId
        });
    } catch (error) {
        console.log("Add cart error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to add product to cart"
        });
    }
}

// now get cart details using email
const getCartByEmail = async (req, res) => {
    const db = getDB();

    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const cartItems = await db.collection('carts').find({ email }).sort({ createdAt: -1 }).toArray();

        return res.status(200).json({
            success: true,
            message: "Cart items fetched successfully",
            data: cartItems
        });

    } catch (error) {
        console.log("Get cart error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch cart items"
        });
    }
}

//update cart quantity
const updateCartQty = async (req, res) => {
    const db = getDB();

    try {
        const { id } = req.params;
        const { qty } = req.body;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid cart item id"
            });
        }

        const qtyNumber = Number(qty);

        if (!qtyNumber || qtyNumber < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1"
            });
        }

        const result = await db.collection("carts").updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    qty: qtyNumber,
                    updatedAt: new Date()
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Cart quantity updated successfully"
        });
    } catch (error) {
        console.log("Update cart qty error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to update cart quantity"
        });
    }
}

// Delete one item from cart
const deleteCartItem = async (req, res) => {
    const db = getDB();
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid cart item id"
            });
        }

        const result = await db.collection("carts").deleteOne({
            _id: new ObjectId(id)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Cart item deleted successfully"
        });
    } catch (error) {
        console.log("Delete cart item error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to delete cart item"
        });
    }
}

// Clear all cart items by email
const clearCartByEmail = async (req, res) => {
    const db = getDB();
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }
        const result = await db.collection('carts').deleteMany({ email });

        return res.status(200).json({
            success: true,
            message: "Cart cleared successfully",
            deletedCount: result.deletedCount
        })
    } catch (error) {
        console.log("Clear cart error", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed ot clear cart"
        });
    }
}

module.exports = { addCart, getCartByEmail, deleteCartItem, clearCartByEmail, updateCartQty };