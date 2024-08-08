import express from "express";
import { checkAuth } from "../controllers/checkAuth.controller.js";

const router = express.Router();

router.get("*", checkAuth);

export default router;
