import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Register service worker for PWA support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        if (import.meta.env.DEV) {
          console.log('ServiceWorker registered: ', registration);
        }
        
        // Check for updates periodically (every 30 minutes)
        setInterval(() => {
          registration.update();
        }, 1800000); // 30 minutes
      })
      .catch((error) => {
        if (import.meta.env.DEV) {
          console.log('ServiceWorker registration failed: ', error);
        }
      });
  });
}

