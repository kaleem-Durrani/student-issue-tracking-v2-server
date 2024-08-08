import Issue from "../models/issue.model.js";
import { validationResult } from "express-validator";

// @desc Students creates a new issue
// @route /api/issue/create-issue
// @access student
export const addIssue = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    let errorMsg = "";

    errors
      .array()
      .forEach((error) => (errorMsg += `for: ${error.path}, ${error.msg} \n`));
    return res.status(400).json({ error: errorMsg });
  }

  const studentId = req.student._id;

  const { title, category, priority, department, description } = req.body;

  try {
    const newIssue = new Issue({
      title,
      category,
      priority,
      department,
      description,
      createdBy: studentId,
    });

    await newIssue.save();

    res.status(201).json({ message: "Issue added successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc Students gets his posted issues
// @route /api/issue/get-student-issues
// @access student
export const getStudentIssues = async (req, res) => {
  const studentId = req.student._id;

  try {
    // find a students posted issues in the database
    const issues = await Issue.find({ createdBy: studentId })
      .sort({
        createdAt: -1,
      })
      .populate("createdBy", "name cms email department");

    // if no issues are found
    if (issues.length === 0) {
      return res
        .status(404)
        .json({ error: "No issues found for this student" });
    }

    res.status(200).json({ message: "Issues retreived successfully", issues });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc main admin gets all posted issues
// @route /api/issue/get-all-issues
// @access main admin
export const getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email cms department");

    if (issues.length === 0) {
      return res.status(404).json({ error: "No issues found in the database" });
    }

    res.status(200).json({ message: "Issues retreived successfully", issues });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc department admin issue assigned to his department
// @route /api/issue/get-department-issues
// @access department admin
export const getDepartmentIssues = async (req, res) => {
  const departmentAdmin = req.admin;

  try {
    const department = departmentAdmin.type;

    // find issues by department where status is not equal to Pending or Rejected
    const issues = await Issue.find({
      department,
      status: { $nin: ["Pending", "Rejected"] },
    })
      .sort({
        createdAt: -1,
      })
      .populate("createdBy", "name cms email department");

    if (issues.length === 0) {
      return res
        .status(404)
        .json({ error: "No issues found for this department" });
    }

    res.status(200).json({ message: "Issues retreived successfully", issues });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc main admin assigns issue to a department
// @route /api/issue/assign-issue
// @access main admin
export const assignIssue = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    let errorMsg = "";

    errors
      .array()
      .forEach((error) => (errorMsg += `for: ${error.path}, ${error.msg} \n`));
    return res.status(400).json({ error: errorMsg });
  }

  const { issueId, category, department, priority } = req.body;

  try {
    const issue = await Issue.findByIdAndUpdate(
      issueId,
      { category, department, priority, status: "Assigned" },
      { new: true }
    );

    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    res
      .status(200)
      .json({ message: `Issue assigned to ${department} successfully` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc main admin rejects an issue
// @route /api/issue/reject-issue
// @access main admin
export const rejectIssue = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    let errorMsg = "";

    errors
      .array()
      .forEach((error) => (errorMsg += `for: ${error.path}, ${error.msg} \n`));
    return res.status(400).json({ error: errorMsg });
  }

  const { issueId } = req.body;

  try {
    const issue = await Issue.findByIdAndUpdate(
      issueId,
      { status: "Rejected" },
      { new: true }
    );

    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    res.status(200).json({ message: "Issue rejected successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc department admin updares issue status
// @route /api/issue/update-issue-status
// @access department admin
export const updateIssueStatus = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    let errorMsg = "";

    errors
      .array()
      .forEach((error) => (errorMsg += `for: ${error.path}, ${error.msg} \n`));
    return res.status(400).json({ error: errorMsg });
  }

  const { issueId, status } = req.body;

  try {
    const issue = await Issue.findByIdAndUpdate(
      issueId,
      { status },
      { new: true }
    );

    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    res.status(200).json({ message: `Issue status updated to ${status}` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
