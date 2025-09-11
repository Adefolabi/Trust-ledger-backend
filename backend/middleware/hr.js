const HR = async (req, res, next) => {
  const role = req.user.role;

  if (!req.user || !role.toLowerCase == "HR") {
    return res.status(401).json({ message: "unauthorized" });
  }
  next();
};

module.exports = HR;
