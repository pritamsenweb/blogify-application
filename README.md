# 🖋️ Blogify — Modern Full-Stack Publishing Platform

[![Node.js](https://img.shields.io/badge/Node.js-v20+-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v5.2-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%2F%20Local-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![EJS](https://img.shields.io/badge/Templates-EJS-B4CA65?style=for-the-badge&logo=javascript&logoColor=white)](https://ejs.co/)
[![JWT](https://img.shields.io/badge/Auth-JWT%20Cookies-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Bootstrap](https://img.shields.io/badge/UI-Bootstrap%205%20%2B%20Custom%20CSS-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **Blogify** is a production-inspired, full-stack blogging and publishing platform crafted with Node.js, Express 5, MongoDB, and EJS. Designed with an editorial aesthetic, sleek dark mode glassmorphism, real-time client-side search filtering, secure stateless authentication, and an author publishing studio.

---

## ✨ Features at a Glance

### 🎨 1. Bespoke Editorial Design System
- **Dark Mode Aesthetic**: Curated color palette (`#090d16` canvas) with subtle radial glows and glassmorphic cards (`backdrop-filter: blur(16px)`).
- **Modern Typography**: High-readability font pairing featuring **Outfit** for editorial titles and **Plus Jakarta Sans** for body prose.
- **Micro-Animations**: Smooth hover lifts, card zoom transitions, animated dropdowns, and button pop effects.

### 🔍 2. Real-Time Search & Category Filtering
- Instant, zero-latency client-side search across story titles, excerpts, and author names.
- Dynamic category pill filters (*Engineering, Architecture, Design, Tutorials, Insights*).
- Live article counter badge and graceful empty search states.

### 📖 3. Distraction-Free Reading Experience
- **Reading Progress Bar**: Dynamic top-scroll indicator tracking reader progress.
- **Estimated Reading Time**: Automatically computed based on word count.
- **Clap / Appreciate Button**: Interactive liking system with counter animations and persistent local appreciation.
- **One-Click Social Sharing**: Instant link-copying with toast notification, plus X/Twitter and LinkedIn sharing.
- **Author Spotlight**: Detailed author card at the end of each publication.

### ✍️ 4. Author Publishing Studio
- **Drag-and-Drop Cover Image Upload**: Multer-backed file upload with **live instant image preview** before publishing.
- **Live Word & Time Counter**: Dynamic calculation of word count and reading time as you write.
- **Story Management**: Authors have the ability to delete their own stories.

### 💬 5. Community Discussions
- Nested comment section with author badges.
- Dynamic timestamps and avatar integration.
- Graceful guest state with callout cards inviting readers to sign in.

### 🔒 6. Robust Authentication & Security
- Password hashing utilizing Node.js native `crypto.createHmac` with unique cryptographic random salts (16-byte hex).
- Stateless authentication using HTTP-only cookies and JSON Web Tokens (JWT).
- Protected author routes and error-handling preventing duplicate registrations.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | [Node.js](https://nodejs.org/) (v20+) |
| **Backend Framework** | [Express.js](https://expressjs.com/) v5 |
| **Database** | [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/) v9 |
| **Templating Engine** | [EJS](https://ejs.co/) (Embedded JavaScript) |
| **File Uploads** | [Multer](https://github.com/expressjs/multer) |
| **Authentication** | [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken), `cookie-parser`, `crypto` |
| **Styling & Icons** | [Bootstrap 5.3](https://getbootstrap.com/), [Bootstrap Icons](https://icons.getbootstrap.com/), Custom CSS Design System |

---

## 📁 Project Architecture

```plaintext
blog-application/
├── controllers/          # Business logic handlers
├── middlewares/          # Custom middleware (authentication, guards)
│   └── authentication.js # Cookie-based token validator
├── models/               # Mongoose schema definitions
│   ├── blog.js           # Blog article model
│   ├── comment.js        # Blog comment model
│   └── user.js           # User model with password hashing & verification
├── public/               # Static assets served by Express
│   ├── css/
│   │   └── main.css      # Custom dark-mode design system & animations
│   ├── images/
│   │   └── default-blog.svg # Default fallback cover art
│   ├── js/
│   │   └── main.js       # Search, progress bar, claps, share & preview
│   ├── profileImg/       # Default author avatars
│   └── uploads/          # User-uploaded blog cover images
├── routes/               # Express route controllers
│   ├── blog.js           # Blog CRUD & comment endpoints
│   └── user.js           # Authentication (signup, signin, logout)
├── services/             # Core utility services
│   └── authentication.js # JWT token issuance and verification
├── views/                # EJS template views
│   ├── partials/         # Reusable layouts (head, nav, script)
│   ├── 404.ejs           # Custom 404 error page
│   ├── addBlog.ejs       # Publishing studio page
│   ├── blog.ejs          # Single story reading & discussion page
│   ├── home.ejs          # Homepage, hero banner & article grid
│   ├── signin.ejs        # User sign-in interface
│   └── signup.ejs        # User registration interface
├── .env.example          # Environment variable template
├── .gitignore            # Git exclusion rules
├── index.js              # Application entrypoint & server setup
└── package.json          # Project manifest & dependencies
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have installed on your machine:
- [Node.js](https://nodejs.org/) (version 18 or higher; v20+ recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally or a [MongoDB Atlas](https://www.mongodb.com/atlas) connection URI.

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/blog-application.git
cd blog-application
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to create your `.env` file:
```bash
cp .env.example .env
```

Adjust the values if needed:
```env
PORT=8000
MONGO_URL=mongodb://localhost:27017/blogify
JWT_SECRET=your_custom_jwt_secret_key
```

### 4. Start the Application
For production start:
```bash
npm start
```

For development with hot-reloading:
```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:8000
```

---

## 📌 Routes & Endpoints Reference

### 🌐 Public & Core
| Method | Route | Description |
|---|---|---|
| `GET` | `/` | Home page with hero banner, live search, and story grid |
| `GET` | `/blog/:id` | View single blog story, comments, and author spotlight |
| `GET` | `/user/signin` | Render sign-in page |
| `GET` | `/user/signup` | Render sign-up page |

### 🔐 Authenticated Routes
| Method | Route | Description |
|---|---|---|
| `GET` | `/blog/add-new` | Open the story publishing studio |
| `POST` | `/blog` | Publish a new story (with optional cover image upload) |
| `POST` | `/blog/comment/:blogId` | Post a comment under a blog post |
| `POST` | `/blog/delete/:id` | Delete a story (author-only) |
| `POST` | `/user/signin` | Authenticate user & issue JWT cookie |
| `POST` | `/user/signup` | Register new user & issue JWT cookie |
| `GET` | `/user/logout` | Clear auth token & sign out |

---

## 🛡️ Database Schema Summary

### `User`
```javascript
{
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // HMAC SHA-256 hash
  salt: { type: String },                    // 16-byte random salt
  profileImagURL: { type: String, default: "/profileImg/default-user.svg" },
  role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
  timestamps: true
}
```

### `Blog`
```javascript
{
  title: { type: String, required: true },
  body: { type: String, required: true },
  coverImageURL: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: "user" },
  timestamps: true
}
```

### `Comment`
```javascript
{
  content: { type: String, required: true },
  blogId: { type: Schema.Types.ObjectId, ref: "blog" },
  createdBy: { type: Schema.Types.ObjectId, ref: "user" },
  timestamps: true
}
```

---

## 👨‍💻 Author & Contributions

Created by **Pritam Sen**. Contributions, suggestions, and pull requests are warmly welcomed!

- ⭐️ Give this project a star if you find it helpful!
- 🐛 Found a bug? Open an [Issue](https://github.com/your-username/blog-application/issues).

---

## 📄 License
This project is licensed under the **MIT License** — feel free to use, modify, and build upon this project for learning or portfolio showcases.
