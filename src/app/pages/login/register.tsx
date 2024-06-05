import { useRouter } from "next/navigation";
import { useState } from "react";

export function Register() {
    return (
        <div className="bg-white dark:bg-gray-900">
            <div className="flex justify-center h-screen">
                <div className="hidden bg-cover lg:block lg:w-1/3" >
                    <div className="flex items-center h-full bg-gray-900 bg-opacity-40">
                        <div className="flex w-full h-full flex-col justify-center px-10 py-16 lg:px- z-10 bg-gradient-to-r
        from-green-500
        via-blue-500
        to-purple-500
        background-animate">
                            <h2 className="text-4xl font-bold text-white">WMS Lite</h2>

                            <p className="max-w-xl mt-3 text-gray-300">Lorem ipsum dolor sit, amet consectetur adipisicing elit. In autem ipsa, nulla laboriosam dolores, repellendus perferendis libero suscipit nam temporibus molestiae</p>
                        </div>
                        
                    </div>
                </div>

                <div className="flex items-center w-full max-w-lg px-6 mx-auto lg:w-4/6">
                    <div>
                        <div className="inline-flex">
                            <div className="relative ml-3 mx-auto h-10 w-10 animate-bounce mb-">
                                <div className="mx-auto h-12 w-12 rounded-full bg-blue-500"></div>
                                <span className="absolute flex h-7 w-7 animate-spin">
                                    <span className="h-6 w-6 rounded-full bg-green-400"></span>
                                </span>
                            </div>
                            <div className="mt-4 ml-7 text-4xl font-bold text-center text-gray-800 dark:text-white">
                                Create an Account
                            </div>
                        </div>
                        <div className="mb-4 md:flex md:justify-between mt-16">
                            <div className="mb-4 md:mr-2 md:mb-0">
                                <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-white" >
                                    First Name
                                </label>
                                <input
                                    className="w-full px-3 py-2 text-sm leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                    id="firstName"
                                    type="text"
                                    placeholder="First Name"
                                />
                            </div>
                            <div className="md:ml-2">
                                <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-white" >
                                    Last Name
                                </label>
                                <input
                                    className="w-full px-3 py-2 text-sm leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                    id="lastName"
                                    type="text"
                                    placeholder="Last Name"
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-white" >
                                Email
                            </label>
                            <input
                                className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                id="email"
                                type="email"
                                placeholder="Email"
                            />
                        </div>
                        <div className="mb-4 md:flex md:justify-between">
                            <div className="mb-4 md:mr-2 md:mb-0">
                                <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-white">
                                    Password
                                </label>
                                <input
                                    className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 dark:text-white border border-red-500 rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                    id="password"
                                    type="password"
                                    placeholder="******************"
                                />
                                <p className="text-xs italic text-red-500">Please choose a password.</p>
                            </div>
                            <div className="md:ml-2">
                                <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-white">
                                    Confirm Password
                                </label>
                                <input
                                    className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                    id="c_password"
                                    type="password"
                                    placeholder="******************"
                                />
                            </div>
                        </div>
                        <div className="mb-6 text-center text-md">
                            <button
                                className="w-full px-4 py-2 text-white bg-blue-500 rounded-full hover:bg-blue-700 dark:bg-blue-700 dark:text-white dark:hover:bg-blue-900 focus:outline-none focus:shadow-outline"
                                type="button"
                            >
                                Register Account
                            </button>
                        </div>
                        <hr className="mb-6 border-t" />
                        <div className="text-center">
                            <a className="inline-block text-sm text-blue-500 dark:text-blue-500 align-baseline hover:text-blue-800"
                                href="#">
                                Forgot Password?
                            </a>
                        </div>
                        <div className="text-center">
                            <a className="inline-block text-sm text-blue-500 dark:text-blue-500 align-baseline hover:text-blue-800"
                                href="./index.html">
                                Already have an account? Login!
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}