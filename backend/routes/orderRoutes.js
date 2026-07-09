const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const router = express.Router();

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post("/", protect, async (req, res) => {
  const { shippingAddress } = req.body;

  try {
    const user = await User.findById(req.user._id).populate("cart.product");

    if (user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Prepare order items and calculate total
    const orderItems = [];
    let totalAmount = 0;

    for (const item of user.cart) {
      const product = await Product.findById(item.product._id);

      if (item.quantity > product.stock) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}`,
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });

      totalAmount += product.price * item.quantity;

      // Reduce product stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
    });

    // Clear user's cart
    user.cart = [];
    await user.save();

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @desc    Get logged-in user's orders
// @route   GET /api/orders
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if order belongs to current user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
