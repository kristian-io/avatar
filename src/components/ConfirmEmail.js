import initPocketBase from '../helpers/initPocketbase';

import { useState, useEffect } from 'react';
import { useAuthUser, useIsAuthenticated } from 'react-auth-kit'



export default function ConfirmEmail() {
    const auth = useAuthUser()
    const [emailConfirmed, setEmailConfirmed] = useState(false)
    const pb = initPocketBase()


    useEffect(() => {
        const verified = pb.authStore.model.verified
        setEmailConfirmed(verified)
    })


    return (
        <div>
            {emailConfirmed ? <h1>Email Confirmed</h1> : <h1>Email Not Confirmed</h1>}
        </div>
    )
}