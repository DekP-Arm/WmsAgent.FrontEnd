"use client";
import React, { useState } from 'react';
import { useTheme } from '~/app/_context/Theme';
import { useRouter } from 'next/navigation';  // Correct useRouter for app directory

export default function Warehouse() {
    const { isDarkMode } = useTheme();
    const [warehouses, setWarehouses] = useState([{ id: 1, name: "Warehouse A", isEditing: false }]);
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const router = useRouter();

    const getNextWarehouseName = () => {
        return `Warehouse ${alphabet[warehouses.length]}`;
    };

    const addWarehouse = () => {
        const newWarehouseName = getNextWarehouseName();
        setWarehouses([
            ...warehouses,
            { id: warehouses.length + 1, name: newWarehouseName, isEditing: false }
        ]);
    };

    const toggleEdit = (id) => {
        setWarehouses(warehouses.map(wh => 
            wh.id === id ? { ...wh, isEditing: !wh.isEditing } : wh
        ));
    };

    const updateWarehouseName = (id, name) => {
        setWarehouses(warehouses.map(wh => 
            wh.id === id ? { ...wh, name, isEditing: false } : wh
        ));
    };

    const navigateToWarehouse = (id) => {
        router.push(`/pages/main?id=${id}`);
    };

    return (
        <div className={`${isDarkMode ? 'bg-zinc-900' : 'bg-white'} min-h-screen h-full relative`}>
            <div className='grid grid-cols-4 p-4 gap-4 mt-6'>
                {warehouses.map(wh => (
                    <div key={wh.id} className='relative'>
                        <a
                            onClick={() => navigateToWarehouse(wh.id)} 
                            className='block py-3 px-5 bg-zinc-700 text-white text-xl cursor-pointer'
                        >
                            {wh.isEditing ? (
                                <input
                                    type="text"
                                    value={wh.name}
                                    onChange={(e) => updateWarehouseName(wh.id, e.target.value)}
                                    onBlur={() => updateWarehouseName(wh.id, wh.name)}
                                    className='text-black w-full'
                                    autoFocus
                                />
                            ) : (
                                <div>{wh.name}</div>
                            )}
                        </a>
                        <button
                            className="absolute top-2 right-2"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent the navigation when clicking the icon
                                toggleEdit(wh.id);
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487l3.65 3.65m-.53 1.943l-7.82 7.82-4.285.713.714-4.285 7.82-7.82m2.12-2.121l2.12-2.12m-2.12 2.12l2.121 2.121" />
                            </svg>
                        </button>
                    </div>
                ))}
                <button onClick={addWarehouse} className='py-3 px-5 bg-gray-300 text-white text-xl flex items-center justify-center'>
                    Add Warehouse
                </button>
            </div>
        </div>
    );
}
