// src/components/layout/PageHeader.jsx
import React from "react";
import { header } from "../../utils/classnames";

export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className={header.container}>
      <div className={header.content}>
        <h1 className={header.title}>{title}</h1>
        {subtitle && (
          <p className={header.subtitle}>{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className={header.actions}>
          {actions}
        </div>
      )}
    </div>
  );
}