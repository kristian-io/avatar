import React from 'react';
import NavBar from './components/NavBar'

const Layout = ({ children }) => {
    return (
        <>
            <div>
                <NavBar />
            </div>
            <main>{children}</main>
        </>
    )
}

export default Layout;