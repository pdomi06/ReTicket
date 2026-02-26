import { useRoutes } from "react-router-dom";
import { Suspense } from "react";
import { routes } from "./router";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

export default function App() {
  return (
    <>
      <Analytics />
      <SpeedInsights />
      <Suspense fallback={<div>Loading...</div>}>
        {useRoutes(routes)}
      </Suspense>
    </>
  );
}
