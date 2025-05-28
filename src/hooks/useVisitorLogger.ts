import { useEffect } from "react";
import { useLocation } from "react-router-dom"; // or next/router if Next.js

function generateUUID() {
  // Simple UUID generator for anonymous visitor ID
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function useVisitorLogger() {
  const location = useLocation();

  useEffect(() => {
    let visitorId = localStorage.getItem("visitor_id");
    if (!visitorId) {
      visitorId = generateUUID();
      localStorage.setItem("visitor_id", visitorId);
    }

    async function logVisitor() {
      try {
        await fetch("https://wdlcrzpcmzwmnpdstoci.supabase.co/functions/v1/log_visitor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ path: location.pathname, visitor_id: visitorId }),
        });
      } catch (error) {
        console.error("Failed to log visitor:", error);
      }
    }

    logVisitor();
  }, [location.pathname]);
}
