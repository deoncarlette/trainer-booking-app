import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { applySavedTheme } from "./utils/theme";
import "./index.css"; // optional if using Tailwind or custom styles

applySavedTheme()

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
