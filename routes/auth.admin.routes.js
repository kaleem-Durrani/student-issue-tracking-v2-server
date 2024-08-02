import express from "express";
import { body } from "express-validator";
import {
  loginAdmin,
  logoutAdmin,
} from "../controllers/auth.admin.controller.js";

const router = express.Router();

const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .isEmail()
    .withMessage("Please enter a valid email address"),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

router.post("/login", loginValidation, loginAdmin);

router.post("/logout", logoutAdmin);

export default router;
