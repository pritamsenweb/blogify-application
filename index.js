if (typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile();
  } catch (e) {
    // Optional .env file; falls back to default environment
  }
}

const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookiePaser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./services/authentication");

require("./models/user");
const Blog = require("./models/blog");

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

const app = express();
const PORT = process.env.PORT || 8000;
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/blogify";

mongoose
    .connect(MONGO_URL)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB Connection Error:", err.message));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookiePaser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get('/', async (req, res) => {
    try {
        const allBlogs = await Blog.find({}).populate("createdBy").sort({ createdAt: -1 });
        return res.render("home", {
            user: req.user,
            blogs: allBlogs,
        });
    } catch (error) {
        console.error("Error fetching blogs:", error);
        return res.render("home", {
            user: req.user,
            blogs: [],
            error: "Unable to load blogs at this moment."
        });
    }
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.use((req, res) => {
    res.status(404).render("404", { user: req.user });
});

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));