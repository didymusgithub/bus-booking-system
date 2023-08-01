const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Booking = require("../models/BookingsModel");
const Bus = require("../models/BusModel");
const stripe = require("stripe")(process.env.STRIPE_KEY);
const { v4: uuidv4 } = require("uuid");
const uniqueId = uuidv4();

// Book a seat
router.post("/book-seat", authMiddleware, async (req, res) => {
  try {
    const newBooking = new Booking({
      ...req.body,
      user: req.body.userId,
    });
    await newBooking.save();

    const bus = await Bus.findById(req.body.bus);
    bus.seatsBooked.push(...req.body.index);
    await bus.save();

    res.send({
      success: true,
      message: "Booking successful",
      data: newBooking,
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Booking failed",
      data: error,
    });
  }
});

// make payment

router.post("/make-payment", authMiddleware, async (req, res) => {
  try {
    const { token, amount } = req.body;
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });
    const payment = await stripe.paymentIntents.create(
      {
        amount: amount,
        currency: "inr",
        customer: customer.id,
        receipt_email: token.email,
      },
      {
        // Generate a new idempotency key for each request
        idempotencyKey: uuidv4(),
      }
    );

    if (payment) {
      res.send({
        message: "Payment successful",
        data: {
          transactionId: payment.id,
        },
        success: true,
      });
    } else {
      res.send({
        message: "Payment failed",
        success: false,
      });
    }
  } catch (error) {
    res.send({
      success: false,
      message: "Payment Failed",
      data: error,
    });
  }
});

// get bookings by user id
router.post("/get-bookings-by-user-id", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.body.userId })
      .populate("bus")
      .populate("user");
    res.send({
      message: "Bookings fetched succesfully",
      data: bookings,
      success: true,
    });
  } catch (error) {
    res.send({
      message: "Bookings fetch failed",
      data: error,
      success: false,
    });
  }
});

module.exports = router;
