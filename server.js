import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectToMongoDB from "./db/connectToMongoDB.js";

import authStudentRoutes from "./routes/auth.student.routes.js";
import authAdminRoutes from "./routes/auth.admin.routes.js";
import checkAuthRoutes from "./routes/checkAuth.routes.js";

import issueRoutes from "./routes/isuue.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

config();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use("/api/auth/student", authStudentRoutes);
app.use("/api/auth/admin", authAdminRoutes);

app.use("/api/auth/check-auth", checkAuthRoutes);

app.use("/api/issue", issueRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
