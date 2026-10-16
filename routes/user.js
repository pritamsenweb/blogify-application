const { Router } = require("express");
const User = require("../models/user");

const router = Router();

router.get("/signup", (req, res) => {
  if (req.user) return res.redirect("/");
  return res.render("signup", {
    user: req.user,
    error: null,
  });
});

router.get("/signin", (req, res) => {
  if (req.user) return res.redirect("/");
  return res.render("signin", {
    user: req.user,
    error: req.query.error || null,
    success: req.query.success || null,
  });
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchedPasswordAndGenerateToken(email.trim().toLowerCase(), password);
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render("signin", {
      user: null,
      error: "Incorrect email or password. Please try again.",
      email,
    });
  }
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.render("signup", {
      user: null,
      error: "All fields are required.",
      fullName,
      email,
    });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.render("signup", {
        user: null,
        error: "An account with this email address already exists.",
        fullName,
        email,
      });
    }

    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password,
    });

    // Auto-login upon successful registration
    const token = await User.matchedPasswordAndGenerateToken(normalizedEmail, password);
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    console.error("Signup error:", error);
    return res.render("signup", {
      user: null,
      error: "Could not create account. Please try again.",
      fullName,
      email,
    });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

module.exports = router;