const ADMIN = async (req, res, next) => {
  const role = req.user.role;
  console.log(role);

  if (!req.user || !role.toLowerCase == "admin") {
    return res.status(401).json({ message: "unauthorized" });
  }
  next();
};

module.exports = ADMIN;
