import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "../反馈机制/app/App";
import "../反馈机制/styles/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
