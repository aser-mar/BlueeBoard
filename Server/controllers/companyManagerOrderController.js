const Order = require("../models/Order");
const Product = require("../models/Product");

// GET ORDERS FOR MY COMPANY (only items belonging to my company)
const getMyCompanyOrders = async (req, res) => {
  try {
    const companyId = req.user.company;

    // Find all product IDs belonging to this company
    const myProducts = await Product.find({ company: companyId }).select("_id");
    const myProductIds = myProducts.map((p) => p._id.toString());

    // Find all orders that contain at least one of my products
    const orders = await Order.find({
      "items.product": { $in: myProductIds },
    })
      .populate("items.product")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    // Filter each order's items to only include this company's products,
    // and recalculate a company-specific subtotal
    const filteredOrders = orders.map((order) => {
      const myItems = order.items.filter(
        (item) =>
          item.product &&
          myProductIds.includes(item.product._id.toString())
      );

      const companySubtotal = myItems.reduce((sum, item) => {
        return sum + (item.product?.price || 0) * item.quantity;
      }, 0);

      return {
        _id: order._id,
        customerName: order.customerName,
        phone: order.phone,
        address: order.address,
        paymentMethod: order.paymentMethod,
        status: order.status,
        createdAt: order.createdAt,
        user: order.user,
        items: myItems,
        companySubtotal,
      };
    });

    res.json(filteredOrders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE ORDER STATUS (only if order contains my company's products)
const updateMyCompanyOrderStatus = async (req, res) => {
  try {
    const companyId = req.user.company;
    const { status } = req.body;

    const order = await Order.findById(req.params.id).populate("items.product");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const hasMyProduct = order.items.some(
      (item) =>
        item.product &&
        item.product.company &&
        item.product.company.toString() === companyId.toString()
    );

    if (!hasMyProduct) {
      return res.status(403).json({
        message: "Not authorized to update this order",
      });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getMyCompanyOrders,
  updateMyCompanyOrderStatus,
};
