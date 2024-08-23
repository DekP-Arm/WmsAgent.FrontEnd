"use client";
import React, { use, useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'

import { useTheme } from '~/app/_context/Theme';
import { useRouter } from 'next/navigation';  // Correct useRouter for app directory
import { set } from 'zod';

export default function Main() {
    const Swal = require('sweetalert2');

    
    const { isDarkMode } = useTheme();
    const [warehouses, setWarehouses] = useState<Array<{ id: number; name: string; isEditing: boolean }>>([]);
    const router = useRouter();

    const [wareHousesData, setWareHousesData] = useState<{ warehouseId: number; warehouseName: string; isEditing: boolean; tenantId: number }[]>([]);

    const fetchGetData = async () => {
        try {
            const response = await axios.get('http://localhost:5012/api/Warehouse/GetAllWarehouses');
            const dataWithIsEditing = response.data.map((wh: { warehouseId: number; warehouseName: string; tenantId: number }) => ({
                ...wh,
                isEditing: false
            }));
            setWareHousesData(dataWithIsEditing);
            console.log(dataWithIsEditing);
        } catch (e) {
            console.error(e);
            setWareHousesData([]); 
        }
    }
    const fetchUpdateData = async (warehouseId : number , newWarehouseName: string ,newTenantId : number) => {
        try{
            const response = await axios.put('http://localhost:5012/api/Warehouse/UpdateWarehouse', {warehouseId , newWarehouseName , newTenantId});
        }catch(e){
            console.error(e);
        }
    };

    const fetchAddData = async (warehouseName : string , tenantId : number) => {
        try{
            const response = await axios.post('http://localhost:5012/api/Warehouse/AddWarehouse', {warehouseName , tenantId});
        }catch(e){
            console.error(e)
        }
    }

    const fetchDeleteData = async (warehouseId: number) => {
        try {
            const response = await axios.delete(`http://localhost:5012/api/Warehouse/DeleteWarehouse`, {
                data: { warehouseId },
                headers: {
                    'Content-Type': 'application/json' // Ensure correct content type
                }
            });
            console.log(response.data);
        } catch (e) {
            console.error('Error deleting warehouse:', e);
        }
    };
    

    const toggleEdit = async (warehouseId: number, warehouseName: string, tenantId: number) => {
        try {
            console.log(warehouseId,tenantId);
            const { value: newWarehouseName, isConfirmed } = await Swal.fire({
                title: 'Update Warehouse',
                input: 'text',
                inputPlaceholder: warehouseName,
                showCancelButton: true,
                inputValidator: (value: string) => {
                    if (!value) {
                        return 'Name is required';
                    }
                }
            });
    
            console.log(newWarehouseName);
    
            if (isConfirmed && newWarehouseName) {
                await fetchUpdateData(warehouseId, newWarehouseName, tenantId);
    
                setWareHousesData(wareHousesData?.map(wh =>
                    wh.warehouseId === warehouseId ? { ...wh, warehouseName: newWarehouseName } : wh
                ));
            }
        } catch (e) {
            console.error("Error updating warehouse name: ", e);
        }
    };

    const updateWarehouseName = async (warehouseId : number, name : string , tenantId : number) => {
        setWareHousesData(wareHousesData?.map(wh =>
            wh.warehouseId === warehouseId ? { ...wh, name: name } : wh
        ));
        
    };

    const addWarehouse = async () => {
        try{
            const { value, isConfirmed } = await Swal.fire({
                title: 'Add Warehouse',
                html: `
                    <input id="swal-input-name" type="text" class="swal2-input" placeholder="Warehouse Name">
                    <input id="swal-input-tenant" type="number" class="swal2-input" placeholder="Tenant ID">
                `,
                focusConfirm: true,
                showCancelButton: true,
                confirmButtonText: 'Add',
                cancelButtonText: 'Cancel',
                preConfirm: () => {
                    const name = (document.getElementById('swal-input-name') as HTMLInputElement).value;
                    const tenantId = (document.getElementById('swal-input-tenant') as HTMLInputElement).value;
                    
                    if (!name || !tenantId) {
                        Swal.showValidationMessage('Both fields are required');
                        return false;
                    }
                    
                    return { name, tenantId };
                }
            });
            if (isConfirmed && value) {
                await fetchAddData(value.name,parseInt(value.tenantId));
                
                // const name: string = value.name;
                // const tenantId: number = parseInt(value.tenantId);
                // console.log(typeof(tenantId));
                
                // const response = await axios.post('http://localhost:5012/api/Warehouse/AddWarehouse', {warehouseName : name, tenetId : tenantId});
                // console.log(response);
                await fetchGetData();
            }
        }catch(e){
            console.error("Error adding warehouse: ",e);
        }
    };

    const toggleDelete = async (warehouseId : number) => {
        console.log(warehouseId);
        try{
            const { isConfirmed } = await Swal.fire({
                title: 'Delete Warehouse',
                text: 'Are you sure you want to delete this warehouse?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Delete',
                cancelButtonText: 'Cancel'
            });
            if (isConfirmed) {
                console.log(warehouseId);
    
                // Second confirmation dialog
                const { isConfirmed: isDoubleConfirmed } = await Swal.fire({
                    title: 'Are you absolutely sure?',
                    text: 'This action cannot be undone. Do you still want to delete this warehouse?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, Delete',
                    cancelButtonText: 'Cancel',
                });
    
                if (isDoubleConfirmed) {
                    console.log(warehouseId);
                    await fetchDeleteData(warehouseId); // Make sure to await this
                    await fetchGetData(); // Refresh data after deletion
                }
                
            }
        }catch(e){
            console.error("Error deleting warehouse: ",e);
        }
    }



    const navigate = (id : number) => {
        // router.push(`/pages//Warehouse?id=${id}`);
        router.push(`/pages/Location?id=${id}`);
    }
    // const navigateToWarehouse = (id) => {
    //     router.push(`/pages/main?id=${id}`);
    // };

    useEffect(() => {
        fetchGetData();
    },[]);


    return (
        <div className={`${isDarkMode ? 'bg-zinc-900' : 'bg-white'} min-h-screen h-full relative`}>
            <div className='grid grid-cols-4 p-4 gap-4 '>
                {wareHousesData.map((wh) => (
                    <div key={`${wh.warehouseId}`} className='relative'>

                        <a href="#" onClick={(e) => {
                            e.preventDefault(); // Prevent default anchor behavior
                            navigate(wh.warehouseId);
                            }}
                            className='block py-3 px-5 bg-zinc-700 text-white text-xl cursor-pointer'
                        >
                            {wh.isEditing ? (
                                <input
                                    type="text"
                                    value={wh.warehouseName}
                                    onChange={(e) => updateWarehouseName(wh.warehouseId, e.target.value ,wh.tenantId)}
                                    onBlur={() => updateWarehouseName(wh.warehouseId, wh.warehouseName ,wh.tenantId)}
                                    className='text-black w-full'
                                    autoFocus
                                />
                            ) : (
                                <div>{wh.warehouseName}</div>
                            )}
                        </a>
                        <button
                            className="absolute top-1 right-2"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent the navigation when clicking the icon
                                toggleEdit(wh.warehouseId,wh.warehouseName,wh.tenantId);
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487l3.65 3.65m-.53 1.943l-7.82 7.82-4.285.713.714-4.285 7.82-7.82m2.12-2.121l2.12-2.12m-2.12 2.12l2.121 2.121" />
                            </svg>
                        </button>
                        <button className="absolute bottom-1 right-2"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleDelete(wh.warehouseId);
                                }}
                        
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </button>
                    </div>
                    
                ))}
                  {/* {warehouses.map(wh => (
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
                ))}  */}
                    <button onClick={() => addWarehouse()} className='py-3 px-5 bg-gray-300 text-white text-xl flex items-center justify-center'>
                         Add Warehouse
                    </button>

                 </div>
             </div>
    );
}