const express = require("express");
const connectDB = require("./config/db");
const authRouter = require("./route/api/auth");
const postRouter = require("./route/api/posts");
const profileRouter = require("./route/api/profile");
const userRouter = require("./route/api/user");

const app = express();

//Connect Database
connectDB();

//Init middleware
app.use(express.json({ extended: false }));

app.get("/", (req, res) => {
  res.send("API Running");
});

//define router
app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);
app.use("/api/profile", profileRouter);
app.use("/api/users", userRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
