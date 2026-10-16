/**
 * Optional Database Seeder for Blogify
 * Run: npm run seed
 * Populates sample showcase articles with clean default artwork without creating binary files in public/uploads.
 */

if (typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile();
  } catch (e) {}
}

const mongoose = require("mongoose");
const User = require("./models/user");
const Blog = require("./models/blog");
const Comment = require("./models/comment");

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/blogify";

const sampleArticles = [
  {
    title: "Mastering Asynchronous JavaScript & Event Loops in Node.js",
    body: `Understanding how Node.js manages concurrency through the event loop is crucial for building high-throughput systems.\n\nUnlike traditional multi-threaded web servers that allocate a new thread per request, Node.js operates on a single-threaded event loop powered by libuv. This enables non-blocking I/O operations by delegating system calls, filesystem interactions, and network operations to the operating system kernel.\n\nWhen writing high-performance APIs, always avoid CPU-intensive synchronous operations inside route handlers. Using streaming APIs and clustering across CPU cores will ensure your service remains responsive under heavy concurrent loads.`,
    coverImageURL: "/images/default-blog.svg",
  },
  {
    title: "Designing Clean RESTful Architectures with Express 5",
    body: `A clean architectural pattern separates concerns between routing, controller logic, data validation, and persistent storage.\n\nExpress 5 brings improved promise handling and enhanced middleware mechanics. By adopting structured services and layered validation, maintenance overhead drops dramatically as your application scales.\n\nKey pillars for robust microservices include centralized error middleware, rate limiting, stateless authentication via cryptographic JWT tokens, and strict schema validation at the database boundary.`,
    coverImageURL: "/images/default-blog.svg",
  },
  {
    title: "Modern UI Design Principles for Full-Stack Developers",
    body: `Modern web design has evolved beyond basic utility frameworks. To create memorable software products, user interfaces should deliver visual polish, tactile micro-interactions, and clear typographic hierarchy.\n\nUtilizing a cohesive dark-mode design system with subtle background radial gradients and frosted glassmorphism elevates a developer tool into an executive-grade product.\n\nPrioritize accessibility, fluid responsive breakpoints, and instant client-side feedback such as live search filtering and real-time word counters.`,
    coverImageURL: "/images/default-blog.svg",
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB for seeding...");

    // Find or create default demo author
    let demoUser = await User.findOne({ email: "demo@blogify.io" });
    if (!demoUser) {
      demoUser = await User.create({
        fullName: "Alex Morgan",
        email: "demo@blogify.io",
        password: "password123",
        profileImagURL: "/profileImg/default-user.svg",
        role: "ADMIN"
      });
      console.log("Created demo author: demo@blogify.io (password: password123)");
    }

    // Check existing blogs
    const existingCount = await Blog.countDocuments();
    if (existingCount > 0) {
      console.log(`Database already has ${existingCount} stories. Skipping duplicate seeding.`);
      console.log("To re-seed fresh sample data, drop the collection or database first.");
      process.exit(0);
    }

    // Seed articles
    for (const article of sampleArticles) {
      const createdBlog = await Blog.create({
        ...article,
        createdBy: demoUser._id
      });

      // Add a demo comment
      await Comment.create({
        content: "Great deep dive! The explanation on non-blocking I/O and architectural separation was spot on.",
        blogId: createdBlog._id,
        createdBy: demoUser._id
      });
    }

    console.log("Successfully seeded sample showcase stories and comments!");
    process.exit(0);
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  }
}

seedDatabase();
