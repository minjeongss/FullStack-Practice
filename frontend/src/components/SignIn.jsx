import { useState } from "react";

const SignIn = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
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
  return (
    <form onSubmit={handleInput}>
      <label htmlFor="name">name: </label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label htmlFor="password">password: </label>
      <input
        type="text"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">로그인</button>
    </form>
  );
};

export default SignIn;
