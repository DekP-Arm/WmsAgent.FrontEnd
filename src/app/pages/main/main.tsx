"use client";
import { useTheme } from '~/app/_context/Theme';
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Main() {
    const [isVisibleA, setIsVisibleA] = useState(true);
    const [isVisibleB, setIsVisibleB] = useState(true);

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