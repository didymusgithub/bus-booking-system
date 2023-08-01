const router = require("express").Router();
const User = require("../models/usersModel");
const bycrpt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");

// register new user
router.post("/register", async (req, res) => {
  // this route checks if the user alreaady exist or not
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.send({
        message: "User already exist",
        success: true,
        data: null,
      });
    }

    // hashing the password for the new user
    const hashedPassword = await bycrpt.hash(req.body.password, 10);
    req.body.password = hashedPassword;
    const newUser = new User(req.body);
    await newUser.save();
    res.send({
      message: "user created succesfully",
      success: true,
      data: null,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
      data: null,
    });
  }
});

// login user

router.post("/login", async (req, res) => {
  try {
    const UserExist = await User.findOne({ email: req.body.email });
    if (!UserExist) {
      return res.send({
        message: "User deos not exist",
        success: false,
        data: null,
      });
    }

    if (UserExist.isBlocked) {
      return res.send({
        message: "User is blocked",
        success: false,
        data: null,
      });
    }

    // function to compare the p[assword if it exist or not]
    const passwordMatch = await bycrpt.compare(
      req.body.password,
      UserExist.password
    );

    if (!passwordMatch) {
      return res.send({
        message: "Password don't match",
        success: false,
        data: null,
      });
    }

    // generating the user token
    const token = jwt.sign(
      {
        userId: UserExist.id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );
    res.send({
      message: "User logged in succesfully",
      success: true,
      data: token,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
      data: null,
    });
  }
});

// get user by id

router.post("/get-user-by-id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    res.send({
      message: "User fetched succesfully",
      success: true,
      data: user,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
      data: null,
    });
  }
});

// get all users

router.post("/get-all-users", authMiddleware, async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find({});

    // Send the users as the response
    res.send({
      message: "Users fetched successfully",
      success: true,
      data: users,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
      data: null,
    });
  }
});

// update user
router.post("/update-user-permissions", authMiddleware, async (req, res) => {
  try {
    const users = await User.findByIdAndUpdate(req.body._id, req.body);
    res.send({
      message: "user permission updated succesfully",
      success: true,
      data: null,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
      data: null,
    });
  }
});

module.exports = router;
