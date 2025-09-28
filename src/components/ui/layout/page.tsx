import React from "react";
import type { ReactNode } from "react";

interface PageProps {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}

function Page({ title, description, actions, children }: PageProps) {
  return (
    <section className="layout-page">
      {(title || description || actions) && (
        <header className="layout-page__header">
          <div className="layout-page__heading">
            {title && <h2 className="layout-title">{title}</h2>}
            {description && (
              <div className="layout-description">{description}</div>
            )}
          </div>

          {actions ? <div className="layout-page__actions">{actions}</div> : null}
        </header>
      )}

      <div className="layout-page__content">{children}</div>
    </section>
  );
}

export default Page;
