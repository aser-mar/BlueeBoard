const Order =
  require("../models/Order");

const sendEmail =
  require("../utils/sendEmail");

// CREATE ORDER
const createOrder = async (req, res) => {
  try {
    console.log("CREATE ORDER HIT");

    const {
      customerName,
      phone,
      address,
      items,
      totalPrice,
    } = req.body;

    const order = await Order.create({
      user: req.user._id,
      customerName,
      phone,
      address,
      items,
      totalPrice,
    });

    console.log("ORDER CREATED:", order._id);

    // EMAIL (optional)
    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: "🛒 New Order Received",
      html: `
        <h2>New Order</h2>
        <p><b>Name:</b> ${order.customerName}</p>
        <p><b>Phone:</b> ${order.phone}</p>
        <p><b>Address:</b> ${order.address}</p>
        <p><b>Total:</b> ${order.totalPrice} EGP</p>
      `,
    });

    return res.status(201).json(order);

  } catch (error) {
    console.log("CREATE ORDER ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};



// GET USER ORDERS
const getMyOrders =
  async (req, res) => {

    try {

      const orders =
        await Order.find({
          user:
            req.user._id,
        })
          .populate(
            "items.product"
          )
          .sort({
            createdAt: -1,
          });

      res.json(orders);

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// GET ALL ORDERS (ADMIN)
const getOrders =
  async (req, res) => {

    try {

      const orders =
        await Order.find()
          .populate(
            "items.product"
          )
          .populate(
            "user",
            "name email"
          )
          .sort({
            createdAt: -1,
          });

      res
        .status(200)
        .json(orders);

    } catch (error) {

      console.log(
        "ORDER ERROR:",
        error
      );

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// UPDATE ORDER STATUS
const updateOrderStatus =
  async (req, res) => {

    try {

      const { status } =
        req.body;

      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {

        return res
          .status(404)
          .json({
            message:
              "Order not found",
          });
      }

      order.status =
        status;

      await order.save();

      return res
        .status(200)
        .json(order);

    } catch (error) {

      return res
        .status(500)
        .json({
          message:
            error.message,
        });
    }
  };

  // CANCEL ORDER (USER)
  const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // ensure owner
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    // prevent cancel after shipping
    if (["shipped", "delivered"].includes(order.status)) {
      return res.status(400).json({
        message: "Order cannot be cancelled now",
      });
    }

    order.status = "cancelled";
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrders,
  cancelOrder,
  updateOrderStatus,
};

