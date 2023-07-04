import { useState, useEffect } from "react";

const IMAGES = [
    {
        source: "examples/group1/source.jpg",
        results: [
            "examples/group1/result1.png",
            "examples/group1/result2.png",
            "examples/group1/result3.png",
        ],
    },
    {
        source: "examples/group2/source.jpg",
        results: [
            "examples/group2/result1.png",
            "examples/group2/result2.png",
            "examples/group2/result3.png",
        ],
    },
];

export default function Examples() {
    const [group, SetGroup] = useState(0);
    const [resultPhotoIndex, SetResultPhotoIndex] = useState(0);
    const [resultPhoto, SetResultPhoto] = useState(IMAGES[group].results[0]);
    const [sourcePhoto, SetSourcePhoto] = useState(IMAGES[group].source);

    function switchPhotoUrl(target) {
        if (target === "result") {
            // result images switching
            const i = (resultPhotoIndex + 1) % IMAGES[group].results.length;
            const url = IMAGES[group].results[i];

            SetResultPhotoIndex(i);
            SetResultPhoto(url);
            return url;
        } else {
            // source images switching
            const group_index = (group + 1) % IMAGES.length;
            const url = IMAGES[group_index].source;
            SetSourcePhoto(url);
            SetResultPhoto(IMAGES[group_index].results[0]);
            SetGroup(group_index);
            return url;
        }
    }

    useEffect(() => {
        const switchTimer = setInterval(() => {
            switchPhotoUrl("result");
        }, 5000);
        return () => clearInterval(switchTimer);
    });

    return (
        <>
            <div className="flex justify-center items-center p-2">
                <p className="font-extralight text-xs">
                    From your photos like this.
                </p>
            </div>
            <div className="flex justify-center pt-0 p-4 w-auto h-32 2xl:h-56 overflow-hidden">
                <img
                    hidden={false}
                    src={sourcePhoto}
                    alt="source"
                    className="rounded-xl cursor-pointer "
                    onClick={() => switchPhotoUrl("source")}
                />
            </div>
            <div className="flex justify-center items-center p-2">
                <p className="font-extralight text-xs ">
                    To professional pohotoshop works of art
                </p>
            </div>

            <div className="flex flex-wrap gap-1 justify-center pt-0 p-4">
                <img
                    src={resultPhoto}
                    alt="result"
                    onClick={() => switchPhotoUrl("result")}
                    className="w-auto 2xl:h-[550px] h-[320px] rounded-xl cursor-pointer  opacity-100 transition ease-in-out delay-150 duration-500 hover:scale-105"
                />
                {/* <img src="examples/result2.png" alt=""
                            className="w-auto h-1/6 rounded-xl" />
                        <img src="examples/result3.png" alt=""
                            className="w-auto h-1/6 rounded-xl" /> */}
                {/* <span>Click to change</span> */}
            </div>
        </>
    );
}
