import { useState } from "react";

export default function ErrorMessage({ message }) {
    const [display, setDisplay] = useState(true);

    setTimeout(() => {
        setDisplay(false);
    }, 5000);

    return (
        <div className="flex justify-center">
            {display && (
                <span className="border-2 border-pink-600 text-gray-200 font-light rounded px-2 py-1 mx-2 my-2">
                    {message}
                </span>
            )}
        </div>
    );
}
