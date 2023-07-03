import { useState, useEffect } from "react";

export default function Notification({ message, type, delay }) {
    const [display, setDisplay] = useState(true);

    // Compute the style based on the value of 'type'
    const style = type === "error" ? "border-pink-600" : "border-green-600";

    useEffect(() => {
        const timer = setTimeout(() => {
            setDisplay(false);
        }, delay);

        // Clean up the timer when the component is unmounted or updated
        return () => {
            clearTimeout(timer);
        };
    }, [delay]);

    return (
        <div className="flex justify-center">
            {display && (
                <span
                    className={`border-2 ${style} text-gray-200 font-light rounded px-2 py-1 mx-2 my-2`}
                >
                    {message}
                </span>
            )}
        </div>
    );
}
