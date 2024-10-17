import "./App.css";
import Header from "./components/Header";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";

function App() {
  return (
    <>
      <div className="container">
        <Header />
        <SignUp />
        <SignIn />
      </div>
    </>
  );
}

export default App;
