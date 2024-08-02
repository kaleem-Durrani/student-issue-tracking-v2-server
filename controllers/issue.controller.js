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
      student: studentId,
    });

    await newIssue.save();

    res.status(201).json({ message: "Issue added successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
