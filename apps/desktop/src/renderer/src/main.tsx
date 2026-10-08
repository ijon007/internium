import "./assets/main.css";

import { ClerkProvider } from "@clerk/clerk-react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  publishableKey ? (
    <ClerkProvider publishableKey={publishableKey}>{app}</ClerkProvider>
  ) : (
    app
  ),
);
