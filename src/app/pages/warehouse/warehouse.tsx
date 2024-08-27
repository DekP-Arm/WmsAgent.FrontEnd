"use client";
import { useTheme } from '~/app/_context/Theme';
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { PlusCircleIcon, PlusIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import axios from 'axios'; // Ensure axios is installed

export function Warehouse() {

    interface ShelvesState {
        [locationName: string]: ShelfResult[];
    }

    interface ShelfResult {
        id: number;
        name: string | null;
    }

    interface LocationWarehouseIdResult {
        locationId: number;
        locationName: string;
        locationType: string;
        warehouseId: number;
        warehouseName: string;
        shelves: ShelfResult[];
    }

    interface SelectedItem {
        id: number;
        name: string | null;
        group: string;
        isShelf: boolean;
    }

    interface GridConfig {
        rows: number;
        cols: number;
    }

    const [warehouseName, setWarehouseName] = useState('');
    // const [shelves, setShelves] = useState<ShelvesState>({});

    const { isDarkMode } = useTheme();
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const router = useRouter();
    const [showDockNameInput, setShowDockNameInput] = useState(false);
    const [showLocationNameInput, setShowLocationNameInput] = useState(false);
    const [dockName, setDockName] = useState('');
    const [locationName, setLocationName] = useState('');

    const [shelves, setShelves] = useState<ShelvesState>({});
    const [reserves, setReserves] = useState<{ [key: string]: ShelfResult[] }>({
        DockA: [{ id: 1, name: 'AA' }, { id: 2, name: 'AB' }],

    });

    const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);

    const [shelfGridConfig, setShelfGridConfig] = useState<GridConfig>({ rows: 4, cols: 2 });
    const [reserveGridConfig, setReserveGridConfig] = useState<GridConfig>({ rows: 4, cols: 2 });
    const shelfRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const reserveRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const [activeGroup, setActiveGroup] = useState<string | null>(null);
    const [isShelfActive, setIsShelfActive] = useState<boolean | null>(null);

    const getWarehouseIdFromUrl = () => {
        const params = new URLSearchParams(location.search);
        return Number(params.get('id')); // ดึงค่าของพารามิเตอร์ id และแปลงเป็นตัวเลข
    };

    useEffect(() => {
        const warehouseId = getWarehouseIdFromUrl(); // ดึง warehouseId จาก URL
        fetchDataLocation(warehouseId);
    }, []);

    const fetchDataLocation = async (warehouseId: number): Promise<void> => {
        try {
            const response = await fetch(`http://localhost:5012/api/Location/GetLocationByWarehouseId/${warehouseId}`);
            const data: LocationWarehouseIdResult[] = await response.json();
            const newShelves: ShelvesState = {};
            console.log(data);
            
            data.forEach((location: LocationWarehouseIdResult) => {
                const key = `${location.locationId}-${location.locationName}`;
                newShelves[key] = location.shelves.map(shelf => ({
                    name: shelf.shelfName, // Ensure this matches the correct property from the data
                    id: shelf.shelfId
                    // Ensure this matches the correct property from the data
                }));
            });

            setShelves(newShelves);
            if (data.length > 0) {
                setWarehouseName(data[0].warehouseName);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleItemClick = (item: ShelfResult, groupName: string, isShelf: boolean) => {
        setSelectedItem({ ...item, group: groupName, isShelf });
    };


    const addItem = (groupName: string, isShelf: boolean) => {
        console.log(groupName);
        setActiveGroup(groupName);
        setIsShelfActive(isShelf);
        setShowLocationNameInput(true);
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
        setShowDockNameInput(true);
    };

    const getGridClasses = (rows: number, cols: number): string => {
        const colClass = cols === 3 ? `grid-cols-${cols}` : 'grid-cols-4';
        const rowClass = rows <= 4 ? `grid-rows-${rows}` : 'grid-rows-4';
        return `${colClass} ${rowClass}`;
    };


    const getLocationId = (zoneName) => {
        const zoneLetter = zoneName.slice(-1);
        return alphabet.indexOf(zoneLetter) + 1;
    };

    const saveLocationName = (groupName: string, isShelf: boolean) => {
        console.log('Saved Dock Name:', locationName);
        const gridConfig = isShelf ? shelfGridConfig : reserveGridConfig;
            setShelves(prevShelves => {
                const newShelves = [...(prevShelves[groupName] || [])]; // Ensure type safety here
                const maxItems = gridConfig.rows * gridConfig.cols;
                if (newShelves.length < maxItems) {
                    const newId = newShelves.length + 1;
                    const newShelf: ShelfResult = { id: newId, name: locationName };
                    newShelves.push(newShelf);
                }
                return { ...prevShelves, [groupName]: newShelves };
            });
        setShowDockNameInput(false); 
        setLocationName(''); 
    };

    const saveDockName = () => {
        console.log('Saved Dock Name:', dockName);
        const newZoneName = dockName;

        if (newZoneName){
            setShelves(prevShelves => ({
                ...prevShelves,
                [newZoneName]: []
            }));
        }
        setShowDockNameInput(false); 
        setDockName(''); 
    };

    const CloseDockName = () => {
        setActiveGroup(null);
        setIsShelfActive(null);
        setShowLocationNameInput(false);
        setShowDockNameInput(false); 
        setDockName('');
    };


    const renderGroup = (groupName: string, items: ShelfResult[], refMap: React.RefObject<{ [key: string]: HTMLDivElement | null }>, isShelf: boolean) => {
        const gridConfig = isShelf ? shelfGridConfig : reserveGridConfig;
        const locationId = getLocationId(groupName)

        return (
            <div className="flex flex-col mb-8 ml-5 bg-zinc-800 p-4 pb-8" ref={el => (refMap.current[groupName] = el)}>
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
                { activeGroup === groupName && isShelfActive === isShelf && showLocationNameInput && (
                                <div className=" ml-4">
                                    <label htmlFor="dockname" className="block text-sm font-medium text-gray-700">
                                        Location Name
                                    </label>
                                    <input
                                        type="text"
                                        id="dockname"
                                        name="dockname"
                                        value={locationName}
                                        onChange={(e) => setLocationName(e.target.value)}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                        placeholder="Enter dock name"
                                    />
                                    <div className='flex'>
                                    <button
                                        onClick={() => saveLocationName(groupName,isShelf)}
                                        className={`p-2 m-2 ${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white rounded-full flex items-center justify-center`}
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={CloseDockName}
                                        className={`p-2 m-2 ${isDarkMode ? 'bg-red-600' : 'bg-red-500'} text-white rounded-full flex items-center justify-center`}
                                    >
                                        Close
                                    </button>
                                    </div>
                                </div>
                            )}
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
            <div className='w-2/3 ml-10'>
                <div className="relative flex flex-col">
                    <div className='flex items-center justify-between w-full mt-6 mb-4'>
                        <h1 className={`${isDarkMode ? 'text-white' : 'text-black'} mx-auto text-center text-2xl font-bold flex-grow}`}>
                            {warehouseName}
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
                            {showDockNameInput && (
                                <div className=" ml-4">
                                    <label htmlFor="dockname" className="block text-sm font-medium text-gray-700">
                                        Dock Name
                                    </label>
                                    <input
                                        type="text"
                                        id="dockname"
                                        name="dockname"
                                        value={dockName}
                                        onChange={(e) => setDockName(e.target.value)}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                        placeholder="Enter dock name"
                                    />
                                    <div className='flex'>
                                    <button
                                        onClick={saveDockName}
                                        className={`p-2 m-2 ${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white rounded-full flex items-center justify-center`}
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={CloseDockName}
                                        className={`p-2 m-2 ${isDarkMode ? 'bg-red-600' : 'bg-red-500'} text-white rounded-full flex items-center justify-center`}
                                    >
                                        Close
                                    </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>  
                    <div className="mt-2">
                        <div className={`grid grid-cols-1 gap-4`}>
                            {Object.keys(shelves).map(shelfName => renderGroup(shelfName, shelves[shelfName], shelfRefs, true))}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}