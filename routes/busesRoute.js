const router = require("express").Router();
const Bus = require("../models/BusModel");
const authMiddleware = require("../middlewares/authMiddleware");

// add bus
router.post("/add-bus", async (req, res) => {
  try {
    const existingBus = await Bus.findOne({
      number: req.body.number,
    });
    if (existingBus) {
      res.send({
        success: false,
        message: "Bus already exists",
      });
    }
    const newBus = new Bus(req.body);
    await newBus.save();
    return res.send({
      success: true,
      message: "Bus added sucesfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// update bus
router.post("/update-bus", authMiddleware, async (req, res) => {
  try {
    await Bus.findByIdAndUpdate(req.body._id, req.body);

    return res.send({
      success: true,
      message: "bus updated successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// Delete bus

router.post("/delete-bus", authMiddleware, async (req, res) => {
  try {
    await Bus.findByIdAndDelete(req.body._id);
    res.send({
      success: true,
      message: "Bus deleted succesfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// get all buses
router.post("/get-all-buses", authMiddleware, async (req, res) => {
  try {
    const buses = await Bus.find(req.body.filter);
    return res.send({
      success: true,
      data: buses,
      message: "Buses fetched successfully",
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

// get-bus by id
router.post("/get-bus-by-id", authMiddleware, async (req, res) => {
  try {
    const bus = await Bus.findById(req.body._id);
    return res.send({
      success: true,
      message: "Bus Fetched succesfully",
      data: bus,
    });
  } catch (error) {
    res.send({
      succes: false,
      message: error.message,
    });
  }
});


module.exports = router;
