// src/components/layout/Navbar.jsx
import React from "react";
import { navbar } from "../../utils/classnames";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <nav className={navbar.nav}>
      <div className={navbar.container}>
        <div className={navbar.inner}>
          {/* Brand */}
          <div className={navbar.brand}>
            <svg xmlns="http://www.w3.org/2000/svg" className={navbar.logo} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            <span className={navbar.title}>BUILT Relentless</span>
          </div>

          {/* Actions */}
          <div className={navbar.actions}>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}