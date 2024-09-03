"use client";
import { useState , useEffect } from 'react';
import { useTheme } from '~/app/_context/Theme';
import { InputLabel } from '~/app/_components/InputLabel';
import { InputDropDown } from '~/app/_components/InputDropDown';
import { TableItemOrder } from '~/app/_components/TableItemOrder';


export default function ItemOrder() {
    const [itemOrder, setItemOrder] = useState([]);
    const { isDarkMode } = useTheme();

    const [customer, setCustomer] = useState('');
    const [warehouse, setWarehouse] = useState('');
    const [date, setDate] = useState('');
    
    const CustomerInputChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setCustomer(e.target.value);
    }

    const WarehouseInputChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setWarehouse(e.target.value);
    }

    const DateInputChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setDate(e.target.value);
    }

    // const [loading, setLoading] = useState(true);
    const popUpInsert = () => {
        
    }

    const listValueWarehouse = ["Warehouse A","Warehouse B"];
    const listValueCustomer = ["Customer A","Customer B"];

    const listProductDetail = [
        {
            product : "product 1",
            Qty : 1,
            Weight : 1,
            Unit : "package",
        },
        {
            product : "product 2",
            Qty : 2,
            Weight : 2,
            Unit : "Pallet",
        },
        {
            product : "product 3",
            Qty : 3,
            Weight : 3,
            Unit : "package",
        },
        {
            product : "product 4",
            Qty : 4,
            Weight : 4,
            Unit : "package",
        },
        {
            product : "product 5",
            Qty : 5,
            Weight : 5,
            Unit : "package",
        },
        {
            product : "product 6",
            Qty : 6,
            Weight : 6,
            Unit : "package",
        },
        {
            product : "product 7",
            Qty : 7,
            Weight : 7,
            Unit : "package",
        },
        {
            product : "product 8",
            Qty : 8,
            Weight : 8,
            Unit : "package",
        },
        {
            product : "product 9",
            Qty : 9,
            Weight : 9,
            Unit : "package",
        },
        {
            product : "product 10",
            Qty : 10,
            Weight : 10,
            Unit : "package",
        },
    ];

    // useEffect(() => {
    //     fetch('http://localhost:3000/itemOrder')
    //         .then(response => response.json())
    //         .then(data => {
    //             setItemOrder(data);
    //             setLoading(false);
    //         });
    // }, []);

    // if (loading) {
    //     return <p>Loading...</p>;
    // }

    return (            
            <div className='p-6 bg-slate-800 grid md:grid-cols-6  justify-center min-h-screen min-w-screen' id="card">
                {/* form */}
                <div className='col-span-2 p-2'>
                    <div>

                    </div>
                    <form className="max-w-md mx-auto p-6 bg-slate-200 rounded-lg w-screen gap-10">
                        <h1 className='my-3 text-2xl text-bold'>Inventory Order</h1>
                        
                        {/* supplier name  show in dropdown?? */}
                        <InputDropDown idName='Customer' listValue={listValueCustomer} label="Choose a Customer" selected='Choose a Customer' onChange={CustomerInputChange}/>
                        <InputDropDown idName='Warehouse' listValue={listValueWarehouse} label="Choose a warehouse" selected="Choose a warehouse" onChange={WarehouseInputChange} />
                        <InputLabel label='Incoming Date' type='Date' placeholder=' ' value={date} onChange={DateInputChange}/>
                        


                        <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
                            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            Submit
                            </span>
                        </button>
                                                
                    </form>
                </div>
                
                {/* insert item */}
                <div className='relative z-0 w-full mb-5 group col-span-4 p-4'>
                    <button type="button" className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                        add new item
                    </button>
                    <TableItemOrder items={listProductDetail}/>
                </div>
                
            </div>
            
    );
}
