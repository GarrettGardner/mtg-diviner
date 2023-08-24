import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "@client/redux";
import { App } from "@client/features/app";

const rootId = document.getElementById("root");
if (rootId) {
  const root = ReactDOM.createRoot(rootId);
  root.render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
}
