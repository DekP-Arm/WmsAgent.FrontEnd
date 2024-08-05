"use client";
import { useTheme } from '~/app/_context/Theme';
import { useState } from "react";
import Link from 'next/link';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemTypes = {
    ITEM: 'item',
};

const DraggableItem = ({ id, name, moveItem }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.ITEM,
        item: { id, name },
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult();
            if (item && dropResult) {
                moveItem(item.id, dropResult.id);
            }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    return (
        <div
            ref={drag}
            className={`bg-zinc-600 text-white border-2 border-zinc-700 p-2 ${isDragging ? 'opacity-50' : 'opacity-100'} w-full h-full`}
        >
            {name}
        </div>
    );
};

const DroppableArea = ({ id, items = [], moveItem }) => {
    const [, drop] = useDrop(() => ({
        accept: ItemTypes.ITEM,
        drop: () => ({ id }),
    }));

    return (
        <div ref={drop} className="grid grid-cols-2 grid-rows-4 gap-2 w-full h-full border-2 border-dashed border-gray-300 p-2">
            {items.map((item) => (
                <div key={item.id} className="w-full h-full flex items-center justify-center">
                    <DraggableItem id={item.id} name={item.name} moveItem={moveItem} />
                </div>
            ))}
            {Array.from({ length: 8 - items.length }, (_, index) => (
                <div key={`empty-${index}`} className="w-full h-full flex items-center justify-center border border-dashed border-gray-300">
                    {/* Empty slot */}
                </div>
            ))}
        </div>
    );
};

