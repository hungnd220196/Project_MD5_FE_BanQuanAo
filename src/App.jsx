import React from "react";
import DashBoard from "./pages/dashboard";
import { Route, Routes } from "react-router-dom";
import LayoutIndex from "./layouts";
import Student from "./pages/student";
import Report from "./pages/report";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/admin" element={<LayoutIndex />}>
          <Route index element={<DashBoard />} />
          {/* <Route path="dashboard" element={<DashBoard />} /> */}
          <Route path="student" element={<Student />} />
          <Route path="report" element={<Report />} />
        </Route>
      </Routes>
    </>
  );
}
