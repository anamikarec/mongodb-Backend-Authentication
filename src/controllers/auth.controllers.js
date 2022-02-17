const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../model/user.model");
// this is the token that we will send to the front-end
const newToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY);
};
const signup = async (req, res) => {
  try {
    const user = await User.create(req.body);
    const token = newToken(user);
    return res.status(201).json({ data: token });
  } catch (err) {
    return res.status(500).json({ msg: "Something wnet wrong!" });
  }
};

const signin = async (req, res) => {
  // we will try to find the user with the gmail
  let user;
  try {
    // return res.send("User");
    user = await User.findOne({ email: req.body.email }).exec();
    // console.log(user);
    if (!user)
      return res
        .status(401)
        .json({ message: "Your email or password is incorrect." });
  } catch (err) {
    return res.status(500).message({ msg: "Something wnet wrong!" });
  }

  // we will try to match the password the user has, with the pass that is stored in the system
  try {
    const match = await user.checkPassword(req.body.password);
    // console.log(match);
    if (!match)
      return res
        .status(401)
        .json({ message: "Your email or password is incorrect." });
  } catch (e) {
    return res.status(500).json({ msg: "Something went wrong!" });
  }

  // we will create a new token and return it.
  const token = newToken(user);
  return res.status(201).json({ data: { token } });
};
module.exports = { signup, signin };
