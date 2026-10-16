const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const mongoose = require("mongoose");
const Blog = require("../models/blog");
const Comment = require("../models/comment");

const router = Router();

const fs = require("fs");
const uploadDir = path.resolve("./public/uploads/");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(8, function (err, raw) {
      const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
      const fileName = `${Date.now()}-${raw.toString("hex")}-${sanitizedName}`;
      cb(null, fileName);
    });
  },
});
const upload = multer({ storage: storage });

// Render Add Blog page (Protected)
router.get("/add-new", (req, res) => {
  if (!req.user) {
    return res.redirect("/user/signin");
  }
  return res.render("addBlog", {
    user: req.user,
  });
});

// View Single Blog
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).render("404", { user: req.user });
    }

    const blog = await Blog.findById(req.params.id).populate("createdBy");
    if (!blog) {
      return res.status(404).render("404", { user: req.user });
    }

    const comments = await Comment.find({ blogId: req.params.id })
      .populate("createdBy")
      .sort({ createdAt: -1 });

    return res.render("blog", {
      user: req.user,
      blog,
      comment: comments,
    });
  } catch (error) {
    console.error("Error viewing blog:", error);
    return res.status(500).redirect("/");
  }
});

// Create New Blog
router.post("/", upload.single("coverImageURL"), async (req, res) => {
  if (!req.user) {
    return res.redirect("/user/signin");
  }

  const { title, body } = req.body;
  if (!title || !body) {
    return res.render("addBlog", {
      user: req.user,
      error: "Title and content are required.",
    });
  }

  const coverImageURL = req.file
    ? `/uploads/${req.file.filename}`
    : "/images/default-blog.svg";

  try {
    const blog = await Blog.create({
      title: title.trim(),
      body: body.trim(),
      createdBy: req.user._id,
      coverImageURL,
    });

    return res.redirect(`/blog/${blog._id}`);
  } catch (error) {
    console.error("Error creating blog:", error);
    return res.render("addBlog", {
      user: req.user,
      error: "Failed to publish blog post. Please try again.",
    });
  }
});

// Add Comment
router.post("/comment/:blogId", async (req, res) => {
  if (!req.user) {
    return res.redirect("/user/signin");
  }

  const content = req.body.content ? req.body.content.trim() : "";
  if (!content) {
    return res.redirect(`/blog/${req.params.blogId}`);
  }

  try {
    await Comment.create({
      content,
      blogId: req.params.blogId,
      createdBy: req.user._id,
    });
  } catch (error) {
    console.error("Error creating comment:", error);
  }

  return res.redirect(`/blog/${req.params.blogId}`);
});

// Delete Blog (Author only)
router.post("/delete/:id", async (req, res) => {
  if (!req.user) {
    return res.redirect("/user/signin");
  }

  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.redirect("/");
    }

    // Check if the current user is author or admin
    if (
      blog.createdBy &&
      (blog.createdBy.toString() === req.user._id.toString() || req.user.role === "ADMIN")
    ) {
      await Blog.findByIdAndDelete(req.params.id);
      await Comment.deleteMany({ blogId: req.params.id });
    }
  } catch (error) {
    console.error("Error deleting blog:", error);
  }

  return res.redirect("/");
});

module.exports = router;