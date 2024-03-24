const express = require("express");
const { User } = require("../models/user");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
router.get("/", async (req, res) => {
  const users = await User.find().select("-passwordHash");
  if (!users) {
    res.status(500).json({
      success: false,
    });
  }
  res.send(users);
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-passwordHash");
  if (!user) {
    res.status(500).json({
      success: false,
    });
  }
  res.send(user);
});

router.post("/register", async (req, res) => {
  const checkUser = await User.findOne({ email: req.params.email });
  if (checkUser) {
    return res.status(403).json({
      success: false,
      message: "User already exist with this email",
    });
  }
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
  });
  user = await user.save();
  if (!user) return res.status(400).send("User cannot be created");
  res.send(user);
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const secret = process.env.secret;
  if (!user) {
    return res.status(400).send("The user deos not exist");
  }
  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      secret,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      user,
      token: token,
    });
  } else {
    return res.status(400).json({
      success: false,
      message: "Invalid password or email!",
    });
  }
});

module.exports = router;
