import type { ReactNode } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Dashboard } from "../pages/Dashboard";

export function ProtectedRoute({ children }: { children: ReactNode }) {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

export function ProtectedDashboard() {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />;
}
