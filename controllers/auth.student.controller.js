import Student from "../models/student.model.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import sendEmail from "../utils/sendEmail.js";
import { validationResult } from "express-validator";
import generateToken from "../utils/generateToken.js";
import jwt from "jsonwebtoken";

const generateOtp = () => {
  // create a six digit otp
  return crypto.randomInt(100000, 1000000).toString();
};

// @desc Signup api for students
// @route /api/auth/student/signup
// @access student
export const signupStudent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    let errorMsg = "";

    errors
      .array()
      .forEach((error) => (errorMsg += `for: ${error.path}, ${error.msg} \n`));
    return res.status(400).json({ error: errorMsg });
  }

  try {
    const { name, email, cms, department, password } = req.body;

    // check if student already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent && existingStudent.isVerified)
      return res.status(400).json({ error: "Student already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate OTP
    const otp = generateOtp();
    const otpExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes from now

    // if student exists but is not verified, update thier details
    if (existingStudent && !existingStudent.isVerified) {
      // Check if OTP is still valid
      if (existingCustomer.otpExpiry > Date.now()) {
        const remainingTime = (existingCustomer.otpExpiry - Date.now()) / 1000;
        return res.status(400).json({
          error: `OTP already sent. Verify Account or Try again in ${Math.ceil(
            remainingTime
          )} seconds`,
        });
      } else {
        // update the existing student details
        existingStudent.name = name;
        existingStudent.email = email;
        existingStudent.cms = cms;
        existingStudent.department = department;
        existingStudent.password = hashedPassword;
        existingStudent.otp = otp;
        existingStudent.otpExpiry = otpExpiry;

        await existingStudent.save();

        //   send new otp to email
        await sendEmail(
          email,
          "SIT OTP Code",
          `Welcome to Student Issue Tracking Sytem, Your OTP code is ${otp}\nIf you have not requested the OTP please ignore this email.`
        );

        return res.status(200).json({
          message: "New OTP sent to email.",
        });
      }
    }

    // create new student
    const newStudent = new Student({
      name,
      email,
      cms,
      department,
      password: hashedPassword,
      otp,
      otpExpiry,
    });

    Promise.all([
      await newStudent.save(),
      await sendEmail(
        email,
        "SIT OTP Code",
        `Welcome to Student Issue Tracking Sytem, Your OTP code is ${otp}\nIf you have not requested the OTP please ignore this email.`
      ),
    ]);

    generateToken(res, newStudent._id, newStudent.isVerified);

    res.status(201).json({
      message:
        "Student Account created successfully otp sent to email, Please login and verify yout Account",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc Login api for students
// @route /api/auth/student/login
// @access student
export const loginStudent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let errorMsg = "";

    errors
      .array()
      .forEach((error) => (errorMsg += `for: ${error.path}, ${error.msg} \n`));
    return res.status(400).json({ error: errorMsg });
  }

  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });

    if (!student)
      return res.status(401).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch)
      return res.status(401).json({ error: "Invalid email or password" });

    generateToken(res, student._id, student.isVerified);

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc Logout api for students
// @route /api/auth/student/logout
// @access student
export const logoutStudent = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc students verify the otp when a new account is created
// @route /api/auth/student/verify-otp
// @access student
export const verifyOtpStudent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let errorMsg = "";

    errors
      .array()
      .forEach((error) => (errorMsg += `for: ${error.path}, ${error.msg} \n`));
    return res.status(400).json({ error: errorMsg });
  }

  const { otp } = req.body;

  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ error: "Access Denied, No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const studentId = decoded.userId;

    const student = await Student.findById(studentId);

    if (!student) return res.status(404).json({ error: "Student not found" });

    if (student.isVerified) {
      return res.status(400).json({ error: "Account already verified" });
    }

    if (student.otp !== otp) {
      return res.status(401).json({ error: "Invalid OTP" });
    }

    if (student.otpExpiry < Date.now()) {
      return res
        .status(401)
        .json({ error: "OTP expired \nPlease request another" });
    }

    student.isVerified = true;
    student.otp = null;
    student.otpExpiry = null;
    await student.save();

    generateToken(res, student._id, student.isVerified);

    res.status(200).json({ message: "Account verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server error" });
  }
};

// @desc students request new otp if the current one has expired
// @route /api/auth/student/request-new-otp
// @access student
export const requestNewOtp = async (req, res) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ error: "Access Denied, No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const studentId = decoded.userId;

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ error: "Student not found" });

    if (student.isVerified) {
      return res.status(400).json({ error: "Account already verified" });
    }

    // check for otp expiry if otp has not expired yet return error
    if (student.otpExpiry > Date.now()) {
      const remainingTime = (student.otpExpiry - Date.now()) / 1000;
      return res.status(400).json({
        error: `OTP already sent. Verify Account or Try again in ${Math.ceil(
          remainingTime
        )} seconds`,
      });
    }

    // Generate new OTP
    const otp = generateOtp();
    const otpExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes from now

    student.otp = otp;
    student.otpExpiry = otpExpiry;

    Promise.all([
      await student.save(),
      await sendEmail(
        customer.email,
        "Your OTP Code",
        `Your OTP code is ${otp}`
      ),
    ]);

    res
      .status(200)
      .json({ message: `New OTP sent to email. \n${student.email}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server error" });
  }
};
