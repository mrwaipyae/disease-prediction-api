import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import Register from "./pages/Register";
import PatientPage from "./pages/Patient/PatientPage";
import Results from "./pages/Patient/Results";
import About from "./pages/About";
import LoginPage from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Logout from "./pages/Logout";
import AdminLogin from "./pages/AdminLogin/AdminLogin";

export default function Index() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="doctors" element={<Doctors />} />
                    <Route path="register" element={<Register />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="logout" element={<Logout />} />
                    <Route path="admin-login" element={<AdminLogin />} />
                </Route>

                {/* Protected Routes */}
                <Route
                    path="/patient"
                    element={
                        <ProtectedRoute>
                            <PatientPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/patient/results"
                    element={
                        <ProtectedRoute>
                            <Results />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}
