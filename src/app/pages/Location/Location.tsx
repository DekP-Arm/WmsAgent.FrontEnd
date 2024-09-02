"use client";
import { useRouter } from 'next/navigation';
import { useTheme } from '~/app/_context/Theme';
import { useState } from "react";
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { Popup } from 'src/app/_components/Popup';

// Define types for shelves and reserves
interface Shelf {
    id: number;
    name: string;
    typeId: number;  // Shelf Type ID reference
    palettes?: Palette[];
}

interface ShelfType {
    id: number;
    name: string;
}

interface Palette {
    id: number;
    name: string;
}

interface PopupContent extends Palette {
    group: number;
}

export function Location() {
    const { isDarkMode } = useTheme();
    const router = useRouter();
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const [popupContent, setPopupContent] = useState<PopupContent | null>(null);

    // Mock Data
    const [shelves, setShelves] = useState<Shelf[]>([
        { id: 1, name: 'Shelf 1', typeId: 1 },
        { id: 2, name: 'Shelf 2', typeId: 1 },
        { id: 1, name: 'Shelf 1', typeId: 2 },
        { id: 2, name: 'Shelf 2', typeId: 2 },
        { id: 1, name: 'Shelf 1', typeId: 3 },
        { id: 2, name: 'Shelf 2', typeId: 3 }
    ]);

    const [shelfTypes, setShelfTypes] = useState<ShelfType[]>([
        { id: 1, name: 'Food' },
        { id: 2, name: 'Drink' },
        { id: 3, name: 'Kitchen' }
    ]);

    const [reserves, setReserves] = useState<Palette[]>([
        { id: 1, name: 'Palette 1' },
        { id: 2, name: 'Palette 2' },
        { id: 3, name: 'Palette 3' }
    ]);

    const [selectedItem, setSelectedItem] = useState<Shelf | Palette | null>(null);
    const [selectedShelf, setSelectedShelf] = useState<number | null>(null);
    const [newShelfTypeName, setNewShelfTypeName] = useState<string>('');  // New shelf type name input

    const handleItemClick = (item: Shelf | Palette, isShelf: boolean) => {
        if (isShelf) {
            router.push(`/pages/Shelf?shelfTypeId=${item.typeId}&shelfId=${item.id}`);
        } else {
            setPopupContent({ ...item as Palette, group: 0 });
            setIsPopupOpen(true);
        }
    };

    const handleShelfClickInPopup = (shelfId: number) => {
        setSelectedShelf(shelfId);
    };

    const addShelfType = () => {
        if (!newShelfTypeName) {
            alert("Please enter a name for the new shelf type.");
            return;
        }

        const newTypeId = shelfTypes.length + 1;
        const newShelfType: ShelfType = { id: newTypeId, name: newShelfTypeName };
        setShelfTypes(prevShelfTypes => [...prevShelfTypes, newShelfType]);
        setNewShelfTypeName('');  // Clear input field after adding
    };

    const addShelfToType = (typeId: number) => {
        const newShelfId = shelves.filter(shelf => shelf.typeId === typeId).length + 1;
        const newShelf: Shelf = { id: newShelfId, name: `Shelf ${newShelfId}`, typeId };
        setShelves(prevShelves => [...prevShelves, newShelf]);
    };

    const addReserve = () => {
        const newId = reserves.length + 1;
        const newReserve: Palette = { id: newId, name: `Palette ${newId}` };
        setReserves(prevReserves => [...prevReserves, newReserve]);
    };

    const handleMovePalette = () => {
        if (!selectedShelf || !popupContent) return;

        setShelves(prevShelves => {
            const updatedShelves = [...prevShelves];
            const targetShelf = updatedShelves.find(shelf => shelf.id === selectedShelf);
            if (!targetShelf) return updatedShelves;

            targetShelf.palettes = targetShelf.palettes || [];
            targetShelf.palettes.push(popupContent);

            return updatedShelves;
        });

        setReserves(prevReserves => prevReserves.filter(palette => palette.id !== popupContent.id));

        setIsPopupOpen(false);
        setPopupContent(null);
        setSelectedShelf(null);
    };

    const renderShelvesByType = () => {
        return shelfTypes.map(type => {
            const shelvesForType = shelves.filter(shelf => shelf.typeId === type.id);

            return (
                <div key={type.id} className="mb-4">
                    <div className='flex mb-1'>
                        <h2 className={`${isDarkMode ? 'text-white' : 'text-black'} text-lg font-semibold mx-2 mt-0.5`}>{type.name} Shelves</h2>
                        <button
                            onClick={() => addShelfToType(type.id)}
                            className={`${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white p-1 rounded-full flex items-center justify-center`}
                        >
                            <PlusCircleIcon className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="grid grid-cols-12 gap-2">
                        {shelvesForType.map(shelf => (
                            <div
                                key={shelf.id}
                                className={`w-full h-8 flex items-center justify-center px-2 ${isDarkMode ? 'bg-zinc-700 text-white' : 'bg-zinc-700 text-white'} border-2 ${isDarkMode ? 'border-zinc-500' : 'border-zinc-600'} p-1 text-sm cursor-pointer ${selectedItem && selectedItem.id === shelf.id ? 'bg-green-500' : ''} ${selectedShelf === shelf.id && 'bg-blue-500'}`}
                                onClick={() => handleItemClick(shelf, true)}
                            >
                                {shelf.name}
                            </div>
                        ))}
                    </div>
                    {/* Button to add a new shelf inside this shelf type */}
                </div>
            );
        });
    };

    const renderReserves = () => {
        return reserves.map(palette => (
            <div
                key={palette.id}
                className={`w-full h-full flex items-center justify-center ${isDarkMode ? 'bg-zinc-700 text-white' : 'bg-zinc-700 text-white'} border-2 ${isDarkMode ? 'border-zinc-500' : 'border-zinc-600'} p-1 text-sm cursor-pointer ${selectedItem && selectedItem.id === palette.id ? 'bg-green-500' : ''}`}
                onClick={() => handleItemClick(palette, false)}
            >
                {palette.name}
            </div>
        ));
    };

    return (
        <div className={`p-4 flex gap-x-4 ${isDarkMode ? 'bg-zinc-900 text-white' : 'bg-white text-black'} min-h-screen h-full`}>
            <div className='w-full'>
                <div className='flex justify-between mb-4 mt-1'>
                    <div></div>
                    <h1 className="text-2xl font-bold">Shelves</h1>
                    <div className='flex items-center'>
                        <input
                            type="text"
                            value={newShelfTypeName}
                            onChange={(e) => setNewShelfTypeName(e.target.value)}
                            placeholder="Type Name"
                            className={`p-1 w-32 border ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'} rounded mr-2`}
                        />
                        <button
                            onClick={addShelfType}
                            className={`${isDarkMode ? 'bg-green-600' : 'bg-green-500'} text-white p-1 rounded-full`}
                        >
                            <PlusCircleIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                {renderShelvesByType()}
            </div>
            <div className=" w-1/4 items-center">
                <div className='flex mb-1 justify-between mb-4 mt-1'>
                    <div></div>
                    <h1 className="text-2xl font-bold mx-2">Dock</h1>
                    <button
                        onClick={addReserve}
                        className={`${isDarkMode ? 'bg-green-600' : 'bg-green-500'} text-white p-1 rounded-full flex items-center justify-center`}
                    >
                        <PlusCircleIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {renderReserves()}
                </div>
            </div>
            <Popup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                content={popupContent}
                selectedShelf={selectedShelf}
                onSelectShelf={handleShelfClickInPopup}
                onMovePalette={handleMovePalette}
                shelves={shelves}
                shelfTypes={shelfTypes}
            />
        </div>
    );
}
