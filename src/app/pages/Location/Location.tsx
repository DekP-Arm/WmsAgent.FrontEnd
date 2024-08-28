"use client";
import { useRouter } from 'next/navigation';
import { useTheme } from '~/app/_context/Theme';
import { useState, useRef, ChangeEvent } from "react";
import { PlusCircleIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Popup } from 'src/app/_components/Popup';

// Define types for shelves and reserves
interface Shelf {
    id: number;
    name: string;
    groupId: number;
    palettes?: Palette[];
}

interface Palette {
    id: number;
    name: string;
}

interface GridConfig {
    rows: number;
    cols: number;
}

interface PopupContent extends Palette {
    group: number;
}

export function Location() {
    const { isDarkMode } = useTheme();
    const router = useRouter();
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const [popupContent, setPopupContent] = useState<PopupContent | null>(null);
    const [rows, setRows] = useState<number[]>([1]);


    const [shelves, setShelves] = useState<Record<number, Shelf[]>>({
        1: [{ id: 1, name: 'Shelf 1', groupId: 1 }, { id: 2, name: 'Shelf 2', groupId: 1 }],
        2: [{ id: 1, name: 'Shelf 1', groupId: 2 }, { id: 2, name: 'Shelf 2', groupId: 2 }]
    });
    const [reserves, setReserves] = useState<Record<number, Palette[]>>({
        1: [{ id: 1, name: 'Palette 1' }, { id: 2, name: 'Palette 2' }],
    });

    const [selectedItem, setSelectedItem] = useState<Shelf | Palette | null>(null);
    const [shelfGridConfig, setShelfGridConfig] = useState<GridConfig>({ rows: 4, cols: 2 });
    const [reserveGridConfig, setReserveGridConfig] = useState<GridConfig>({ rows: 4, cols: 2 });
    const [selectedShelf, setSelectedShelf] = useState<{ groupId: number; id: number } | null>(null);
    const shelfRefs = useRef<Record<number, HTMLDivElement | null>>({});
    const reserveRefs = useRef<Record<number, HTMLDivElement | null>>({});

    const handleItemClick = (item: Shelf | Palette, groupId: number, isShelf: boolean) => {
        if (isShelf) {
            router.push(`/pages/Shelf?groupId=${groupId}&shelfId=${item.id}`);
        } else {
            setPopupContent({ ...item as Palette, group: groupId });
            setIsPopupOpen(true);
        }
    };

    const handleShelfClickInPopup = (groupId: number, shelf: Shelf) => {
        setSelectedShelf({ groupId, id: shelf.id });
    };

    const generateNextRowId = (): number => {
        const lastRowId = rows.length > 0 ? Math.max(...rows) : 0;
        return lastRowId + 1;
    };

    const addRow = () => {
        setRows(prevRows => [...prevRows, generateNextRowId()]);
    };

    const addItem = (groupId: number, isShelf: boolean) => {
        if (isShelf) {
            setShelves(prevShelves => {
                const newShelves = [...(prevShelves[groupId] || [])];
                const newId = newShelves.length + 1;
                const newShelf: Shelf = { id: newId, name: `Shelf ${newId}`, groupId };
                newShelves.push(newShelf);

                return { ...prevShelves, [groupId]: newShelves };
            });
        } else {
            setReserves(prevReserves => {
                const newReserves = [...(prevReserves[groupId] || [])];
                const newId = newReserves.length + 1;
                const newReserve: Palette = { id: newId, name: `Palette ${newId}` };
                newReserves.push(newReserve);

                return { ...prevReserves, [groupId]: newReserves };
            });
        }
    };


    const generateNextGroupId = (isShelf: boolean): number => {
        const existingGroups = Object.keys(isShelf ? shelves : reserves).map(Number);
        const lastGroup = Math.max(...existingGroups, 0);
        return lastGroup + 1;
    };

    const addGroup = (isShelf: boolean) => {
        const newGroupName = generateNextGroupId(isShelf);
        if (isShelf) {
            setShelves(prevShelves => ({
                ...prevShelves,
                [newGroupName]: [{ id: 1, name: 'Shelf 1', groupId: newGroupName }]
            }));
        } else {
            setReserves(prevReserves => ({
                ...prevReserves,
                [newGroupName]: [{ id: 1, name: 'Palette 1' }]
            }));
        }
    };

    const getGridClasses = (rows: number, cols: number): string => {
        return `grid grid-cols-${cols} grid-rows-${rows} gap-2`;
    };

    const handleMovePalette = () => {
        if (!selectedShelf || !popupContent) return;

        const { groupId, id } = selectedShelf;

        setShelves(prevShelves => {
            const updatedShelves = { ...prevShelves };
            const targetShelf = updatedShelves[groupId]?.find(shelf => shelf.id === id);
            if (!targetShelf) return updatedShelves;

            targetShelf.palettes = targetShelf.palettes || [];
            targetShelf.palettes.push(popupContent);

            return updatedShelves;
        });

        setReserves(prevReserves => {
            const updatedReserves = { ...prevReserves };
            if (popupContent?.group in updatedReserves) {
                updatedReserves[popupContent.group] = updatedReserves[popupContent.group].filter(palette => palette.id !== popupContent.id);
            }
            return updatedReserves;
        });

        setIsPopupOpen(false);
        setPopupContent(null);
        setSelectedShelf(null);
    };

    const renderShelvesGroup = () => {
        return Object.keys(shelves).map(groupId => {
            const groupIdNumber = Number(groupId);
            const items = shelves[groupIdNumber] || [];

            return (
                <div
                    key={groupIdNumber}
                    className="flex flex-col items-center mb-8 w-28"
                    ref={(el) => { if (el) shelfRefs.current[groupIdNumber] = el; }}
                >
                    <div className='flex'>
                        <div className={`${isDarkMode ? 'text-white' : 'text-black'} mt-2 mr-1 text-center`}>
                            Row {groupIdNumber}
                        </div>
                        {/* I want this below button click to add more rows of group */}
                        <button
                            onClick={() => addItem(groupIdNumber, true)}
                            className={`my-2 p-0.5 ${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white rounded-full flex items-center justify-center`}
                        >
                            <PlusIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="w-full bg-zinc-800">
                        <div className={`grid gap-2 w-full h-full border-2 border-dashed border-gray-300 py-2 px-3`}>
                            {items.map(item => (
                                <div
                                    key={item.id}
                                    className={`w-full h-8 flex items-center justify-center px-2 ${isDarkMode ? 'bg-zinc-700 text-white' : 'bg-zinc-700 text-white'} border-2 ${isDarkMode ? 'border-zinc-500' : 'border-zinc-600'} p-1 text-sm cursor-pointer ${selectedItem && selectedItem.id === item.id ? 'bg-green-500' : ''} ${selectedShelf && selectedShelf.id === item.id && 'bg-blue-500'}`}
                                    onClick={() => handleItemClick(item, groupIdNumber, true)}
                                >
                                    {item.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        });
    };

    const renderRowsOfGroups = () => {
        return rows.map((rowId) => (
            <div key={rowId} className={`flex mt-2 px-8 gap-x-8`}>
                <div>{rowId}</div>
                <div className='overflow-x-auto flex gap-x-8'>
                    {renderShelvesGroup(rowId)}
                </div>
                <button
                    onClick={() => addGroup(true)}
                    className={`${isDarkMode ? 'bg-zinc-600' : 'bg-zinc-500'} text-white w-8 h-8 rounded-full flex items-center mt-12 justify-center`}
                >
                    <PlusCircleIcon className="w-6 h-6" />
                </button>
            </div>

        ));
    };


    const renderReservesGroup = () => {
        return Object.keys(reserves).map(groupId => {
            const groupIdNumber = Number(groupId);
            const items = reserves[groupIdNumber] || [];
            return (
                <div key={groupIdNumber} className="flex flex-col items-center mb-8" ref={(el) => { if (el) reserveRefs.current[groupIdNumber] = el; }}>
                    <div className="w-full h-full bg-zinc-800">
                        <div className={`grid ${getGridClasses(reserveGridConfig.rows, reserveGridConfig.cols)} gap-2 w-full h-full border-2 border-dashed border-gray-300 p-2`}>
                            {items.map(item => (
                                <div
                                    key={item.id}
                                    className={`w-full h-full flex items-center justify-center ${isDarkMode ? 'bg-zinc-700 text-white' : 'bg-zinc-700 text-white'} border-2 ${isDarkMode ? 'border-zinc-500' : 'border-zinc-600'} p-1 text-sm cursor-pointer ${selectedItem && selectedItem.id === item.id ? 'bg-green-500' : ''}`}
                                    onClick={() => handleItemClick(item, groupIdNumber, false)}
                                >
                                    {item.name}
                                </div>
                            ))}
                            {Array.from({ length: reserveGridConfig.rows * reserveGridConfig.cols - items.length }, (_, index) => (
                                <div key={`empty-${index}`} className="w-full h-full flex items-center justify-center border border-dashed border-gray-300">
                                    {/* Empty slot */}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='flex'>
                        <div className={`${isDarkMode ? 'text-white' : 'text-black'} mt-2.5 mr-1 text-center`}>
                            Group Dock {groupIdNumber}
                        </div>
                        <button
                            onClick={() => addItem(groupIdNumber, false)}
                            className={`mt-2 p-1 ${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white rounded-full flex items-center justify-center`}
                        >
                            <PlusIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            );
        });
    };

    return (
        <div className={`${isDarkMode ? 'bg-zinc-900' : 'bg-white'} min-h-screen flex`}>
            <div className='w-2/3'>
                <div className=' relative flex flex-col'>
                    <div className='flex items-center justify-between w-full mt-6 mb-2'>
                        <h1 className={`${isDarkMode ? 'text-white' : 'text-black'} text-center text-2xl font-bold flex-grow`}>Zone</h1>
                        <div className='flex items-center'>
                            <input
                                type="number"
                                value={shelfGridConfig.rows}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setShelfGridConfig({ ...shelfGridConfig, rows: parseInt(e.target.value, 10) })}
                                placeholder="Rows"
                                className={`p-1 w-10 border ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'} rounded mr-2`}
                                min={1}
                            />
                            <input
                                type="number"
                                value={shelfGridConfig.cols}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setShelfGridConfig({ ...shelfGridConfig, cols: parseInt(e.target.value, 10) })}
                                placeholder="Cols"
                                className={`p-1 w-10 border ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'} rounded mr-2`}
                                min={1}
                            />
                            <button
                                onClick={addRow}
                                className={`${isDarkMode ? 'bg-green-600' : 'bg-green-500'} text-white p-2 rounded-full flex items-center justify-center`}
                            >
                                <PlusCircleIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    <div className={`overflow-x-auto mt-2 gap-x-8`}>
                        {renderRowsOfGroups()}
                    </div>
                </div>
            </div>

            <div className='w-1/3'>
                <div className='items-center relative flex flex-col'>
                    <div className='flex items-center justify-between w-full mt-6 mb-2'>
                        <h1 className={`${isDarkMode ? 'text-white' : 'text-black'} text-center text-2xl font-bold flex-grow`}>Dock</h1>
                        <div className='flex items-center'>
                            <input
                                type="number"
                                value={reserveGridConfig.rows}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setReserveGridConfig({ ...reserveGridConfig, rows: parseInt(e.target.value, 10) })}
                                placeholder="Rows"
                                className={`p-1 w-10 border ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'} rounded mr-2`}
                                min={1}
                            />
                            <input
                                type="number"
                                value={reserveGridConfig.cols}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setReserveGridConfig({ ...reserveGridConfig, cols: parseInt(e.target.value, 10) })}
                                placeholder="Cols"
                                className={`p-1 w-10 border ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'} rounded mr-2`}
                                min={1}
                            />
                        </div>
                        <button
                            onClick={() => addGroup(false)}
                            className={`p-2 ${isDarkMode ? 'bg-green-600' : 'bg-green-500'} text-white rounded-full mr-8 flex items-center justify-center`}
                        >
                            <PlusCircleIcon className="w-6 h-6" />
                        </button>
                    </div>
                    <div className='mt-2'>
                        {renderReservesGroup()}
                    </div>
                </div>
            </div>

            <Popup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                content={
                    popupContent ? (
                        <div className='w-full'>
                            <h2 className="text-lg font-bold">{popupContent.name}</h2>
                            <p>Group: {popupContent.group}</p>
                            <div className='flex items-center justify-between'>
                                <div className='flex-grow'>
                                    <p>ID: {popupContent.id}</p>
                                </div>
                                <div className='ml-4'>
                                    <input
                                        type="checkbox"
                                        id="react-option"
                                        value=""
                                        className="hidden peer"
                                        required
                                    />
                                    <label
                                        htmlFor="react-option"
                                        className="inline-flex items-center justify-between px-2 py-0.5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer 
                                        peer-checked:bg-green-400 peer-checked:border-green-500 peer-checked:text-white dark:peer-checked:bg-green-300 dark:peer-checked:text-white 
                                        hover:text-gray-600 dark:hover:text-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700
                                        before:content-['Suggestion_Off'] peer-checked:before:content-['Suggestion_On'] duration-300"
                                    >
                                    </label>
                                </div>
                            </div>

                            <div className="mt-2 overflow-y-auto h-96">
                                <div className="grid grid-cols-5 gap-x-12 gap-y-8 mt-2 px-4">
                                    {Object.keys(shelves).map(groupId => (
                                        <div key={groupId} className="mt-2">
                                            <h3 className="font-bold mb-2">Group Shelf {groupId}</h3>
                                            <div className="grid grid-cols-8 gap-2">
                                                {shelves[Number(groupId)].map(shelf => (
                                                    <div
                                                        key={shelf.id}
                                                        onClick={() => handleShelfClickInPopup(Number(groupId), shelf)}
                                                        className={`p-1 col-span-4 text-sm border rounded cursor-pointer ${selectedShelf && selectedShelf.id === shelf.id ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                                                    >
                                                        {shelf.name}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={handleMovePalette}
                                    className="bg-green-500 text-white p-2 rounded"
                                >
                                    Okay
                                </button>
                            </div>
                        </div>
                    ) : null
                }
            />
        </div>
    );
}
