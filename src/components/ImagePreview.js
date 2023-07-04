import React, { useState } from "react";
import initPocketBase from "../helpers/initPocketbase";
import { FaSpinner } from "react-icons/fa";

export default function ImagePreview({ url, setPreviewUrl, closePreview }) {
    const [loading, setLoading] = useState(true);
    const pb = initPocketBase();

    const refreshUrl = async () => {
        const fileToken = await pb.files.getToken();
        const partUrl = url.split("?token=")[0];
        const newUrl = partUrl + "?token=" + fileToken;
        setPreviewUrl(newUrl);
    };

    const img = new Image();
    img.onload = () => {
        setLoading(false);
    };
    img.src = url;

    return (
        <div
            className="z-40 sticky top-0 flex justify-center cursor-pointer bg-slate-800/60 h-screen"
            onClick={closePreview}
        >
            <div className="w-screen lg:w-2/3 ">
                {loading && (
                    <div className="flex justify-center items-center">
                        <div className="h-screen items-center m-auto pt-[30%] align-middle">
                            <FaSpinner
                                className="animate-spin m-auto p-2"
                                size={55}
                            />
                            Loading
                        </div>
                    </div>
                )}
                <img
                    onLoadStart={() => setLoading(true)}
                    onLoadedData={() => setLoading(false)}
                    onError={refreshUrl}
                    alt="preview"
                    fetchpriority="high"
                    className="z-50 aspect-auto m-auto rounded-lg bg-no-repeat"
                    src={img.src}
                />
            </div>
        </div>
    );
}
