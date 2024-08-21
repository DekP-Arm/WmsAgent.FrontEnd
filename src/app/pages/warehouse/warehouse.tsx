import React, { useState, useEffect } from 'react';
import { useTheme } from '~/app/_context/Theme';
import { useRouter } from 'next/navigation';

export default function Warehouse() {
    const { isDarkMode } = useTheme();
    const [warehouses, setWarehouses] = useState<Array<{ id: number; name: string; isEditing: boolean }>>([]);
    const router = useRouter();

    // Function to fetch all warehouses from the API
    const fetchWarehouses = async () => {
        try {
            const response = await fetch('http://localhost:5012/api/Warehouse/GetAllWarehouses');
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }
            const data = await response.json();
            console.log('Fetched warehouses:', data); // ตรวจสอบข้อมูลที่ได้รับ
            setWarehouses(data); // ตั้งค่าข้อมูลที่ได้รับลงใน state
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchWarehouses(); // Fetch warehouses on component mount
    }, []);

    const getNextWarehouseName = () => {
        return `Warehouse Test ${warehouses.length + 1}`; // Adjust naming logic if needed
    };

    async function addWarehouseToDatabase(warehouseName: string, tenantId: number) {
        const response = await fetch('http://localhost:5012/api/Warehouse/AddWarehouse', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                warehouseName: warehouseName,
                tenantId: tenantId
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        return response.json();
    }

    const addWarehouse = async () => {
        const newWarehouseName = getNextWarehouseName();
        const tenantId = 1; // Replace with appropriate tenant ID

        try {
            const newWarehouse = await addWarehouseToDatabase(newWarehouseName, tenantId);

            if (newWarehouse) {
                setWarehouses(prevWarehouses => [
                    ...prevWarehouses,
                    { id: newWarehouse.id, name: newWarehouse.name, isEditing: false }
                ]);
            }
        } catch (error) {
            // Display a user-friendly error message
            alert(error.message);
        }
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
        router.push(`/pages/Location?id=${id}`);
    };

    return (
        <div className={`${isDarkMode ? 'bg-zinc-900' : 'bg-white'} min-h-screen h-full relative`}>
            <div className='grid grid-cols-4 p-4 gap-4 '>
                {warehouses.map(wh => (
                    <div key={wh.id} className='relative mt-6'>
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
                                <div>{wh.name}</div> // ตรวจสอบที่นี่
                            )}
                        </a>
                        <button
                            className="absolute top-2 right-2"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent the navigation when clicking the icon
                                toggleEdit(wh.id);
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487l3.65 3.65m-.53 1.943l-7.82 7.82-4.285.713.714-4.285 7.82-7.82m2.12-2.121l2.12-2.12m-2.12 2.12l2.121 2.121" />
                            </svg>
                        </button>
                    </div>
                ))}
                <button onClick={addWarehouse} className={`${isDarkMode ? 'text-gray-600 border-gray-600 hover:bg-zinc-800 duration-300' : 'text-gray-400 border-gray-400 hover:bg-zinc-200 duration-300'} mt-6 py-3 px-5 text-xl flex items-center justify-center border-2 border-dashed`}>
                    Add Warehouse
                </button>

            </div>
        </div>
    );
}
