import express from "express";
import { body } from "express-validator";
import protectStudentRoute from "../middleware/protectStudentRoute.js";
import {
  addIssue,
  assignIssue,
  getAllIssues,
  getDepartmentIssues,
  getStudentIssues,
  rejectIssue,
  updateIssueStatus,
} from "../controllers/issue.controller.js";
import protectAdminRoute from "../middleware/protectAdminRoute.js";
import protectDepartmentAdminRoute from "../middleware/protectDepartmentAdminRoute.js";

const router = express.Router();

const addIssueValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("priority")
    .trim()
    .notEmpty()
    .isIn(["Low", "Medium", "High"])
    .withMessage("Priority is required"),
  body("department")
    .trim()
    .notEmpty()
    .isIn(["Transport", "Academic", "Discipline", "Student Affairs"])
    .withMessage("Department is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
];

const assignIssueValidation = [
  body("issueId")
    .trim()
    .notEmpty()
    .isString()
    .withMessage("Issue Id is required"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("priority")
    .trim()
    .notEmpty()
    .isIn(["Low", "Medium", "High"])
    .withMessage("Priority is required"),
  body("department")
    .trim()
    .notEmpty()
    .isIn(["Transport", "Academic", "Discipline", "Student Affairs"])
    .withMessage("Category is required"),
];

const rejectIssueValidation = [
  body("issueId")
    .trim()
    .notEmpty()
    .isString()
    .withMessage("Issue Id is required"),
];

const updateIssueStatusValidation = [
  body("issueId")
    .trim()
    .notEmpty()
    .isString()
    .withMessage("Issue Id is required"),
  body("status")
    .trim()
    .notEmpty()
    .isIn(["Assigned", "In Progress", "Resolved"])
    .withMessage("Status is required"),
];

router.post("/create-issue", addIssueValidation, protectStudentRoute, addIssue);

router.get("/get-student-issues", protectStudentRoute, getStudentIssues);

router.get("/get-all-issues", protectAdminRoute, getAllIssues);

router.put(
  "/assign-issue",
  assignIssueValidation,
  protectAdminRoute,
  assignIssue
);

router.put(
  "/reject-issue",
  rejectIssueValidation,
  protectAdminRoute,
  rejectIssue
);

router.get(
  "/get-department-issues",
  protectDepartmentAdminRoute,
  getDepartmentIssues
);

router.put(
  "/update-issue-status",
  updateIssueStatusValidation,
  protectDepartmentAdminRoute,
  updateIssueStatus
);

export default router;
