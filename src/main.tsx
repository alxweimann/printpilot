import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "./app/App";
import { PrintPilotStoreProvider } from "./store/PrintPilotStore";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PrintPilotStoreProvider>
      <App />
    </PrintPilotStoreProvider>
  </React.StrictMode>,
);
