import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSignIn } from "react-auth-kit";

import initPocketBase from "../helpers/initPocketbase";
import ErrorMessage from "../components/ErrorMessage";

const hintInitState = {
    email: false,
    password: false,
    emailMessage: "Must be a valid email.",
    passwordMessage: "Must be at least 8 characters long.",
};

const LOGOUT_IN_MIN = 7 * 24 * 60;

export default function Login() {
    const [isLoading, setLoading] = useState(false);
    const [isError, setError] = useState("");
    const [hint, SetHint] = useState(hintInitState);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();
    const signIn = useSignIn();
    const redirect = useNavigate();
    const pb = initPocketBase();

    async function SignUpUser(data) {
        const register_data = {
            email: data.email,
            password: data.password,
            passwordConfirm: data.password,
        };
        try {
            // register
            const record = await pb.collection("users").create(register_data);
            console.log(record);

            // send an email verification request
            // await pb.collection('users').requestVerification('test@example.com');
        } catch {
            setError("Creating account failed.");
        }
    }

    async function SignInUser(data) {
        setLoading(true);
        setError("");

        const result = await pb
            .collection("users")
            .authWithPassword(data.email, data.password);

        console.log("Result: ", result);
        if (
            signIn({
                token: pb.authStore.token,
                expiresIn: LOGOUT_IN_MIN,
                tokenType: "Bearer",
                authState: pb.authStore.model,
                // refreshToken: res.data.refreshToken,                    // Only if you are using refreshToken feature
                // refreshTokenExpireIn: res.data.refreshTokenExpireIn     // Only if you are using refreshToken feature
            })
        ) {
            redirect("/dashboard", { replace: true });
        }
    }

    // Email sing in or sing up
    async function handleSingInOrSignUp(data) {
        setLoading(true);
        setError("");

        try {
            await SignInUser(data);
        } catch (error) {
            // sign in failed, lets try registering him
            console.log("Sing in failed");
            try {
                console.log("Trying to sing up and then sign in");
                await SignUpUser(data);
                await SignInUser(data);
            } catch (error) {
                console.log("Failed to sing up and sing in");
                setError("Login failed. Try again. ");
            }
        }
        setLoading(false);
        reset();
    }

    // Provider sign in
    async function loginWithProvider(event) {
        setLoading(true);
        setError("");

        // we grab the provider from the button diretly or from the parent of the img/span...
        const provider =
            event.target.dataset.provider ||
            event.target.parentElement.dataset.provider;

        try {
            await pb.collection("users").authWithOAuth2({ provider: provider });
            if (
                signIn({
                    token: pb.authStore.token,
                    expiresIn: LOGOUT_IN_MIN,
                    tokenType: "Bearer",
                    authState: pb.authStore.model,
                    // refreshToken: res.data.refreshToken,                    // Only if you are using refreshToken feature
                    // refreshTokenExpireIn: res.data.refreshTokenExpireIn     // Only if you are using refreshToken feature
                })
            ) {
                console.log("logged in, redirecting");
                redirect("/dashboard", { replace: true });
            }
        } catch (error) {
            console.log("Error: ", error.message);
            setError(error.message);
        }

        setLoading(false);
        reset();
    }

    function validateFormData(e) {
        // email validation
        if (e.target.name === "email") {
            // for empty field we dont display anything... Form has the field as required anyway
            if (e.target.value === "") {
                SetHint({ ...hint, email: false });
            } else {
                const emailRegex =
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                SetHint({ ...hint, email: !emailRegex.test(e.target.value) });
            }
        }
        // simple password validation
        if (e.target.name === "password") {
            // for empty field we dont display anything... Form has the field as required anyway
            if (e.target.value === "") {
                SetHint({ ...hint, password: false });
            } else {
                if (e.target.value.length < 8) {
                    SetHint({ ...hint, password: true });
                } else {
                    SetHint({ ...hint, password: false });
                }
            }
        }
    }

    return (
        <div className="bg-slate-950">
            <div className="flex w-full justify-center items-center mt-4 md:mt-10 mb-4">
                <div className="mx-1 w-full md:w-4/5 lg:w-3/5 xl:w-2/5 text-xl bg-slate-900 rounded-lg shadow-gray-900 shadow-md border border-slate-800 px-4 py-4">
                    <div className="flex justify-center items-center py-4">
                        <button
                            onClick={loginWithProvider}
                            data-provider="google"
                            className="px-4 py-2 border-2 flex gap-2 border-slate-300 rounded-lg text-slate-200 hover:border-slate-400 hover:text-slate-400 hover:shadow transition duration-250"
                        >
                            <img
                                className="w-6 h-6 pt-1"
                                src="https://www.svgrepo.com/show/475656/google-color.svg"
                                loading="lazy"
                                alt="google logo"
                            />
                            <span className="self-center">
                                {isLoading
                                    ? "Please wait..."
                                    : "Sign in with Google"}
                            </span>
                        </button>
                    </div>
                    <div className="inline-flex items-center justify-center w-full">
                        <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-600" />
                        <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/2 left-1/2 dark:text-white bg-gray-800">
                            or
                        </span>
                    </div>
                    <div className="flex justify-center">
                        <form
                            onSubmit={handleSubmit(handleSingInOrSignUp)}
                            className="w-full md:w-4/5 lg:w-3/5 px-8 pb-8 mb-4"
                            onChange={(e) => validateFormData(e)}
                        >
                            <div className="mb-4">
                                <label className="block text-gray-300 text-xl font-bold mb-2">
                                    Email
                                </label>
                                <input
                                    required
                                    {...register("email", {
                                        required: true,
                                        pattern:
                                            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                    })}
                                    className="shadown appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="email"
                                    type="text"
                                    placeholder="you@email.com"
                                    autoComplete="email"
                                />
                                {/* <p>Email error: {errors.email}</p> */}
                                {hint.email && (
                                    <p className="pt-1 text-sm text-red-500 text-bold text-center">
                                        {hint.emailMessage}
                                    </p>
                                )}
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-300 text-xl font-bold mb-2">
                                    Password
                                </label>
                                <input
                                    required
                                    {...register("password")}
                                    className="shadown appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="password"
                                    type="password"
                                    autoComplete="current-password"
                                ></input>
                                {hint.password && (
                                    <p className="pt-1 text-sm text-red-500 text-bold text-center">
                                        {hint.passwordMessage}
                                    </p>
                                )}
                            </div>
                            <div className="flex justify-center ">
                                <button
                                    className="bg-transparent border-2 border-slate-300 rounded-lg hover:border-slate-400 text-slate-200 hover:text-slate-400  px-4 py-2 focus:outline-none focus:shadow-outline  hover:shadow transition duration-250"
                                    type="submit"
                                >
                                    {isLoading
                                        ? "Please wait..."
                                        : "Sign in with Email"}
                                </button>
                            </div>
                            <div>
                                <div className="flex justify-center mt-4 text-sm align-middle text-gray-500">
                                    <span>No account? </span>
                                </div>
                                <div className="flex justify-center  text-sm align-middle text-gray-500">
                                    <span>Sign in and we'll create it.</span>
                                </div>
                            </div>
                            {isError && <ErrorMessage message={isError} />}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
