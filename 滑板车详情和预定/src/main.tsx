import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "../小车信息/app/App";
import "../小车信息/styles/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
