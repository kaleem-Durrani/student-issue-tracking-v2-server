import jwt from "jsonwebtoken";

// conditionally generates jwt tokens if its a student the admin type is ignored
// if its an admin then the admin type is also included in the token
const generateToken = (res, userId, isVerified, userType, adminType) => {
  const token = jwt.sign(
    { userId, isVerified, userType, adminType },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: false,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });
};

export default generateToken;
