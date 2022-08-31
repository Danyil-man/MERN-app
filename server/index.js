import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from 'cors';
import fs from "fs";
import {
  loginValidation,
  postCreateValidation,
  registerValidation,
} from "./validations/validations.js";
import checkAuth from "./utils/checkAuth.js";
import checkValidation from "./utils/checkValidation.js";
import { auth, login, register } from "./controllers/UserController.js";
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  getTags,
  updatePost,
} from "./controllers/PostController.js";

const app = express();
mongoose
  .connect(
    "mongodb+srv://admin:@cluster0.wlib2we.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB error", err));

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads");
    }
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

// User routes
app.post("/auth/register", registerValidation, checkValidation, register);
app.post("/auth/login", loginValidation, checkValidation, login);
app.get("/auth/me", checkAuth, auth);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

// Article routes
app.get("/posts", getPosts);
app.get("/posts/:id", getPost);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  checkValidation,
  createPost
);
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  checkValidation,
  updatePost
);
app.delete("/posts/:id", checkAuth, deletePost);

// Tags route
app.get("/tags", getTags)

app.listen(5000, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server started");
});
