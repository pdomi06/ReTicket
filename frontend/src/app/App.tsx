import { useRoutes } from "react-router-dom";
import { Suspense } from "react";
import { routes } from "./router";
import { Auth0Provider } from '@auth0/auth0-react';

export default function App() {
  return (
        <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
      <Suspense fallback={<div>Loading...</div>}>
        {useRoutes(routes)}
      </Suspense>
    </Auth0Provider>
  );
}
