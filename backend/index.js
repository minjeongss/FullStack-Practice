// dotenv
require("dotenv").config();

// express 환경 설정
const express = require("express");
const app = express();
const port = 8000;

// cors 환경 설정 및 사용
const cors = require("cors");
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

// express 사용
app.use(express.json());

// mongodb 환경 설정
const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB에 성공적으로 연결되었습니다.");
  })
  .catch((err) => {
    console.error("MongoDB 연결 실패:", err);
  });
const User = require("./modules/User");

// 비밀번호 암호화 설정
const bcrypt = require("bcryptjs");
const saltRounds = 10;

// jwt 설정
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY;

// 서버에서 cookie 읽는 부분 설정
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// ---------

// 서버 동작 확인
app.get("/", (req, res) => {
  console.log("GET 요청이 들어왔습니다");
  res.send(`서버가 잘 작동하고 있습니다. ...`);
});

app.post("/signup", async (req, res) => {
  const { name, password } = req.body;
  try {
    // mongodb 연결
    const userDoc = await User.create({
      name,
      password: bcrypt.hashSync(password, saltRounds), // 비밀번호 암호화
    });
    res.json({ message: "회원가입에 성공했습니다!" });
  } catch (err) {
    console.log(err);
    res.status(409).json({ message: "이미 존재하는 사용자입니다" });
  }
});

app.post("/signin", async (req, res) => {
  const { name, password } = req.body;
  const userDoc = await User.findOne({ name });
  if (!userDoc) {
    res.status(404).json({ message: "사용자가 존재하지 않습니다" });
    return;
  }

  const isRightPWD = bcrypt.compareSync(password, userDoc.password);
  if (isRightPWD) {
    // jwt로 cookie에 토큰 저장
    jwt.sign({ name, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json({
        id: userDoc._id,
        name,
      });
    });
  } else {
    res.status(400).json({ message: "잘못된 비밀번호입니다" });
  }
});

app.post("/signout", (req, res) => {
  res.cookie("token", "").json("로그아웃 되었습니다");
});

app.get("/target", async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    res.status(401).json({ message: "로그인이 필요합니다" });
    return;
  }

  try {
    jwt.verify(token, secret, {}, (err, info) => {
      if (err) throw err;
      res.json({ info });
    });
  } catch (err) {
    res.json({ message: "로그인이 필요합니다" });
  }
});

app.listen(port, () => {
  console.log(`서버 돌아가는중... ${port}`);
});
