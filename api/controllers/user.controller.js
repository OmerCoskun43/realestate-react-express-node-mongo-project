const bycrypt = require("bcryptjs");
const errorHandler = require("../utils/error").errorHandler;
const User = require("../models/user.model");
const Listing = require("../models/listing.model");

module.exports = {
  test: (req, res) => {
    res.send("Hello World");
  },
  updateUser: async (req, res, next) => {
    req.user.id = req.user.id || req.user._id;

    if (req.user.id !== req.params.id) {
      return next(errorHandler(401, "You can update only your account"));
    }

    try {
      if (req.body.password) {
        req.body.password = bycrypt.hashSync(req.body.password, 10);
      }
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            avatar: req.body.avatar,
          },
        },
        { new: true }
      );
      const { password, ...rest } = updatedUser._doc;
      res.status(200).json(rest);
    } catch (error) {
      next(error);
    }
  },

  deleteUser: async (req, res, next) => {
    if (req.user.id || req.user._id !== req.params.id) {
      return next(errorHandler(401, "You can delete only your account"));
    }
    try {
      await User.findByIdAndDelete(req.params.id);
      res.clearCookie("access_token");
      res.status(200).json("User has been deleted");
    } catch (error) {
      next(error);
    }
  },

  getUserListings: async (req, res, next) => {
    req.user.id = req.user.id || req.user._id;

    // console.log("req.params.id", req.params.id);

    if (req.user.id === req.params.id) {
      try {
        const listings = await Listing.find({ userRef: req.params.id });
        // console.log(listings);
        res.status(200).json(listings);
      } catch (error) {
        next(error);
      }
    } else {
      return next(errorHandler(401, "You can view only your listings"));
    }
  },

  getUser: async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) return next(errorHandler(404, "User not found!"));

      const { password: pass, ...rest } = user._doc;

      res.status(200).json(rest);
    } catch (error) {
      next(error);
    }
  },
};
