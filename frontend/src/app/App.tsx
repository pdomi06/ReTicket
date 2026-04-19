import { useRoutes } from "react-router-dom";
import { Suspense } from "react";
import { routes } from "./router";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import LoadingScreen from "../components/loading/LoadingScreen";
import loaderStyles from "../components/loading/PageLoader.module.css";

export default function App() {
  return (
    <>
      <Analytics />
      <SpeedInsights />
      <Suspense
        fallback={
          <div className={`${loaderStyles.overlay} ${loaderStyles.overlayVisible}`}>
            <LoadingScreen />
          </div>
        }
      >
        {useRoutes(routes)}
      </Suspense>
    </>
  );
}
