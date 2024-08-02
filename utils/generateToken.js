import jwt from "jsonwebtoken";

const generateToken = (userId, isVerified, res) => {
  const token = jwt.sign({ userId, isVerified }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: false,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });
};

export default generateToken;
