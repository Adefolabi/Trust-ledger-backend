const jwt = require("jsonwebtoken");

const AUTH = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  console.log(authHeader);
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "unauthorized" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const verified = jwt.verify(token, process.env.SECRET_KEY);

    if (!verified) {
      return res.status(401).json({ message: "invalid token" });
    }

    if (verified.status?.toLowerCase() === "inactive") {
      return res.status(403).json({ message: "user inactive" });
    }
    if (verified.status?.toLowerCase() === "banned") {
      return res.status(403).json({ message: "user banned" });
    }

    console.log("User ID:", verified.id);
    req.user = verified;
    next();
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message || "invalid token" });
  }
};

module.exports = AUTH;
