import React, { useCallback, useEffect } from "react";
import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import Dashboard from "./pages/Dashboard/Dashboard";
import PageNotFound from "./components/PageNotFound";
import { persistedStore } from "./app/store.js";
import SingleCall from "./pages/SingleCall/SingleCall.jsx";
import BulkCall from "./pages/BulkCall/BulkCall.jsx";
import CallLog from "./pages/CallLog/CallLog.jsx";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/single-call"
            element={
              <AdminProtectedRoute>
                <SingleCall />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/bulk-call"
            element={
              <AdminProtectedRoute>
                <BulkCall />
              </AdminProtectedRoute>
            }
          />{" "}
          <Route
            path="/call-log"
            element={
              <AdminProtectedRoute>
                <CallLog />
              </AdminProtectedRoute>
            }
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
