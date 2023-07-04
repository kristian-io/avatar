import "./App.css";
import RouteComponent from "./layouts/Routes";
import RootLayout from "./layouts/Layout";
import { AuthProvider } from "react-auth-kit";
import { Analytics } from "@vercel/analytics/react";

export default function App() {
    return (
        <>
            <AuthProvider
                authType={"cookie"}
                authName={"_auth"}
                cookieDomain={window.location.hostname}
                cookieSecure={window.location.protocol === "https:"}
            >
                <RootLayout>
                    <RouteComponent />
                </RootLayout>
            </AuthProvider>
            <Analytics />
        </>
    );
}
