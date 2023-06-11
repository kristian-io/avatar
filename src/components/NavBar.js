import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthUser, useSignOut, useIsAuthenticated } from 'react-auth-kit';
import initPocketBase from '../helpers/initPocketbase';

// import logo from "../../public/logo512.png"


export default function NavBar() {
    const [menuVisible, setMenuVisible] = useState("hidden")
    const isAuthenticated = useIsAuthenticated();
    const navigate = useNavigate()
    // const auth = useAuthUser()
    const signOut = useSignOut()
    const pb = initPocketBase();

    // console.log(auth())

    const toggleMenu = () => {
        if (menuVisible === "hidden") {
            setMenuVisible("visible")
        }
        else {
            setMenuVisible("hidden")
        }
    }

    const signOutUser = () => {
        pb.authStore.clear();
        signOut()
        navigate("/")
    }


    return (
        <nav className="flex items-center text-xl justify-between flex-wrap bg-slate-950 shadow-slate-600 shadow-sm p-6">
            <div className="flex-shrink-0 text-white mr-6">
                <Link to="/" className="flex items-center gap-2">
                    {/* svg logo */}
                    <img className="w-5 h-5" src="logo512.png" alt="SaaS logo" />
                    <span className="text-center">
                        AI Photo Editor
                    </span>
                </Link>
            </div>

            <div className="block lg:hidden ">
                <button onClick={toggleMenu} className="flex items-center px-3 py-2 border rounded text-zinc-100 border-zink-100 hover:text-white hover:border-white">
                    <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" /></svg>
                </button>
            </div>

            <div id="menu" className={`${menuVisible} block w-full md:flex-grow lg:flex lg:items-center lg:w-auto ml-4`}>
                <div className="flex text-sm  gap-8 pt-4 md:pt-0  items-center align-middle justify-start lg:justify-start">
                    {/* block mt-4 lg:inline-block lg:mt-0 text-gray-300 hover:text-white mr-4 */}
                    {isAuthenticated() &&
                        <>
                            <Link to={"/dashboard"} className="inline-block text-sm p-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-zinc-500 hover:bg-white lg:mt-0">
                                Dashboard </Link>


                            <Link to={"/gallery"} className="inline-block text-sm p-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-zinc-500 hover:bg-white lg:mt-0">
                                Gallery
                            </Link>
                        </>
                    }
                </div>
                <div className="flex text-sm md:flex-grow gap-8 pt-4 md:pt-0  items-center align-middle justify-end lg:justify-end">
                    {!isAuthenticated() &&
                        <Link to={"/login"} className="inline-block text-sm p-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-zinc-500 hover:bg-white lg:mt-0">
                            Sign in
                        </Link>
                    }
                    {isAuthenticated() &&
                        <button onClick={signOutUser} className="inline-block text-sm p-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-zinc-500 hover:bg-white lg:mt-0">
                            Logout
                        </button>
                    }

                </div>
                {/* <Link to={"/"} className="block mt-4 lg:inline-block lg:mt-0 text-gray-300 hover:text-white mr-4">
                        Examples
                    </Link>
                    <Link to={"/"} className="block mt-4 lg:inline-block lg:mt-0 text-gray-300 hover:text-white">
                        Blog
                    </Link> */}

            </div>

        </nav >
    )
}