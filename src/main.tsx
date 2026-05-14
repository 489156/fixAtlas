
  import { createRoot } from "react-dom/client";
  import { HelmetProvider } from "react-helmet-async";
  import App from "./app/App.tsx";
  import "./styles/index.css";
  import "./i18n/index.ts";

  createRoot(document.getElementById("root")!).render(
    <HelmetProvider>
      <App />
    </HelmetProvider>
  );
  