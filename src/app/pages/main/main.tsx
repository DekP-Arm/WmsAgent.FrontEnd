"use client";
import { useTheme } from '~/app/_context/Theme';
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Main() {
    const [isVisibleA, setIsVisibleA] = useState(true);
    const [isVisibleB, setIsVisibleB] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const toggleVisibilityA = () => {
        setIsVisibleA(isVisibleA);
        setIsVisibleB(!isVisibleB);
    };

    const toggleVisibilityB = () => {
        setIsVisibleB(isVisibleB);
        setIsVisibleA(!isVisibleA);
    };

    return (
        <div className="grid grid-cols-4">
            <div className="border border-red-500">
                <div className="flex">
                    <div className="mt-8 mx-auto">
                        <div className="flex justify">
                            <div className='bg-gray-800 text-white px-20 py-1'>
                                100
                            </div>
                        </div>
                        location
                    </div>
                </div>
            </div>
            <div className="border border-red-500">
                <div>
                    <button
                        onClick={toggleDropdown}
                        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                        id="menu-button"
                        aria-expanded={isOpen}
                        aria-haspopup="true"
                    >
                        Options
                        <svg
                            className="-mr-1 ml-2 h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>

                {isOpen && (
                    <div
                        className="origin-top-right mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="menu-button"
                    >
                        <div className="py-1" role="none">
                            <a onClick={toggleVisibilityA}
                                href="#"
                                className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
                                role="menuitem"
                                id="menu-item-0"
                            >
                                location A
                            </a>
                            <a onClick={toggleVisibilityB}
                                href="#"
                                className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
                                role="menuitem"
                                id="menu-item-1"
                            >
                                location B
                            </a>

                        </div>
                    </div>
                )}
                <div onClick={toggleVisibilityA}>
                    <div className={`flex ${isVisibleA ? 'block' : 'hidden'}`}>
                        <div className="mt-8 mx-auto">
                            <div className="flex justify">
                                <div className='bg-gray-400 text-white px-14 py-1'>
                                    70
                                </div>
                                <div className='bg-gray-800 text-white px-6 py-1'>
                                    30
                                </div>
                            </div>
                            location a
                        </div>
                    </div>
                </div>
                <div onClick={toggleVisibilityB}>
                    <div className={`flex ${isVisibleB ? 'block' : 'hidden'}`}>
                        <div className="mt-8 mx-auto">
                            <div className="flex justify">
                                <div className='bg-gray-400 text-white px-14 py-1'>
                                    70
                                </div>
                                <div className='bg-gray-800 text-white px-6 py-1'>
                                    30
                                </div>
                            </div>
                            location b
                        </div>
                    </div>
                </div>
            </div>
            <div className=" border border-red-500">
                <div className={` ${isVisibleA ? 'block' : 'hidden'}`}>
                    <div className="flex">
                        <div className="mt-8 mx-auto">
                            <div className="flex justify">
                                <div className='bg-gray-400 text-white px-4 py-1'>
                                    2
                                </div>
                                <div className='bg-gray-800 text-white px-16 py-1'>
                                    8
                                </div>
                            </div>
                            shelf aa
                        </div>
                    </div>
                    <div className="flex">
                        <div className="mt-8 mx-auto">
                            <div className="flex justify">
                                <div className='bg-gray-400 text-white px-4 py-1'>
                                    2
                                </div>
                                <div className='bg-gray-800 text-white px-16 py-1'>
                                    8
                                </div>
                            </div>
                            shelf ab
                        </div>
                    </div>
                    <div className="flex">
                        <div className="mt-8 mx-auto">
                            <div className="flex justify">
                                <div className='bg-gray-400 text-white px-4 py-1'>
                                    2
                                </div>
                                <div className='bg-gray-800 text-white px-16 py-1'>
                                    8
                                </div>
                            </div>
                            shelf ac
                        </div>
                    </div>
                    <div className="flex">
                        <div className="mt-8 mx-auto">
                            <div className="flex justify">
                                <div className='bg-gray-400 text-white px-4 py-1'>
                                    2
                                </div>
                                <div className='bg-gray-800 text-white px-16 py-1'>
                                    8
                                </div>
                            </div>
                            shelf ad
                        </div>
                    </div>
                </div>
                <div className={` ${isVisibleB ? 'block' : 'hidden'}`}>
                    <div className="flex">
                        <div className="mt-8 mx-auto">
                            <div className="flex justify">
                                <div className='bg-gray-400 text-white px-4 py-1'>
                                    2
                                </div>
                                <div className='bg-gray-800 text-white px-16 py-1'>
                                    8
                                </div>
                            </div>
                            shelf ba
                        </div>
                    </div>
                    <div className="flex">
                        <div className="mt-8 mx-auto">
                            <div className="flex justify">
                                <div className='bg-gray-400 text-white px-4 py-1'>
                                    2
                                </div>
                                <div className='bg-gray-800 text-white px-16 py-1'>
                                    8
                                </div>
                            </div>
                            shelf bb
                        </div>
                    </div>
                    <div className="flex">
                        <div className="mt-8 mx-auto">
                            <div className="flex justify">
                                <div className='bg-gray-400 text-white px-4 py-1'>
                                    2
                                </div>
                                <div className='bg-gray-800 text-white px-16 py-1'>
                                    8
                                </div>
                            </div>
                            shelf bc
                        </div>
                    </div>
                    
                </div>
            </div>
            <div className="flex border border-red-500">
                <div className="mt-10 mx-auto">
                    hi
                </div>
            </div>
        </div >
    )
}