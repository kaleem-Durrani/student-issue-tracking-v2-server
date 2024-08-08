import jwt from "jsonwebtoken";

export const checkAuth = (req, res) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(403).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(403).json({ error: "Token invalid" });
    }

    res.status(200).json({
      message: "User reload successfull",
      user: decoded,
      userType: decoded.userType,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
