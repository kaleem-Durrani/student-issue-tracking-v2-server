import jwt from "jsonwebtoken";
import Student from "../models/student.model.js";

const JWT_SECRET = process.env.JWT_SECRET;

const protectStudentRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ error: "Access Denied, No token provided." });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ error: "UnAuthorized, Invalid token." });
    }

    const student = await Student.findById(decoded.userId).select("-password");

    if (!student) {
      return res.status(404).json({ error: "Student not found." });
    }

    if (!student.isVerified) {
      return res
        .status(403)
        .json({ error: "Access Denied, Student account not verified." });
    }

    req.student = student;
    next();
  } catch (error) {
    console.log("Error in protect admin route", error);

    return res.status(400).json({ error: "Invalid token." });
  }
};

export default protectStudentRoute;
