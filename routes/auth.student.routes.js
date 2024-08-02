import express from "express";
import { body } from "express-validator";
import {
  loginStudent,
  logoutStudent,
  requestNewOtp,
  signupStudent,
  verifyOtpStudent,
} from "../controllers/auth.student.controller.js";

const router = express.Router();

const signupValidation = [
  body("name")
    .trim()
    .notEmpty()
    .isString()
    .withMessage("Student name is required"),
  body("email")
    .trim()
    .notEmpty()
    .isEmail()
    .withMessage("Valid email address is required"),
  body("cms")
    .trim()
    .notEmpty()
    .isString()
    .isLength({ min: 5, max: 5 })
    .withMessage("Cms of 5 characters is required"),
  body("department")
    .trim()
    .notEmpty()
    .isString()
    .withMessage("Student department is required"),
  body("password")
    .trim()
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("confirmPassword")
    .trim()
    .notEmpty()
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords must match"),
];

const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .isEmail()
    .withMessage("Valid email address is required"),
  body("password")
    .trim()
    .notEmpty()
    .isString()
    .withMessage("Password is required"),
];

const otpValidation = [
  body("otp")
    .trim()
    .notEmpty()
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP is required and must be at least 6 characters long"),
];

router.post("/signup", signupValidation, signupStudent);

router.post("/login", loginValidation, loginStudent);

router.post("/logout", logoutStudent);

router.post("/verify-otp", otpValidation, verifyOtpStudent);

router.post("/request-new-otp", requestNewOtp);

export default router;
