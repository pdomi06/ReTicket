import { useRoutes } from "react-router-dom";
import { Suspense } from "react";
import { routes } from "./router";

export default function App() {
  return (
      <Suspense fallback={<div>Loading...</div>}>
        {useRoutes(routes)}
      </Suspense>
    
  );
}
