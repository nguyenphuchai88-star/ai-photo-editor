import React from "https://esm.sh/react@18.2.0";
import ReactDOM from "https://esm.sh/react-dom@18.2.0/client";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";

function main() {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Không tìm thấy phần tử gốc để render ứng dụng");
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    React.createElement(
      React.StrictMode,
      null,
      React.createElement(
        ErrorBoundary,
        null,
        React.createElement(App, null)
      )
    )
  );
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", main);
} else {
  main();
}