export function Main() {
    const [isVisible, setIsVisible] = useState(true);
    const { isDarkMode } = useTheme();
    const [shelves, setShelves] = useState({
        shelfAA: [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }],
        shelfAB: [{ id: 3, name: 'Item 3' }],
        shelfAC: [{ id: 4, name: 'Item 4' }],
        
        shelfBA: [{ id: 5, name: 'Item 5' }],
        shelfBB: [{ id: 6, name: 'Item 6' }],
        shelfBC: [{ id: 7, name: 'Item 7' }],

        shelfCA: [{ id: 8, name: 'Item 8' }],
        shelfCB: [{ id: 9, name: 'Item 9' }],
        shelfCC: [{ id: 10, name: 'Item 10' }],

        shelfDA: [{ id: 11, name: 'Item 11' }],
    });
    const [orders, setOrders] = useState({
        orderA: [{ id: 12, name: 'Item 12' }],
        orderB: [],
        orderC: [],
    });

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    const moveItem = (itemId, newShelfOrOrderId) => {
        const updatedShelves = { ...shelves };
        const updatedOrders = { ...orders };
        let item;

        Object.keys(updatedShelves).forEach((key) => {
            updatedShelves[key] = updatedShelves[key].filter((i) => {
                if (i.id === itemId) {
                    item = i;
                    return false;
                }
                return true;
            });
        });

        Object.keys(updatedOrders).forEach((key) => {
            updatedOrders[key] = updatedOrders[key].filter((i) => {
                if (i.id === itemId) {
                    item = i;
                    return false;
                }
                return true;
            });
        });

        if (newShelfOrOrderId in updatedShelves) {
            updatedShelves[newShelfOrOrderId].push(item);
        } else if (newShelfOrOrderId in updatedOrders) {
            updatedOrders[newShelfOrOrderId].push(item);
        }

        setShelves(updatedShelves);
        setOrders(updatedOrders);
    };

    const renderShelf = (shelfName, items) => (
        <div className="flex flex-col items-center mb-8">
            <Link href="/pages/shelf-show">
                <div className="w-full h-full max-w-xs" style={{ height: '200px' }}>
                    <DroppableArea id={shelfName} items={items} moveItem={moveItem} />
                </div>
                <div className={`${isDarkMode ? 'text-white' : 'text-black'} mt-2 text-lg`}>
                    {shelfName}
                </div>
            </Link>
        </div>
    );

    const renderWaitingOrder = (orderName, items) => (
        <div className="flex flex-col items-center mb-8 w-full">
            <Link href="/pages/shelf-show">
                <div className="w-full h-full max-w-xs" style={{ height: '200px' }}>
                    <DroppableArea id={orderName} items={items} moveItem={moveItem} />
                </div>
                <div className={`${isDarkMode ? 'text-white' : 'text-black'} mt-2 text-lg`}>
                    {orderName}
                </div>
            </Link>
        </div>
    );

    return (
        <DndProvider backend={HTML5Backend}>
            <div className={`${isDarkMode ? 'bg-zinc-900' : 'bg-white'} duration-300 flex gap-4 h-screen`}>
                <div className="w-2/3">
                    <div className="overflow-y-auto">
                        <form className="max-w-xs mt-9 mx-auto">
                            <label className="my-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                    </svg>
                                </div>
                                <input type="search" id="default-search" className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Warehouse" required />
                                <button type="submit" className="text-white absolute right-2 bottom-1 bg-zinc-800 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-1 dark:bg-blue-800 dark:hover:bg-blue-800 dark:focus:ring-blue-800">Search</button>
                            </div>
                        </form>
                        <div className={`${isDarkMode ? 'text-white' : 'text-black'} mt-6 mx-auto text-2xl text-center`}>
                            Warehouse
                        </div>
                        <div className="mt-6 grid grid-cols-4 gap-4">
                            <div>
                                <div className="flex flex-col items-center">
                                    {renderShelf('shelfAA', shelves.shelfAA)}
                                </div>
                                <div className="flex flex-col items-center">
                                    {renderShelf('shelfAB', shelves.shelfAB)}
                                </div>
                                <div className="flex flex-col items-center">
                                    {renderShelf('shelfAC', shelves.shelfAB)}
                                </div>
                            </div>
                            <div>
                                <div className="flex flex-col items-center">
                                    {renderShelf('shelfBA', shelves.shelfBA)}
                                </div>
                                <div className="flex flex-col items-center">
                                    {renderShelf('shelfBB', shelves.shelfBB)}
                                </div>
                            </div>
                            <div>
                                <div className="flex flex-col items-center">
                                    {renderShelf('shelfCA', shelves.shelfCA)}
                                </div>
                                <div className="flex flex-col items-center">
                                    {renderShelf('shelfCB', shelves.shelfCB)}
                                </div>
                                <div className="flex flex-col items-center">
                                    {renderShelf('shelfCC', shelves.shelfCC)}
                                </div>
                            </div>
                            <div>
                                <div className="flex flex-col items-center">
                                    {renderShelf('shelfDA', shelves.shelfDA)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='sticky bottom-0'>
                        <div className="mt-6 grid grid-cols-4 gap-4">
                            <div className='mx-4 bg-gray-500 text-white text-center py-1'>
                                Gate 1
                            </div>
                            <div className='mx-4 bg-gray-500 text-white text-center py-1'>
                                Gate 2
                            </div>
                            <div className='mx-4 bg-gray-500 text-white text-center py-1'>
                                Gate 3
                            </div>
                            <div className='mx-4 bg-gray-500 text-white text-center py-1'>
                                Gate 4
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-4 w-1/3 overflow-y-auto">
                    <form className="max-w-xs mt-5 mx-auto">
                        <label className="my-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                </svg>
                            </div>
                            <input type="search" id="default-search" className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Shelf" required />
                            <button type="submit" className="text-white absolute right-2 bottom-1 bg-zinc-800 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-1 dark:bg-blue-800 dark:hover:bg-blue-800 dark:focus:ring-blue-800">Search</button>
                        </div>
                    </form>
                    <div className={`${isDarkMode ? 'text-white' : 'text-black'} mt-6 text-2xl text-center`}>
                        Waiting Orders
                    </div>
                    <div className="mt-8 w-full">
                        {renderWaitingOrder('orderA', orders.orderA)}
                        {renderWaitingOrder('orderB', orders.orderB)}
                        {renderWaitingOrder('orderA', orders.orderC)}
                    </div>
                </div>
            </div>
        </DndProvider>
    );
}
