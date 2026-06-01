import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Home from "./pages/home/Home";
import CreateAccount from "./pages/account/CreateAccount";
import InvitePartner from "./pages/account/InvitePartner";
import AcceptInvite from "./pages/account/AcceptInvite";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/account/new" element={<CreateAccount />} />
        <Route path="/account/invite" element={<InvitePartner />} />
        <Route path="/join" element={<AcceptInvite />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
