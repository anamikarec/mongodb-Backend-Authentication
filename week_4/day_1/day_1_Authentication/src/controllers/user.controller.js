const express = require("express");
const router = express.Router();
const protect = require("../middlewares/protect");
const User = require("../model/user.model");
console.log(User);
router.get("/", protect, async (req, res, next) => {
  const users = await User.find({}).select("-password").lean().exec();
  return res.status(200).json({ data: users });
});

module.exports = router;
