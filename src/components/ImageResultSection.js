import { useState } from "react";

import { FaDownload } from "react-icons/fa";
import { FaSpinner } from "react-icons/fa";
import { MdOutlineOpenInNew } from "react-icons/md";

const THUMB_SIZE = "0x300";

export default function ImageResultSection({
    url,
    handleDownload,
    handlePreview,
}) {
    const [loading, setLoading] = useState(true);

    const img = new Image();
    img.onload = () => {
        setLoading(false);
    };
    img.src = url + "&thumb=" + THUMB_SIZE;

    return (
        <section className="flex-shrink flex-grow-0" key={img.src}>
            <div className="z-20 h-36 lg:h-56 w-36 lg:w-56 rounded-lg">
                {loading && (
                    <div className="bg-slate-800 h-36 lg:h-56 w-36 lg:w-56 rounded-lg bg-contain">
                        <div className="flex justify-center h-full">
                            <FaSpinner
                                className="animate-spin m-auto"
                                size={25}
                            />
                        </div>
                    </div>
                )}
                {!loading && (
                    <div
                        style={{ "--image-url": `url(${img.src})` }}
                        className="bg-[image:var(--image-url)] h-36 lg:h-56 w-36 lg:w-56 rounded-lg bg-contain"
                    >
                        <dir className="text-slate-900 p-0 m-0 z-30 hover:opacity-70 opacity-0 bg-slate-300 w-full h-full rounded-lg transition delay-50 duration-300">
                            <div className="flex justify-center items-end align-middle h-1/2">
                                <button
                                    className="m-2"
                                    onClick={() => handlePreview(url)}
                                >
                                    <MdOutlineOpenInNew size={30} />
                                </button>
                            </div>
                            <div className="flex justify-center items-start">
                                <button
                                    className="m-2"
                                    onClick={() => handleDownload(url)}
                                >
                                    <FaDownload size={30} />
                                </button>
                            </div>
                        </dir>
                    </div>
                )}
            </div>
        </section>
    );
}
