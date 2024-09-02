"use client";
import { useTheme } from '~/app/_context/Theme';
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { PlusCircleIcon, PlusIcon, ArrowLeftIcon, MinusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import axios from 'axios'; // Ensure axios is installed
import { group } from 'console';

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
        const warehouseId = getWarehouseIdFromUrl(); 
        fetchDataLocation(warehouseId);
    }, [router]);  // Include router if it impacts fetching
    

    // const fetchDataLocation = async (warehouseId: number): Promise<void> => {
    //     try {
    //         const response = await fetch(`http://localhost:5012/api/Location/GetLocationByWarehouseId/${warehouseId}`);
    //         const data: LocationWarehouseIdResult[] = await response.json();
    //         const newShelves: ShelvesState = {};

    //         data.forEach((location: LocationWarehouseIdResult) => {
    //             const key = `${location.locationId}-${location.locationName}`;
    //             newShelves[key] = location.shelves.map(shelf => ({
    //                 name: shelf.name, // Ensure this matches the correct property from the data
    //                 id: shelf.id // Ensure this matches the correct property from the data
    //             }));
    //         });

    //         setShelves(newShelves);
    //         if (data.length > 0) {
    //             setWarehouseName(data[0].warehouseName);
    //         }
    //     } catch (e) {
    //         console.error(e);
    //     }
    // };

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
            console.error('Error fetching data:', e);
        }
    };
    

    const handleItemClick = (item: ShelfResult, groupName: string, isShelf: boolean) => {
        setSelectedItem({ ...item, group: groupName, isShelf });
    };


    const addItem = (groupName: string, isShelf: boolean, id: number) => {
        console.log("id",groupName);
        setActiveGroup(groupName);
        setIsShelfActive(isShelf);
        setShowLocationNameInput(true);
    };


    const deleteItem = (groupName: string, isShelf: boolean, id: number) => {
        console.log("id",groupName);
        const dockId  = groupName.split('-')[0];
        const isConfirmed = window.confirm(`คุณได้ทำการลบ dock: ${groupName}. คุณต้องการลบใช่หรือไม่?`);

        if (isConfirmed) {
            console.log(`Item with ID: ${id} ถูกลบออกจาก ${dockId}`);
            window.location.reload();
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

        //ข้อมูลในการ add location => dockid, location name, type = null ไว้ก่อน
        const DokcId = groupName.split('-')[0];
        console.log('locationId',DokcId);
        console.log('Saved location Name:', locationName);


        const gridConfig = isShelf ? shelfGridConfig : reserveGridConfig;
        if (locationName){
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
        }
        setShowLocationNameInput(false);
        setLocationName(''); 
    };

    const saveDockName = () => {

        // ขอ lasted id ของ dock มาด้วยจะ gen id ตัวล่าสุด

        // ข้อมูลในการสร้าง dock => dockname, warehouseid
        console.log('Saved Dock Name:', dockName);
        const newZoneName = dockName;
        // const lastedId = '10';
        // const newZoneName =lastedId + ' - '  +dockName;
            
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


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dockNameUpdate, setDockNameUpdate] = useState("");
    const [docknameIsupdate, setdocknameIsupdate] = useState("");

    const handleSaveUpdate = (groupName: string) => {
        
        const dockNewName = dockNameUpdate; // ชื่อใหม่ที่ต้องการแก้ไข
        const dockId = docknameIsupdate.split('-')[0]!; // ดึง dockId จากชื่อเก่า
        console.log("ชื่อใหม่ : ", dockNewName, "id เก่า : ", dockId);
        
        // ปิด modal
        setIsModalOpen(false); 
        if (!dockNewName) return; // ตรวจสอบว่ามีชื่อใหม่ที่จะอัปเดต
    
        // อัปเดต state โดยตรงเพื่อแสดงการเปลี่ยนแปลงใน UI ทันที
        setShelves((prevShelves) => {
            const newShelves = { ...prevShelves };
    
            // หา key (ชื่อเดิมของ dock) ที่ต้องการแก้ไข
            const oldDockName = Object.keys(newShelves).find(key => key.startsWith(dockId)); 
            console.log(oldDockName);
            

            if (oldDockName) {
                // กำหนดค่าใหม่ให้ dock ที่แก้ไข
                newShelves[dockNewName] = newShelves[oldDockName] ?? []; 
                delete newShelves[oldDockName]; // ลบชื่อเดิมออกจาก state
            }
    
            return newShelves; // ส่งคืน state ที่ถูกอัปเดต
        });
        setDockNameUpdate('')
      };

      const openEdit = (groupName: string) => {
        setdocknameIsupdate(groupName)
        setIsModalOpen(true);
      }


    const renderGroup = (groupName: string, items: ShelfResult[], refMap: React.RefObject<{ [key: string]: HTMLDivElement | null }>, isShelf: boolean, id: number) => {
        const gridConfig = isShelf ? shelfGridConfig : reserveGridConfig;
        const locationId = getLocationId(groupName)

        return (
            <div className="flex flex-col mb-8 ml-5 bg-zinc-800 p-4 pb-8" ref={el => (refMap.current[groupName] = el)}>
                <div className='flex items-center'>
                    <div className={`${isDarkMode ? 'text-white' : 'text-black'} mr-1 text-white text-center`}>
                        {groupName}
                    </div>
                    <button
                        onClick={() => addItem(groupName, isShelf,locationId)}
                        className={`p-1 ${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white rounded-full flex items-center justify-center`}
                    >
                        <PlusIcon className="w-5 h-5" />
                    </button>


                    <div className="flex ml-auto space-x-2"> 
                        <button
                        onClick={() => openEdit(groupName)}
                        className={`p-1 ${isDarkMode ? 'bg-yellow-600' : 'bg-yellow-500'} text-white rounded-full flex items-center justify-center`}
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487l3.65 3.65m-.53 1.943l-7.82 7.82-4.285.713.714-4.285 7.82-7.82m2.12-2.121l2.12-2.12m-2.12 2.12l2.121 2.121" />
                    </svg> 
                        </button>
                        <button
                        onClick={() => deleteItem(groupName, isShelf, locationId)}
                        className={`p-1 ${isDarkMode ? 'bg-red-600' : 'bg-red-500'} text-white rounded-full flex items-center justify-center`}
                        >
                        <MinusIcon className="w-5 h-5" />
                        </button>
                    </div>



                    {isModalOpen && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white rounded-lg shadow-lg p-6 w-80">
                                <h3 className="text-xl font-semibold mb-4">Edit Dock Name : {docknameIsupdate}</h3>
                                <input
                                type="text"
                                value={dockNameUpdate}
                                onChange={(e) => setDockNameUpdate(e.target.value)}
                                placeholder={docknameIsupdate}
                                className="w-full mb-4 px-3 py-2 border rounded"
                                />
                                <div className="flex justify-end">
                                <button
                                    onClick={() => handleSaveUpdate(groupName)}
                                    className="px-4 py-2 bg-green-500 text-white rounded mr-2 hover:bg-green-600"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Cancel
                                </button>
                                </div>
                            </div>
                            </div>
                        )}
                    
                </div>
                { activeGroup === groupName && isShelfActive === isShelf && showLocationNameInput && (
                                <div className=" ml-4">
                                    <label htmlFor="dockname" className="block text-sm font-medium text-white">
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


    return (
        <div className={`${isDarkMode ? 'bg-zinc-900' : 'bg-white'} min-h-screen flex`}>
            <div className='w-2/3 ml-10'>
                <div className="relative flex flex-col">
                    <div className='flex items-center justify-between w-full mt-6 mb-4'>
                        <h1 className={`${isDarkMode ? 'text-white' : 'text-black'} mx-auto text-center text-2xl font-bold flex-grow}`}>
                            {warehouseName}
                        </h1>
                        <div className='flex items-center'>
                            <div>
                                <input type="text" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-20 mr-2 p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Docks Name" required />
                            </div>
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
                            {Object.keys(shelves).map(shelfName => renderGroup(shelfName, shelves[shelfName], shelfRefs, true,shelfName.id))}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}