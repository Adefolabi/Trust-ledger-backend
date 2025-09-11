const FINANCE = async (req, res, next) => {
  const role = req.user.role;

  if (!req.user || !role.toLowerCase == "admin" || !role.toLowerCase == "finance") {
    return res.status(401).json({ message: "unauthorized" });
  }
  next();
};

module.exports = FINANCE;
