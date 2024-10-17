const SignOut = () => {
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
  return <button onClick={handleClick}>로그아웃</button>;
};

export default SignOut;
