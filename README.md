# FullStack 분석기 🎯

## 참고 주소

- [jwt secret key 생성](https://randomkeygen.com/)

## Backend

### 설치

- 서버 구동: express, cors, dotenv
- DB 구동: mongoose
- 데이터 암호화: bcryptjs
- 토근 발행: jsonwebtoken(jwt)

```json
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.21.1",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.7.1"
  }
```

### 실행

```
nodemon index.js
```

### 구성

- 회원가입

```js
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
```

- 로그인

```js
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
```

- 로그아웃

```js
app.post("/signout", (req, res) => {
  res.cookie("token", "").json("로그아웃 되었습니다");
});
```

- 정보 읽기

```js
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
```

## Frontend

### 설치

- React
- JavaScript

```
pnpm create vite
```

### 실행

```
pnpm install
pnpm run dev
```

### 구성

- 회원가입(SignUp.jsx)

```js
const handleInput = async (e) => {
  e.preventDefault();
  const response = await fetch("http://localhost:8000/signup", {
    method: "POST",
    body: JSON.stringify({ name, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    const res = await response.json();
    alert(res.message);

    setName("");
    setPassword("");
  } else {
    const res = await response.json();
    alert(res.message);
  }
};
```

- 로그인(SignIn.jsx)

```js
const handleInput = async (e) => {
  e.preventDefault();
  const response = await fetch("http://localhost:8000/signin", {
    method: "POST",
    body: JSON.stringify({ name, password }),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (response.ok) {
    const res = await response.json();
    console.log(res);

    setName("");
    setPassword("");
  } else {
    alert("로그인 실패");
  }
};
```

- 로그아웃(SignOut.jsx)

```js
const handleClick = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch("http://localhost:8000/signout", {
      method: "POST",
      credentials: "include",
    });
    if (response.ok) {
      const res = await response.json();
      alert(res);
    } else {
      alert("no");
    }
  } catch (err) {
    console.error(err);
  }
};
```

- 정보 읽기(UserName.jsx)

```js
const handleClick = async () => {
  const response = await fetch("http://localhost:8000/target", {
    credentials: "include",
  });
  if (response.ok) {
    const res = await response.json();
    setName(res.info.name);
  } else {
    const res = await response.json();
    alert(res.message);
  }
};
```
