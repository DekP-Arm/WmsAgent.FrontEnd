"use client";
import { useTheme } from '~/app/_context/Theme';
import { useState } from "react";
import Link from 'next/link';

export function Navbar() {
    const { isDarkMode, toggleTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} p-2 flex sticky top-0 z-50 buttonClick duration-500 flex items-center`}>
            <button onClick={toggleTheme} className="">
                <svg
                    className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'} hover:scale-125 duration-200 h-7 w-7 ml-2`}
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path stroke="none" d="M0 0h24v24H0z" />
                    <circle cx="12" cy="12" r="3" />
                    <line x1="12" y1="5" x2="12" y2="3" />
                    <line x1="17" y1="7" x2="18.4" y2="5.6" />
                    <line x1="19" y1="12" x2="21" y2="12" />
                    <line x1="17" y1="17" x2="18.4" y2="18.4" />
                    <line x1="12" y1="19" x2="12" y2="21" />
                    <line x1="7" y1="17" x2="5.6" y2="18.4" />
                    <line x1="6" y1="12" x2="4" y2="12" />
                    <line x1="7" y1="7" x2="5.6" y2="5.6" />
                </svg>
            </button>

            <div className="">
                <Link href="/pages/main">
                    <button className="text-gray-800 text-lg px-1 font-bold rounded-lg">
                        WMS
                    </button>
                </Link>
            </div>

            <div className="ml-auto">
                <Link href="/pages/shelf">
                    <button className="bg-gray-800 p-1 text-white px-2 rounded-lg">
                        Create Shelf
                    </button>
                </Link>
            </div>

            <div className="ml-auto">
                <Link href="/pages/Inbound">
                    <button className="bg-gray-800 p-1 text-white px-2 rounded-lg">
                        Inbound
                    </button>
                </Link>
            </div>
            
            <div className="ml-auto">
                <Link href="/pages/officer">
                    <button className="bg-gray-800 p-1 text-white px-2 rounded-lg">
                        Officer
                    </button>
                </Link>
            </div>
        </nav>
    );
}
