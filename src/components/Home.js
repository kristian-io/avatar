import { useState, useEffect } from "react"
// import { FaMagic } from 'react-icons/fa'
import { Link } from "react-router-dom";

const images = [
    {
        "source": "examples/source.jpg",
        "results": [
            "examples/result1.png",
            "examples/result2.png",
            "examples/result3.png"
        ]
    }
]

export default function Home() {
    const [group, SetGroup] = useState(0)
    const [resultPhotoIndex, SetResultPhotoIndex] = useState(0)
    const [resultPhoto, SetResultPhoto] = useState(images[group].results[0])
    const [sourcePhoto, SetSourcePhoto] = useState(images[group].source)

    function switchPhotoUrl(target) {
        if (target === "result") {
            const i = (resultPhotoIndex + 1) % (images[group].results.length)
            const url = images[group].results[i]

            SetResultPhotoIndex(i)
            SetResultPhoto(url)
            return url
        } else {
            // TODO implement source photo switch...
        }
    }

    useEffect(() => {
        const switchTimer = setInterval(() => {
            switchPhotoUrl("result")
        }, 5000)
        return () => clearInterval(switchTimer)
    })



    return (
        <div className="w-full h-full min-h-full bg-slate-950 overflow-auto">
            <div div className="flex flex-wrap w-full min-h-full" >
                <div className="w-full items-center md:w-1/2 lg:w-1/2 pt-4 lg:pl-6 md:pt-8 md:pb-36 sm:pb-12">
                    <div className=" mt-12  md:mt-32">
                        <h1 className="text_shadow font-extrabold text-pink-600 drop-shadow-lg shadow-green-500 text-5xl lg:text-7xl  text-center hover:scale-105 transition duration-700 ">
                            Supercharge your selfies.
                        </h1>

                    </div>
                    <p className="text_shadow text-slate-300 lg:text-3xl sm:text-xl font-bold font-mono text-center pt-8 lg:pt-14 ">
                        AI turns your selfies into a stunning, photoshop level images.
                    </p>
                    <p className="text_shadow text-slate-300 lg:text-3xl sm:text-xl font-bold text-center pt-8 pb-10 lg:pt-14">
                        Upload 15 selfies and get 300 expertly crafted photos.
                    </p>

                    <div className="flex justify-center mb-10 ">
                        <Link to={"/dashboard"} >
                            <button className="text_shadow mb-1 m-4 p-2 font-bold text-2xl rounded  border-2  hover:bg-slate-100 bg-pink-700 hover:text-pink-700 border-pink-700 transition duration-700">
                                Get Started
                            </button>
                        </Link>
                    </div>


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
                    <div className="flex justify-center items-center p-2">
                        <p className="font-extralight text-xs ">From your photos like this.</p>
                    </div>
                    <div className="flex justify-center pt-0 p-4 w-auto h-56 overflow-hidden "  >
                        <img hidden={false} src={sourcePhoto} alt="source"
                            className=" rounded-xl  " />

                    </div>
                    <div className="flex justify-center items-center p-2">
                        <p className="font-extralight text-xs ">To professional pohotoshop works of art</p>
                    </div>


                    <div className="flex flex-wrap gap-1 justify-center cursor-pointer pt-0 p-4"
                        onClick={() => switchPhotoUrl("result")}>
                        <img src={resultPhoto} alt="result"
                            className="w-auto h-1/6 rounded-xl opacity-100 transition ease-in-out delay-150 duration-500 hover:scale-105" />
                        {/* <img src="examples/result2.png" alt=""
                            className="w-auto h-1/6 rounded-xl" />
                        <img src="examples/result3.png" alt=""
                            className="w-auto h-1/6 rounded-xl" /> */}
                        {/* <span>Click to change</span> */}
                    </div>

                </div>
                {/* <h2>Examples ...</h2> */}
            </div>
        </div >
    )
}