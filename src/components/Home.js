import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Examples from "./Examples";

export default function Home() {
    const GetStartedButton = () => (
        <div className="flex justify-center mb-10 ">
            <Link to={"/dashboard"}>
                <button className="text_shadow mb-1 m-4 p-2 font-bold text-2xl rounded  border-2  hover:bg-slate-100 bg-pink-700 hover:text-pink-700 border-pink-700 transition duration-700">
                    Get Started
                </button>
            </Link>
        </div>
    );

    return (
        <div className="w-full h-full min-h-full bg-slate-950 overflow-auto">
            <div div className="flex flex-wrap w-full min-h-full">
                <div className="w-full items-center md:w-1/2 lg:w-1/2 lg:pt-4 lg:pl-6 md:pt-8 md:pb-36 sm:pb-12">
                    <div className="mt-12  md:mt-15 lg:mt-20 2xl:mt-32">
                        <h1 className="text_shadow font-extrabold text-pink-600 drop-shadow-lg shadow-green-500 text-3xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-7xl text-center hover:scale-105 transition duration-700 ">
                            Supercharge your selfies.
                        </h1>
                    </div>
                    <p className="text_shadow text-slate-300 2xl:text-4xl lg:text-2xl sm:text-xl font-bold font-mono text-center pt-8 lg:pt-14 ">
                        AI turns your selfies into a stunning, photoshop level
                        images.
                    </p>
                    <p className="text_shadow text-slate-300 2xl:text-4xl lg:text-2xl sm:text-xl font-bold text-center pt-8 pb-10 lg:pt-14">
                        Upload 15 selfies and get 300 expertly crafted photos.
                    </p>

                    <GetStartedButton />

                    {/* <div className="flex justify-center">
                        <input
                            className="appearance-none rounded-md w-4/5 h-12 md:w-2/3 lg:w-3/5 p-2 focus:shadow-outline focus:outline-2 focus:outline-dotted outline-pink-700 text-pink-600 font-bold text-2xl "
                            required
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            autoComplete="email">
                        </input>
                    </div>
                    <div className="flex justify-center ">
                        <button className="text_shadow mb-1 m-4 p-2 font-bold text-2xl rounded  border-2  hover:bg-slate-100 bg-pink-700 hover:text-pink-700 border-pink-700 transition duration-700" >
                            Join waiting list
                        </button>
                    </div>
                    <div className="flex justify-center">
                        <p className="text-xs text-slate-700">We'll let you know when we launch. No spam. </p>
                    </div> */}
                </div>
                <div className="w-full md:w-1/2 lg:w-1/2 mb-10">
                    <Examples />
                </div>
            </div>
        </div>
    );
}
