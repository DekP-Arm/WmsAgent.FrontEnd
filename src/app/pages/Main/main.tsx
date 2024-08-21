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

    const [wareHousesData, setWareHousesData] = useState<{ warehouseId: number; warehouseName: string; isEditing: boolean; tenetId: number }[]>([]);

    const fetchGetData = async () => {
        try {
            const response = await axios.get('http://localhost:5012/api/Warehouse/GetAllWarehouses');
            const dataWithIsEditing = response.data.map((wh: { warehouseId: number; warehouseName: string; tenetId: number }) => ({
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
    const fetchUpdateData = async (warehouseNameOld : string , warehouseNameNew: string ,tenetId : number) => {
        try{
            const response = await axios.put('http://localhost:5012/api/Warehouse/UpdateWarehouse', {warehouseNameOld , warehouseNameNew , tenetId})
        }catch(e){
            console.error(e);
        }
    };

    const fetchAddData = async (warehouseName : string , tenetId : number) => {
        try{
            const response = await axios.post('http://localhost:5012/api/Warehouse/AddWarehouse', {warehouseName , tenetId})
        }catch(e){
            console.error(e)
        }
    }

    const toggleEdit = async (warehouseId : number,warehouseName : string , tenetId : number) => {
        try{
            const { newWarehouseName, isConfirmed } = Swal.fire({
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
            
            if (isConfirmed && newWarehouseName) {
                
                await fetchUpdateData(warehouseName, newWarehouseName, tenetId);
    
                setWareHousesData(wareHousesData?.map(wh =>
                    wh.warehouseId === warehouseId ? { ...wh, name: newWarehouseName } : wh
                ));


            }
        }catch(e){
            console.error("Error updating warehouse name: ",e);
        }
    };

    const updateWarehouseName = async (warehouseId : number, name : string , tenetId : number) => {
        setWareHousesData(wareHousesData?.map(wh =>
            wh.warehouseId === warehouseId ? { ...wh, name: name } : wh
        ));
        
    };

    // const getNextWarehouseName = () => {
    //     return `Warehouse ${alphabet[warehouses.length]}`;
    // };

    // const addWarehouse = () => {
    //     const newWarehouseName = ;
    //     setWarehouses([
    //         ...wareHousesData,
    //         { warehouseId: wareHousesData.length + 1, warehouseName: newWarehouseName, tenetId : ,isEditing: false }
    //     ]);
    // };



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

    const navigate = (id : number) => {
        router.push(`/pages/Warehouse?id=${id}`);
    }
    // const navigateToWarehouse = (id) => {
    //     router.push(`/pages/main?id=${id}`);
    // };

    useEffect(() => {
        fetchGetData();
    },[]);


    return (
        <div className={`${isDarkMode ? 'bg-zinc-900' : 'bg-white'} min-h-screen h-full relative`}>
            <div className='grid grid-cols-4 p-4 gap-4 mt-6'>
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
                                    onChange={(e) => updateWarehouseName(wh.warehouseId, e.target.value ,wh.tenetId)}
                                    onBlur={() => updateWarehouseName(wh.warehouseId, wh.warehouseName ,wh.tenetId)}
                                    className='text-black w-full'
                                    autoFocus
                                />
                            ) : (
                                <div>{wh.warehouseName}</div>
                            )}
                        </a>
                        <button
                            className="absolute top-2 right-2"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent the navigation when clicking the icon
                                toggleEdit(wh.warehouseId,wh.warehouseName,wh.tenetId);
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487l3.65 3.65m-.53 1.943l-7.82 7.82-4.285.713.714-4.285 7.82-7.82m2.12-2.121l2.12-2.12m-2.12 2.12l2.121 2.121" />
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
