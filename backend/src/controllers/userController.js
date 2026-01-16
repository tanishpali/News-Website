const userModel = require("../models/userModel");
const {
  isValid,
  isValidName,
  isValidEmail,
  isValidPhone,
  isValidPassword,
} = require("./validator");

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");


const addUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      countryCode,
      mobileNumber,
      state,
      city,
    } = req.body;

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ msg: "No data provided" });
    }

    // Name
    if (!isValid(firstName) || !isValidName(firstName))
      return res.status(400).json({ msg: "Invalid first name" });

    if (!isValid(lastName) || !isValidName(lastName))
      return res.status(400).json({ msg: "Invalid last name" });

    // Email
    if (!isValid(email) || !isValidEmail(email))
      return res.status(400).json({ msg: "Invalid email" });

    if (await userModel.findOne({ email }))
      return res.status(400).json({ msg: "Email already exists" });

    // Mobile
    if (!isValid(countryCode))
      return res.status(400).json({ msg: "Country code required" });

    if (!isValid(mobileNumber) || !isValidPhone(mobileNumber))
      return res.status(400).json({ msg: "Invalid mobile number" });

    if (await userModel.findOne({ mobileNumber }))
      return res.status(400).json({ msg: "Mobile number already exists" });

    // Password
    if (!isValid(password) || !isValidPassword(password))
      return res.status(400).json({ msg: "Invalid password format" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      countryCode,
      mobileNumber,
      state,
      city,
    });

    return res.status(201).json({
      msg: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: error.message, error: error });
  }
};

/* =========================
   LOGIN USER
========================= */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!isValid(email) || !isValidEmail(email))
      return res.status(400).json({ msg: "Invalid email" });

    if (!isValid(password))
      return res.status(400).json({ msg: "Password required" });

    const user = await userModel.findOne({ email });
    if (!user)
      return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      msg: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: error.message, error: error });
  }
};

/* =========================
   GET LOGGED-IN USER
========================= */
const getUser = async (req, res) => {
  try {
    // User is already attached to req by the protect middleware
    const user = req.user;

    if (!user) return res.status(404).json({ msg: "User not found" });

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

/* =========================
   UPDATE USER
========================= */
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.status(400).json({ msg: "Invalid user id" });

    if (userId !== req.user.id)
      return res.status(403).json({ msg: "Unauthorized" });

    const data = req.body;

    if (data.password) {
      if (!isValidPassword(data.password))
        return res.status(400).json({ msg: "Invalid password" });

      data.password = await bcrypt.hash(data.password, 10);
    }

    if (data.email && !isValidEmail(data.email))
      return res.status(400).json({ msg: "Invalid email" });

    if (data.mobileNumber && !isValidPhone(data.mobileNumber))
      return res.status(400).json({ msg: "Invalid mobile number" });

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      data,
      { new: true }
    );

    return res.status(200).json({
      msg: "User updated successfully",
      updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

/* =========================
   DELETE USER
========================= */
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (userId !== req.user.id)
      return res.status(403).json({ msg: "Unauthorized" });

    await userModel.findByIdAndDelete(userId);
    return res.status(200).json({ msg: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = {
  addUser,
  loginUser,
  getUser,
  updateUser,
  deleteUser,
};
