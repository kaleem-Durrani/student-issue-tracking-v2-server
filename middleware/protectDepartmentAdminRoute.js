import jwt from "jsonwebtoken";
import Admin from "../models/student.model.js";

const JWT_SECRET = process.env.JWT_SECRET;

const protectDepartmentAdminRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ error: "Access Denied, No token provided." });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized, Invalid token." });
    }

    const admin = await Admin.findById(decoded.userId).select("-password");

    if (!admin) {
      return res.status(404).json({ error: "Admin not found." });
    }

    if (!admin.isVerified) {
      return res
        .status(403)
        .json({ error: "Access Denied, Admin account not verified." });
    }

    if (admin.type === "mainAdmin") {
      return res
        .status(403)
        .json({ error: "Access Denied, Department admin access only." });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.log("Error in protect admin route", error);

    return res.status(400).json({ error: "Invalid token." });
  }
};

export default protectDepartmentAdminRoute;
