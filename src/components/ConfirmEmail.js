import initPocketBase from "../helpers/initPocketbase";

import { useState, useEffect } from "react";
import { useAuthUser, useIsAuthenticated } from "react-auth-kit";

export default function ConfirmEmail() {
    const auth = useAuthUser();
    const [emailConfirmed, setEmailConfirmed] = useState(false);
    const pb = initPocketBase();

    useEffect(() => {
        const verified = pb.authStore.model.verified;
        setEmailConfirmed(verified);
    });

    return (
        <div className="bg-slate-950">
            {emailConfirmed ? (
                <span className="mr-2 mt-2 text-slate-500 text-center text-sm">
                    Email Confirmed
                </span>
            ) : (
                <span className="mr-2 mt-2 text-slate-500 text-center text-sm">
                    Email Not Confirmed
                </span>
            )}
        </div>
    );
}
