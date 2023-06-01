import initPocketBase from '../helpers/initPocketbase';

import { useState } from 'react';
import { useForm } from "react-hook-form"
import { useNavigate } from 'react-router-dom';
import { useSignIn } from 'react-auth-kit'


function ErrorMessage({ message }) {
    const [display, setDisplay] = useState(true)

    setTimeout(() => {
        setDisplay(false)
    }, 5000)

    return (
        <div className="flex justify-center">
            {display &&
                <span className="border-2 border-pink-600 text-gray-200 font-light rounded px-2 py-1 mx-2 my-2" >
                    {message}
                </span>
            }
        </div>
    )
}


export default function Login() {
    const [isLoading, setLoading,] = useState(false)
    const [isError, setError] = useState("")
    const { register, handleSubmit, reset } = useForm();
    const signIn = useSignIn()
    const redirect = useNavigate()
    const pb = initPocketBase();

    const LOGOUT_IN_MIN = 7 * 24 * 60

    async function login(data) {
        setLoading(true);
        setError("")
        try {
            const result = await pb
                .collection('users')
                .authWithPassword(data.email, data.password);

            console.log("Result: ", result)
            if (signIn(
                {
                    token: pb.authStore.token,
                    expiresIn: LOGOUT_IN_MIN,
                    tokenType: "Bearer",
                    authState: pb.authStore.model,
                    // refreshToken: res.data.refreshToken,                    // Only if you are using refreshToken feature
                    // refreshTokenExpireIn: res.data.refreshTokenExpireIn     // Only if you are using refreshToken feature
                }
            )) {
                // Redirect or do-something
                // console.log("logged in, redirecting")
                redirect("/dashboard", { replace: true })

            }
        } catch (error) {
            console.log("Error: ", error.message)
            setError(error.message)
        }

        setLoading(false)
        reset()
    }



    // Provider sign in
    async function loginWithProvider(event) {
        setLoading(true);
        setError("")

        // console.log(event.target.parentElement.dataset.provider)
        // we grab the provider from the button diretly or from the parent of the img/span...
        const provider = event.target.dataset.provider || event.target.parentElement.dataset.provider

        try {
            await pb
                .collection('users')
                .authWithOAuth2({ provider: provider });
            if (signIn(
                {
                    token: pb.authStore.token,
                    expiresIn: LOGOUT_IN_MIN,
                    tokenType: "Bearer",
                    authState: pb.authStore.model,
                    // refreshToken: res.data.refreshToken,                    // Only if you are using refreshToken feature
                    // refreshTokenExpireIn: res.data.refreshTokenExpireIn     // Only if you are using refreshToken feature
                }
            )) {
                // Redirect or do-something
                console.log("logged in, redirecting")
                redirect("/dashboard", { replace: true })

            }

        } catch (error) {
            console.log("Error: ", error.message)
            setError(error.message)
        }

        setLoading(false)
        reset()
    }


    return (
        <div className="flex w-full justify-center items-center mt-4">
            <div className="mx-1 w-full md:w-4/5 lg:w-3/5 xl:w-2/5 text-xl bg-gray-800 rounded-lg shadow-gray-800 shadow-md border-2 border-gray-600 px-4 py-4"  >
                {/* <h1 className=" text-cyan-300 text-4xl capitalize text-center">Login</h1> */}
                <div className="flex justify-center items-center py-4">
                    <button onClick={loginWithProvider} data-provider="google" className="px-4 py-2 border flex gap-2 border-slate-200 rounded-lg text-slate-200 hover:border-slate-400 hover:text-slate-400 hover:shadow transition duration-250">
                        <img className="w-6 h-6 pt-1" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo" />
                        <span className='self-center'>{isLoading ? "Logging in..." : "Login with Google"}</span>
                    </button>
                </div>
                <div className="inline-flex items-center justify-center w-full">
                    <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-600" />
                    <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/2 left-1/2 dark:text-white bg-gray-800">
                        or
                    </span>
                </div>
                <div className='flex justify-center'>
                    <form onSubmit={handleSubmit(login)} className="w-full md:w-4/5 lg:w-3/5 px-8 pb-8 mb-4">
                        <div className="mb-4">
                            <label className="block text-gray-300 text-xl font-bold mb-2">
                                Email
                            </label>
                            <input required {...register("email")} className="shadown appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="text" placeholder="you@email.com" />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-300 text-xl font-bold mb-2">
                                Password
                            </label>
                            <input required  {...register("password")} className="shadown appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password">
                            </input>
                        </div>
                        <div className="flex justify-center " >
                            <button className="bg-transparent border border-slate-200 rounded-lg hover:border-slate-400 text-slate-200 hover:text-slate-400  py-2 px-4 focus:outline-none focus:shadow-outline  hover:shadow transition duration-250" type="submit">
                                {isLoading ? "Please wait..." : "Login"}
                            </button>
                        </div>
                        {isError && <ErrorMessage message={isError} />}
                    </form>
                </div>

            </div>
        </div>
    )
}



