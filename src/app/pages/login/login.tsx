"use client";
import { useTheme } from '~/app/_context/Theme';
import { useRouter } from "next/navigation";
import { useState } from "react";
import AppRouter from 'next/dist/client/components/app-router';

export function Login() {
    const { isDarkMode } = useTheme();
    const router = useRouter()

    console.log("Current theme:", isDarkMode ? "dark" : "light");
    return (
        <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="flex justify-center h-screen">
                <div className="hidden bg-cover lg:block lg:w-2/3" >
                    <div className="flex items-center h-full bg-gray-900 bg-opacity-40">
                        <div className="flex w-full h-full flex-col justify-center px-10 py-16 lg:px- z-10 bg-gradient-to-r
                            from-green-500
                            via-blue-500
                            to-purple-500
                            background-animate">
                            <h2 className={`${isDarkMode ? 'text-gray-800' : 'text-white'} text-4xl font-bold lg:mt-60 lg:ml-10 `}>WMS Lite</h2>

                            <p className="max-w-xl lg:ml-10 mt-3 text-gray-300">Lorem ipsum dolor sit, amet consectetur adipisicing elit. In autem ipsa, nulla laboriosam dolores, repellendus perferendis libero suscipit nam temporibus molestiae</p>
                            <ul className="circles lg:w-1/3">
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                            </ul>
                        </div>

                    </div>
                </div>

                <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
                    <div className="flex-1">
                        <div className="text-center">

                            <div className="">
                                <div className="relative mx-auto h-10 w-10 animate-bounce mb-12">
                                    <div className="mx-auto h-12 w-12 rounded-full bg-blue-500"></div>
                                    <span className="absolute flex h-7 w-7 animate-spin">
                                        <span className="h-6 w-6 rounded-full bg-green-400"></span>
                                    </span>
                                </div>
                                <div className={`${isDarkMode ? 'text-white' : 'text-gray-800'} text-4xl font-bold text-center`} >WMS Lite</div>
                            </div>

                            <p className="mt-3 text-gray-500 dark:text-gray-300">Sign in to access your account</p>
                        </div>

                        <div className="mt-8">
                            <form>
                                <div>
                                    <label className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'} font-bold block mb-2 text-sm `}>Email Address</label>
                                    <input type="email" name="email" id="email" placeholder="example@example.com" className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                                </div>

                                <div className="mt-6">
                                    <div className="flex justify-between mb-2">
                                        <label className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'} font-bold block text-sm `}>Password</label>
                                        <a href="#" className="text-sm text-gray-400 focus:text-blue-500 hover:text-blue-500 hover:underline">Forgot password?</a>
                                    </div>

                                    <input type="password" name="password" id="password" placeholder="Your Password" className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                                </div>

                                <div className="mt-6">
                                    <button
                                        className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 rounded-md bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                                        Sign in
                                    </button>
                                </div>

                            </form>


                            <p onClick={() => router.push('/app/pages/login/register')} className="mt-6 text-sm text-center text-gray-400">Don&#x27;t have an account yet? <a href="#" className="text-blue-500 focus:outline-none focus:underline hover:underline">Sign up</a>.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}