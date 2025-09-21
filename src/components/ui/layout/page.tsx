import React from "react";
import type { ReactNode } from "react";

interface PageProps {
  title: string;
  children: ReactNode;
}

function Page({ title, children }: PageProps) {
  return (
    <div className="layout-page">
      <h2 className="layout-title">{title}</h2>
      {children}
    </div>
  );
}

export default Page;
