const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Register form
router.get("/register", (req, res) => {
    res.render("auth/register");
});

// Register user
router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    const newUser = new User({ username, password });
    await newUser.save();
    res.redirect("/login");
});

// Login form
router.get("/login", (req, res) => {
    res.render("auth/login");
});

// Login user
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && await user.comparePassword(password)) {
        req.session.user = user;
        res.redirect("/chats");
    } else {
        res.send("Invalid username or password");
    }
});

module.exports = router;
