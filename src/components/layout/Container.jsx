// src/components/layout/Container.jsx
import React from "react";
import { app } from "../../utils/classnames";
import clsx from "clsx";

export const Container = ({ children, className, ...props }) => {
  return (
    <div className={clsx(app.container, className)} {...props}>
      {children}
    </div>
  );
};

export const Page = ({ children, className, ...props }) => {
  return (
    <main className={clsx(app.main, className)} {...props}>
      {children}
    </main>
  );
};
