"use client";
import { useTheme } from '~/app/_context/Theme';
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { PlusCircleIcon, PlusIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import axios from 'axios'; // Ensure axios is installed

export function Warehouse() {
    const { isDarkMode } = useTheme();
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const router = useRouter();
    const searchParams = useSearchParams();
    const warehouseId = searchParams.get('id');

    const [shelves, setShelves] = useState({
        ZoneA: [{ id: 1, name: 'Group Shelf AA' }, { id: 2, name: 'Group Shelf AB' }],
        ZoneB: [{ id: 3, name: 'Group Shelf BA' }, { id: 4, name: 'Group Shelf BB' }]
    });
    const [reserves, setReserves] = useState({
        DockA: [{ id: 1, name: 'Group AA' }, { id: 2, name: 'Group AB' }],
        DockB: [{ id: 3, name: 'Group BA' }, { id: 4, name: 'Group BB' }]
    });
    const [selectedItem, setSelectedItem] = useState(null);
    const [shelfGridConfig, setShelfGridConfig] = useState({ rows: 4, cols: 2 });
    const [reserveGridConfig, setReserveGridConfig] = useState({ rows: 4, cols: 2 });
    const shelfRefs = useRef({});
    const reserveRefs = useRef({});


    const handleItemClick = (item, groupName, isShelf) => {
        setSelectedItem({ ...item, group: groupName, isShelf });
    };

    const addItem = (groupName, isShelf) => {
        const gridConfig = isShelf ? shelfGridConfig : reserveGridConfig;
        if (isShelf) {
            setShelves(prevShelves => {
                const newShelves = [...prevShelves[groupName]];
                const maxItems = gridConfig.rows * gridConfig.cols;
                if (newShelves.length < maxItems) {
                    const newId = newShelves.length + 1;
                    const newShelf = { id: newId, name: `Shelf ${newId}` };
                    newShelves.push(newShelf);
                }
                return { ...prevShelves, [groupName]: newShelves };
            });
        } else {
            setReserves(prevReserves => {
                const newReserves = [...prevReserves[groupName]];
                const maxItems = gridConfig.rows * gridConfig.cols;
                if (newReserves.length < maxItems) {
                    const newId = newReserves.length + 1;
                    const newReserve = { id: newId, name: `Palette ${newId}` };
                    newReserves.push(newReserve);
                }
                return { ...prevReserves, [groupName]: newReserves };
            });
        }
    };

    const generateNextGroupName = (existingGroups) => {
        const lastGroup = existingGroups[existingGroups.length - 1];
        const groupPrefix = lastGroup.slice(0, -1);
        const lastChar = lastGroup.slice(-1);
        const nextChar = alphabet[(alphabet.indexOf(lastChar) + 1) % alphabet.length];

        if (nextChar === 'A' && lastChar === 'Z') {
            const nextPrefix = alphabet[alphabet.indexOf(groupPrefix.slice(-1)) + 1];
            return `${groupPrefix.slice(0, -1)}${nextPrefix}A`;
        } else {
            return `${groupPrefix}${nextChar}`;
        }
    };

    const addGroup = () => {
        const newZoneName = generateNextGroupName(Object.keys(shelves));
        const newDocumentName = newZoneName.replace('Zone', 'Dock');

        setShelves(prevShelves => ({
            ...prevShelves,
            [newZoneName]: [{ id: 1, name: 'Shelf 1' }]
        }));

        setReserves(prevReserves => ({
            ...prevReserves,
            [newDocumentName]: [{ id: 1, name: 'Palette 1' }]
        }));
    };

    const getGridClasses = (rows, cols) => {
        const colClass = cols === 3 ? `grid-cols-${cols}` : 'grid-cols-4';
        const rowClass = rows <= 4 ? `grid-rows-${rows}` : 'grid-rows-4';
        return `${colClass} ${rowClass}`;
    };

    const getLocationId = (zoneName) => {
        const zoneLetter = zoneName.slice(-1);
        return alphabet.indexOf(zoneLetter) + 1;
    };

    const renderGroup = (groupName, items, refMap, isShelf) => {
        const gridConfig = isShelf ? shelfGridConfig : reserveGridConfig;
        const locationId = getLocationId(groupName);

        return (
            <div className="flex flex-col mb-8 ml-5 bg-zinc-800 p-4 pb-8" ref={el => refMap.current[groupName] = el}>
                <div className='flex'>
                    <div className={`${isDarkMode ? 'text-white' : 'text-black'} mr-1 text-white text-center`}>
                        {groupName}
                    </div>
                    <button
                        onClick={() => addItem(groupName, isShelf)}
                        className={`p-1 ${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white rounded-full flex items-center justify-center`}
                    >
                        <PlusIcon className="w-5 h-5" />
                    </button>
                </div>
                <div
                    className="w-full h-full mt-2 cursor-pointer"
                    onClick={() => router.push(`/pages/Location?id=${locationId}`)}
                >
                    <div className={`grid ${getGridClasses(gridConfig.rows, gridConfig.cols)} gap-2 w-full h-full border-2 border-dashed border-gray-300 p-2`}>
                        {items.map(item => (
                            <div
                                key={item.id}
                                className={`w-full h-full flex items-center justify-center ${isDarkMode ? 'bg-zinc-700 text-white' : 'bg-zinc-700 text-white'} border-2 ${isDarkMode ? 'border-zinc-500' : 'border-zinc-600'} p-1 text-sm cursor-pointer ${selectedItem && selectedItem.id === item.id && 'bg-green-500'}`}
                                onClick={() => handleItemClick({ id: item.id, name: item.name }, groupName, isShelf)}
                            >
                                {item.name}
                            </div>
                        ))}
                        {Array.from({ length: gridConfig.rows * gridConfig.cols - items.length }, (_, index) => (
                            <div key={`empty-${index}`} className="w-full h-full flex items-center justify-center border border-dashed border-gray-300">
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const renderReservesGroup = () => {
        return (
            <div className="mt-2 grid ">
                <div className={`grid grid-cols-1 gap-4`}>
                    {Object.keys(reserves).map(reserveName =>
                        renderGroup(reserveName, reserves[reserveName], reserveRefs, false)
                    )}
                </div>
            </div>
        );
    };


    return (
        <div className={`${isDarkMode ? 'bg-zinc-900' : 'bg-white'} min-h-screen flex`}>
            <div className='w-2/3'>
                <div className="relative flex flex-col">
                    <div className='flex items-center justify-between w-full mt-6 mb-4'>
                        <button onClick={() => router.push('/pages/Main')}
                            className={`p-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} text-white rounded-full ml-8 flex items-center justify-center`}
                        >
                            <ArrowLeftIcon className="w-6 h-6" />
                        </button>
                        <h1 className={`${isDarkMode ? 'text-white' : 'text-black'} text-center text-2xl font-bold flex-grow}`}>
                            {`Warehouse ${warehouseId}`}
                        </h1>
                        <div className='flex items-center'>
                            <input
                                type="number"
                                value={shelfGridConfig.rows}
                                onChange={(e) => setShelfGridConfig({ ...shelfGridConfig, rows: parseInt(e.target.value) })}
                                placeholder="Rows"
                                className={`p-1 w-10 border ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'} rounded mr-2`}
                                min={1}
                            />
                            <input
                                type="number"
                                value={shelfGridConfig.cols}
                                onChange={(e) => setShelfGridConfig({ ...shelfGridConfig, cols: Math.min(6, parseInt(e.target.value)) })}
                                placeholder="Cols"
                                className={`p-1 w-10 border ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'} rounded mr-2`}
                                min={1}
                                max={6}
                            />
                            <button
                                onClick={addGroup}
                                className={`p-2 ${isDarkMode ? 'bg-green-600' : 'bg-green-500'} text-white rounded-full flex items-center justify-center`}
                            >
                                <PlusCircleIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                    <div className="mt-2">
                        <div className={`grid grid-cols-1 gap-4`}>
                            {Object.keys(shelves).map(shelfName => renderGroup(shelfName, shelves[shelfName], shelfRefs, true))}
                        </div>
                    </div>
                </div>
            </div>

            <div className='w-1/3'>
                <div className='items-center relative flex flex-col'>
                    <div className='flex items-center justify-between w-full mt-6 mb-2'>
                        <h1 className={`${isDarkMode ? 'text-white' : 'text-black'} text-center mx-auto text-2xl font-bold flex-grow}`}>Dock</h1>
                        <input
                            type="number"
                            value={reserveGridConfig.rows}
                            onChange={(e) => setReserveGridConfig({ ...reserveGridConfig, rows: parseInt(e.target.value) })}
                            placeholder="Rows"
                            className={`p-1 w-10 border ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'} rounded mr-2`}
                            min={1}
                        />
                        <input
                            type="number"
                            value={reserveGridConfig.cols}
                            onChange={(e) => setReserveGridConfig({ ...reserveGridConfig, cols: parseInt(e.target.value) })}
                            placeholder="Cols"
                            className={`p-1 w-10 border ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'} rounded mr-2`}
                            min={1}
                        />
                    </div>
                    <div className='mt-3.5'>
                        {renderReservesGroup()}
                    </div>
                </div>
            </div>
        </div>
    );
}