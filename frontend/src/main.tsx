import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/index.scss";
import PageLayout from "./layouts/PageLayout";
import Splash from "./pages/Splash";
import Question from "./pages/Question";
import Welcome from "./pages/Welcome";
import Horoscope from "./pages/Horoscope";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PageLayout />}>
          <Route index element={<Splash />} />
          <Route path="/question" element={<Question />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/horoscope" element={<Horoscope />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
