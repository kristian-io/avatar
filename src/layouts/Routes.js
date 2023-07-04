import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Home from "../pages/Home";
import GalleryResults from "../pages/GalleryResults";

import { useIsAuthenticated } from "react-auth-kit";
import { useLocation, Navigate } from "react-router-dom";

export default function RouteComponent() {
    const PrivateRoute = ({ children, loginPath }) => {
        const isAuthenticated = useIsAuthenticated();
        const location = useLocation();

        if (isAuthenticated()) {
            return children;
        }

        return <Navigate to={loginPath} state={{ from: location }} replace />;
    };

    return (
        <Routes>
            <Route path={"/"} element={<Home />} />
            <Route
                path={"/dashboard"}
                element={
                    <PrivateRoute loginPath={"/login"}>
                        <Dashboard />
                    </PrivateRoute>
                }
            />
            <Route
                path={"/gallery"}
                element={
                    <PrivateRoute loginPath={"/login"}>
                        <GalleryResults />
                    </PrivateRoute>
                }
            />
            <Route path="/login" element={<Login />} />
        </Routes>
    );
}
