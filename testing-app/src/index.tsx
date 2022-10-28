import React from "react";
import ReactDOM from "react-dom/client";
import { ExtendedLoaderComponent } from "./testComponents";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ExtendedLoaderComponent />
  </React.StrictMode>
);
