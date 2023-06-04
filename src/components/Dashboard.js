import { useAuthUser, useIsAuthenticated } from 'react-auth-kit'
import { useNavigate } from 'react-router-dom'
import { FaUserAstronaut } from 'react-icons/fa'


import FileUpload from './FileUpload'
import ConfirmEmail from './ConfirmEmail'

export default function Dashboard() {
    const isAuthenticated = useIsAuthenticated()
    const navigate = useNavigate()
    const auth = useAuthUser()




    // if (isAuthenticated()) {

    return (
        <>
            <ConfirmEmail />
            <div className='flex lg:justify-end sm:justify-center md:justify-center gap-2 pl-2 pt-2'>

                <FaUserAstronaut className={"text-slate-500 w-5 h-auto"} />
                <div>
                    <span className='mr-2 mt-2 text-slate-500 text-center text-sm'> {auth().email}</span>
                </div>

            </div>

            <FileUpload />
        </>
    )
    // }
    // else return navigate("/login", { replace: true })


}