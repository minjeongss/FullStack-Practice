import { useState } from "react";

const UserName = () => {
  const [name, setName] = useState("");
  const handleClick = async () => {
    const response = await fetch("http://localhost:8000/target", {
      credentials: "include",
    });
    if (response.ok) {
      const res = await response.json();
      console.log(res);
      console.log("ok");
    } else {
      console.log("not ok");
    }
  };
  return (
    <div>
      <p>{name}</p>
      <button onClick={handleClick}>정체를 밝히시오!</button>
    </div>
  );
};

export default UserName;
