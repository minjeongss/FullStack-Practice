import "./App.css";
import Header from "./components/Header";
import SignIn from "./components/SignIn";
import SignOut from "./components/SignOut";
import SignUp from "./components/SignUp";

function App() {
  return (
    <>
      <div className="container">
        <Header />
        <SignUp />
        <SignIn />
        <SignOut />
      </div>
    </>
  );
}

export default App;
