"use client";
import { useTheme } from '~/app/_context/Theme';
import { useState, useRef } from "react";
import Link from 'next/link';
import { PlusCircleIcon, PlusIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'; // Import icons

export function Main() {
    const { isDarkMode } = useTheme();
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const [shelves, setShelves] = useState({
        shelfAA: [{ id: 1, name: 'Shelf 1' }, { id: 2, name: 'Shelf 2' }],
        shelfAB: [{ id: 1, name: 'Shelf 1' }, { id: 2, name: 'Shelf 2' }]
    });
    const [reserves, setReserves] = useState({
        reserveAA: [{ id: 1, name: 'Reserve 1' }, { id: 2, name: 'Reserve 2' }],
        reserveAB: [{ id: 1, name: 'Reserve 1' }, { id: 2, name: 'Reserve 2' }]
    });
    const [selectedItem, setSelectedItem] = useState(null);
    const shelfRefs = useRef({});
    const reserveRefs = useRef({});

    // Handle item click for shelves and reserves
    const handleItemClick = (item, groupName, isShelf) => {
        setSelectedItem({ ...item, group: groupName, isShelf });
    };

    // Function to add a new item to an existing group
    const addItem = (groupName, isShelf) => {
        if (isShelf) {
            setShelves(prevShelves => {
                const newShelves = [...prevShelves[groupName]];
                if (newShelves.length < 8) {
                    const newId = newShelves.length + 1;
                    const newShelf = { id: newId, name: `Shelf ${newId}` };
                    newShelves.push(newShelf);
                }
                return { ...prevShelves, [groupName]: newShelves };
            });
        } else {
            setReserves(prevReserves => {
                const newReserves = [...prevReserves[groupName]];
                if (newReserves.length < 8) {
                    const newId = newReserves.length + 1;
                    const newReserve = { id: newId, name: `Reserve ${newId}` };
                    newReserves.push(newReserve);
                }
                return { ...prevReserves, [groupName]: newReserves };
            });
        }
    };

    // Function to generate the next group name based on existing groups
    const generateNextGroupName = (isShelf) => {
        const existingGroups = Object.keys(isShelf ? shelves : reserves);
        const lastGroup = existingGroups[existingGroups.length - 1];
        const groupPrefix = lastGroup.slice(0, -1);
        const lastChar = lastGroup.slice(-1);

        // Increment the character (e.g., 'A' -> 'B')
        const nextChar = alphabet[(alphabet.indexOf(lastChar) + 1) % alphabet.length];

        // If 'Z' is exceeded, move to the next prefix (e.g., 'AA' -> 'BA')
        if (nextChar === 'A' && lastChar === 'Z') {
            const nextPrefix = alphabet[alphabet.indexOf(groupPrefix) + 1];
            return `${nextPrefix}A`;
        } else {
            return `${groupPrefix}${nextChar}`;
        }
    };

    // Add a new group dynamically
    const addGroup = (isShelf) => {
        const newGroupName = generateNextGroupName(isShelf);
        if (isShelf) {
            setShelves(prevShelves => ({
                ...prevShelves,
                [newGroupName]: [{ id: 1, name: 'Shelf 1' }]
            }));
        } else {
            setReserves(prevReserves => ({
                ...prevReserves,
                [newGroupName]: [{ id: 1, name: 'Reserve 1' }]
            }));
        }
    };

    // Function to render groups
    const renderGroup = (groupName, items, refMap, isShelf) => (
        <div className="flex flex-col items-center mb-8" ref={el => refMap.current[groupName] = el}>
            <div className="w-full h-full max-w-xs" style={{ height: '200px' }}>
                <div className="grid grid-cols-2 grid-rows-4 gap-2 w-full h-full border-2 border-dashed border-gray-300 p-2">
                    {items.map(item => (
                        <Link href={`/pages/${isShelf ? 'shelf-list' : 'reserve-list'}?item=${item.name}`} key={item.id}>
                            <div
                                className={`w-full h-full flex items-center justify-center ${isDarkMode ? 'bg-zinc-700 text-white' : 'bg-zinc-700 text-white'} border-2 ${isDarkMode ? 'border-zinc-500' : 'border-zinc-800'} p-2 cursor-pointer ${selectedItem && selectedItem.id === item.id && 'bg-green-500'}`}
                                onClick={() => handleItemClick({ id: item.id, name: item.name }, groupName, isShelf)}
                            >
                                {item.name}
                            </div>
                        </Link>
                    ))}
                    {Array.from({ length: 8 - items.length }, (_, index) => (
                        <div key={`empty-${index}`} className="w-full h-full flex items-center justify-center border border-dashed border-gray-300">
                            {/* Empty slot */}
                        </div>
                    ))}
                </div>
            </div>
            <div className='flex'>
                <div className={`${isDarkMode ? 'text-white' : 'text-black'} mt-2.5 mr-1 text-center`}>
                    {groupName}
                </div>
                <button
                    onClick={() => addItem(groupName, isShelf)}
                    className={`mt-2 p-1 ${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white rounded-full flex items-center justify-center`}
                >
                    <PlusIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );

    return (
        <div className={`${isDarkMode ? 'bg-zinc-900' : 'bg-white'} min-h-screen flex`}>
            <div className='w-2/3'>
                <div className="relative flex flex-col items-center">
                    <div className='flex items-center justify-between w-full mt-6 mb-4'>
                        <Link href="/pages/warehouse">
                            <button
                                className={`p-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} text-white rounded-full ml-8 flex items-center justify-center`}
                            >
                                <ArrowLeftIcon className="w-6 h-6" />
                            </button>
                        </Link>
                        <h1 className={`${isDarkMode ? 'text-white' : 'text-black'} text-center text-2xl font-bold flex-grow`}>Shelves</h1>
                        <button
                            onClick={() => addGroup(true)}
                            className={`p-2 ${isDarkMode ? 'bg-green-600' : 'bg-green-500'} text-white rounded-full mr-8 flex items-center justify-center`}
                        >
                            <PlusCircleIcon className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="mt-2">
                        <div className="grid grid-cols-4 gap-12">
                            {Object.keys(shelves).map(shelfName => renderGroup(shelfName, shelves[shelfName], shelfRefs, true))}
                        </div>
                    </div>
                </div>
            </div>

            <div className='w-1/3'>
                <div className='items-center relative flex flex-col'>
                    <div className='flex items-center justify-between w-full mt-6 mb-4'>
                        <h1 className={`${isDarkMode ? 'text-white' : 'text-black'} text-center text-2xl font-bold flex-grow`}>Reserves</h1>
                        <button
                            onClick={() => addGroup(false)}
                            className={`p-2 ${isDarkMode ? 'bg-green-600' : 'bg-green-500'} text-white rounded-full mr-8 flex items-center justify-center`}
                        >
                            <PlusCircleIcon className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="mt-4">
                        <div className="grid grid-cols-2 gap-12">
                            {Object.keys(reserves).map(reserveName => renderGroup(reserveName, reserves[reserveName], reserveRefs, false))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
