import { useAuthUser } from "react-auth-kit";
import { FaUserAstronaut } from "react-icons/fa";

import FileUpload from "../components/FileUpload";
import ConfirmEmail from "../components/ConfirmEmail";

export default function Dashboard() {
    const auth = useAuthUser();

    return (
        <div className="bg-slate-950">
            <ConfirmEmail />
            <div className="flex lg:justify-end sm:justify-center md:justify-center gap-2 pl-2 pt-2">
                <FaUserAstronaut className={"text-slate-500 w-5 h-auto"} />
                <div>
                    <span className="mr-2 mt-2 text-slate-500 text-center text-sm">
                        {" "}
                        {auth().email}
                    </span>
                </div>
            </div>

            <FileUpload />
        </div>
    );
}
