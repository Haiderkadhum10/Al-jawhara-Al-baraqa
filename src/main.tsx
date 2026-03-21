import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { logger } from "./lib/logger";

window.addEventListener("error", (event) => {
  logger.error("Unhandled runtime error", event.error, {
    feature: "runtime",
    action: "window.onerror",
    source: event.filename,
    line: event.lineno,
    column: event.colno,
  });
});

window.addEventListener("unhandledrejection", (event) => {
  logger.error("Unhandled promise rejection", event.reason, {
    feature: "runtime",
    action: "window.unhandledrejection",
  });
});

createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <SpeedInsights />
  </>
);

