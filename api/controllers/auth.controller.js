const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const errorHandler = require("../utils/error").errorHandler;
const jwt = require("jsonwebtoken");

module.exports = {
  signup: async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    try {
      await newUser.save();
      res.status(201).json("User created successfully");
    } catch (error) {
      next(error);
    }
  },

  signin: async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const validUser = await User.findOne({ email });
      if (!validUser) {
        return next(errorHandler(404, "User not found"));
      }
      const validPassword = bcrypt.compareSync(password, validUser.password);
      if (!validPassword) {
        return next(errorHandler(401, "Invalid password"));
      }
      const token = jwt.sign({ _id: validUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = validUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } catch (error) {
      next(error);
    }
  },

  google: async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        const { password, ...rest } = user._doc;
        res
          .cookie("access_token", token, { httpOnly: true })
          .status(200)
          .json(rest);
      } else {
        const generatedPassword = Math.random().toString(36).slice(-8);
        const hashPassword = await bcrypt.hash(generatedPassword, 10);
        const newUser = new User({
          username:
            req.body.name.split(" ").join("").toLocaleLowerCase() +
            Math.random().toString(36).slice(-8),
          email: req.body.email,
          password: hashPassword,
          avatar: req.body.photo,
        });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
        const { password, ...rest } = newUser._doc;
        res
          .cookie("access_token", token, { httpOnly: true })
          .status(200)
          .json(rest);
      }
    } catch (error) {
      next(error);
    }
  },

  signOut: async (req, res, next) => {
    try {
      res.clearCookie("access_token");
      res.status(200).json("User has been signed out successfully");
    } catch (error) {
      next(error);
    }
  },
};
