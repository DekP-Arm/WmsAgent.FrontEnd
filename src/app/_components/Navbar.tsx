"use client";
import { useTheme } from '~/app/_context/Theme';

export function Navbar() {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <nav className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} p-1 sticky top-0 z-50`}>
            <button onClick={toggleTheme} className="mt-1">
                <svg className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'} h-7 w-7 ml-2`} width="20" height="20" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <circle cx="12" cy="12" r="3" />  <line x1="12" y1="5" x2="12" y2="3" />  <line x1="17" y1="7" x2="18.4" y2="5.6" />  <line x1="19" y1="12" x2="21" y2="12" />  <line x1="17" y1="17" x2="18.4" y2="18.4" />  <line x1="12" y1="19" x2="12" y2="21" />  <line x1="7" y1="17" x2="5.6" y2="18.4" />  <line x1="6" y1="12" x2="4" y2="12" />  <line x1="7" y1="7" x2="5.6" y2="5.6" /></svg>
            </button>
        </nav>
    );
}