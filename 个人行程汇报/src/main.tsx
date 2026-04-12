import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "../用户行程/app/App";
import "../用户行程/styles/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
