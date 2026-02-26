import { useRoutes } from "react-router-dom";
import { Suspense } from "react";
import { routes } from "./router";
import { Analytics } from "@vercel/analytics/react";

export default function App() {
  return (
    <>
      <Analytics />
      <Suspense fallback={<div>Loading...</div>}>
        {useRoutes(routes)}
      </Suspense>
    </>
  );
}
