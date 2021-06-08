const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const authRouter = express.Router();

const { body, check, validationResult } = require("express-validator");
const User = require("../../models/User");
const auth = require("../../middleware/auth");

authRouter.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (user) {
      res.json(user);
    }
  } catch (error) {
    console.log(error.message);
    res.send(error.message);
  }
});

authRouter.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Please required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      //already user
      if (!user) {
        return res.status(400).json({ errors: [{ msg: "invalid user" }] });
      }

      //jwt

      const match = bcrypt.compare(password, user.password);
      if (!match) {
        res.send("invalid user");
      }

      const payload = {
        user: {
          id: user._id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 36000 },
        (error, token) => {
          if (error) {
            throw error;
          } else {
            res.send({ token });
          }
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);
module.exports = authRouter;
