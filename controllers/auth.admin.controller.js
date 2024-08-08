import Admin from "../models/admin.model.js";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

// @desc Lohin api for admins
// @route /api/auth/admin/signup
// @access admin
export const loginAdmin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    let errorMsg = "";

    errors
      .array()
      .forEach((error) => (errorMsg += `for: ${error.path}, ${error.msg} \n`));
    return res.status(400).json({ error: errorMsg });
  }

  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(404).json({ error: "Invalid email or password" });
    }

    generateToken(res, admin._id, admin.isVerified, "admin", admin.type);

    res.status(200).json({
      message: "Admin Login Successful",
      user: {
        userId: admin._id,
        isVerified: admin.isVerified,
        adminType: admin.type,
      },
      userType: "admin",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc Logout api for students
// @route /api/auth/admin/logout
// @access admin
export const logoutAdmin = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Admin Logout Successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
