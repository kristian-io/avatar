import React from "react";
import NavBar from "../layouts/NavBar";

const Layout = ({ children }) => {
    return (
        <>
            <div>
                <NavBar />
            </div>
            <main>{children}</main>
        </>
    );
};

export default Layout;
