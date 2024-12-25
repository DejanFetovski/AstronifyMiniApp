import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/index.scss";
import PageLayout from "./layouts/PageLayout";
import Splash from "./pages/Splash";
import Question from "./pages/Question";
import Welcome from "./pages/Welcome";
import Wallet from "./pages/Wallet";
import Tasks from "./pages/Tasks";
import Invite from "./pages/Invite";
import Profile from "./pages/Profile";
import Horoscope from "./pages/Horoscope";
import Agent from "./pages/Agent";
import Withdraw from "./pages/Withdraw";
import Deposit from "./pages/Deposit";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PageLayout />}>
          <Route index element={<Splash />} />
          <Route path="/question" element={<Question />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/horoscope" element={<Horoscope />} />
          <Route path="/agent" element={<Agent />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/invite" element={<Invite />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
