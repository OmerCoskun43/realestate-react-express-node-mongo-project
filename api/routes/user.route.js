const express = require("express");
const router = express.Router();
const {
  test,
  updateUser,
  deleteUser,
  getUserListings,
  getUser,
} = require("../controllers/user.controller");
const { verifyToken } = require("../utils/verifyUser");

router.get("/test", test);

router.post("/update/:id", verifyToken, updateUser);

router.delete("/delete/:id", verifyToken, deleteUser);

router.get("/listings/:id", verifyToken, getUserListings);

router.get("/:id", verifyToken, getUser);

module.exports = router;
