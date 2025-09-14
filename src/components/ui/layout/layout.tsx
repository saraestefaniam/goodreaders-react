import React from "react";
import Footer from "./footer";
import Header from "./header";
import "./layout.css";
import { Outlet } from "react-router-dom";
import ErrorBoundary from "../errors/error-boundary";

function Layout() {
  return (
    <div className="layout">
      <Header />
      <main className="layout-main">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
