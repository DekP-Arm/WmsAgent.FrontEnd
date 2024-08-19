"use client";
import { useTheme } from '~/app/_context/Theme';
import { useState, useRef, useEffect } from "react";
import Link from 'next/link';

export function Main() {
    const [isVisible, setIsVisible] = useState(true);
    const { isDarkMode } = useTheme();
    const [shelves, setShelves] = useState({
        shelfAA: [{ id: 1, name: 'Shelf 1' },
        { id: 2, name: 'Shelf 2' },
        { id: 3, name: 'Shelf 3' },
        { id: 4, name: 'Shelf 4' },
        { id: 5, name: 'Shelf 5' },
        { id: 6, name: 'Shelf 6' },
        { id: 7, name: 'Shelf 7' },
        { id: 8, name: 'Shelf 8' },
        ],
        shelfAB: [{ id: 1, name: 'Shelf 1' },
        { id: 2, name: 'Shelf 2' },
        { id: 3, name: 'Shelf 3' },
        { id: 4, name: 'Shelf 4' },
        { id: 5, name: 'Shelf 5' },
        { id: 6, name: 'Shelf 6' },
        { id: 7, name: 'Shelf 7' },
        { id: 8, name: 'Shelf 8' },
        ],
        shelfAC: [{ id: 1, name: 'Shelf 1' },
        { id: 2, name: 'Shelf 2' },
        { id: 3, name: 'Shelf 3' },
        { id: 4, name: 'Shelf 4' },
        { id: 5, name: 'Shelf 5' },
        { id: 6, name: 'Shelf 6' },
        { id: 7, name: 'Shelf 7' },
        { id: 8, name: 'Shelf 8' },
        ],

        shelfBA: [{ id: 1, name: 'Shelf 1' },
        { id: 2, name: 'Shelf 2' },
        { id: 3, name: 'Shelf 3' },
        { id: 4, name: 'Shelf 4' },
        { id: 5, name: 'Shelf 5' },
        { id: 6, name: 'Shelf 6' },
        { id: 7, name: 'Shelf 7' },
        { id: 8, name: 'Shelf 8' },
        ],
        shelfBB: [{ id: 1, name: 'Shelf 1' },
        { id: 2, name: 'Shelf 2' },
        { id: 3, name: 'Shelf 3' },
        { id: 4, name: 'Shelf 4' },
        { id: 5, name: 'Shelf 5' },
        { id: 6, name: 'Shelf 6' },
        { id: 7, name: 'Shelf 7' },
        { id: 8, name: 'Shelf 8' },
        ],
        shelfBC: [{ id: 1, name: 'Shelf 1' },
        { id: 2, name: 'Shelf 2' },
        { id: 3, name: 'Shelf 3' },
        { id: 4, name: 'Shelf 4' },
        { id: 5, name: 'Shelf 5' },
        { id: 6, name: 'Shelf 6' },
        { id: 7, name: 'Shelf 7' },
        { id: 8, name: 'Shelf 8' },
        ],

        shelfCA: [{ id: 1, name: 'Shelf 1' },
        { id: 2, name: 'Shelf 2' },
        { id: 3, name: 'Shelf 3' },
        { id: 4, name: 'Shelf 4' },
        { id: 5, name: 'Shelf 5' },
        { id: 6, name: 'Shelf 6' },
        { id: 7, name: 'Shelf 7' },
        { id: 8, name: 'Shelf 8' },
        ],
        shelfCB: [{ id: 1, name: 'Shelf 1' },
        { id: 2, name: 'Shelf 2' },
        { id: 3, name: 'Shelf 3' },
        { id: 4, name: 'Shelf 4' },
        { id: 5, name: 'Shelf 5' },
        { id: 6, name: 'Shelf 6' },
        { id: 7, name: 'Shelf 7' },
        { id: 8, name: 'Shelf 8' },
        ],
        shelfCC: [{ id: 1, name: 'Shelf 1' },
        { id: 2, name: 'Shelf 2' },
        { id: 3, name: 'Shelf 3' },
        { id: 4, name: 'Shelf 4' },
        { id: 5, name: 'Shelf 5' },
        { id: 6, name: 'Shelf 6' },
        { id: 7, name: 'Shelf 7' },
        { id: 8, name: 'Shelf 8' },
        ],

        shelfDA: [{ id: 1, name: 'Shelf 1' },
        { id: 2, name: 'Shelf 2' },
        { id: 3, name: 'Shelf 3' },
        { id: 4, name: 'Shelf 4' },
        { id: 5, name: 'Shelf 5' },
        { id: 6, name: 'Shelf 6' },
        { id: 7, name: 'Shelf 7' },
        { id: 8, name: 'Shelf 8' },
        ],
    });
    const [orders, setOrders] = useState({
        orderA: [{ id: 1, name: 'Shelf 1' },
        { id: 2, name: 'Shelf 2' },
        { id: 3, name: 'Shelf 3' },
        { id: 4, name: 'Shelf 4' },
        { id: 5, name: 'Shelf 5' },
        { id: 6, name: 'Shelf 6' },
        { id: 7, name: 'Shelf 7' },
        { id: 8, name: 'Shelf 8' },
        ],
        orderB: [{ id: 1, name: 'Shelf 1' },
        { id: 2, name: 'Shelf 2' },
        { id: 3, name: 'Shelf 3' },
        { id: 4, name: 'Shelf 4' },
        { id: 5, name: 'Shelf 5' },
        { id: 6, name: 'Shelf 6' },
        { id: 7, name: 'Shelf 7' },
        { id: 8, name: 'Shelf 8' },
        ],
        orderC: [{ id: 1, name: 'Shelf 1' },
        { id: 2, name: 'Shelf 2' },
        { id: 3, name: 'Shelf 3' },
        { id: 4, name: 'Shelf 4' },
        { id: 5, name: 'Shelf 5' },
        { id: 6, name: 'Shelf 6' },
        { id: 7, name: 'Shelf 7' },
        { id: 8, name: 'Shelf 8' },
        ],
    });

    const [selectedItem, setSelectedItem] = useState(null);
    const [targetItem, setTargetItem] = useState(null);

    const shelfRefs = useRef({});
    const orderRefs = useRef({});

    const drawLines = () => {
        const svg = document.querySelector('svg');
        if (!svg) return;

        svg.innerHTML = '';

        if (selectedItem && targetItem) {
            const shelfElement = shelfRefs.current[selectedItem.shelf];
            const orderElement = orderRefs.current[targetItem.order];

            if (shelfElement && orderElement) {
                const { top: shelfTop, left: shelfLeft } = shelfElement.getBoundingClientRect();
                const { top: orderTop, left: orderLeft } = orderElement.getBoundingClientRect();

                const x1 = shelfLeft + shelfElement.offsetWidth / 2;
                const y1 = shelfTop + shelfElement.offsetHeight / 2;
                const x2 = orderLeft + orderElement.offsetWidth / 2;
                const y2 = orderTop + orderElement.offsetHeight / 2;

                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', x1);
                line.setAttribute('y1', y1);
                line.setAttribute('x2', x2);
                line.setAttribute('y2', y2);
                line.setAttribute('stroke', 'black');
                line.setAttribute('stroke-width', '2');
                svg.appendChild(line);
            }
        }
    };

    useEffect(() => {
        drawLines();
        window.addEventListener('resize', drawLines);
        return () => window.removeEventListener('resize', drawLines);
    }, [shelves, orders, selectedItem, targetItem]);

    const handleItemClick = (item, type) => {
        if (type === 'shelf') {
            setSelectedItem(item);
        } else if (type === 'order') {
            setTargetItem(item);
        }
    };

    const renderShelf = (shelfName, items, refMap) => (
        <div className="flex flex-col items-center mb-8" ref={el => refMap.current[shelfName] = el}>
            <div className="w-full h-full max-w-xs" style={{ height: '200px' }}>
                <Link href="/pages/shelf-list">
                <div className="grid grid-cols-2 grid-rows-4 gap-2 w-full h-full border-2 border-dashed border-gray-300 p-2">
                    {items.map(item => (
                        <div 
                            key={item.id} 
                            className={`w-full h-full flex items-center justify-center bg-zinc-600 text-white border-2 border-zinc-700 p-2 cursor-pointer ${selectedItem && selectedItem.id === item.id && 'bg-green-500'}`}
                            onClick={() => handleItemClick({ id: item.id, shelf: shelfName }, 'shelf')}
                        >
                            {item.name}
                        </div>
                    ))}
                    {Array.from({ length: 8 - items.length }, (_, index) => (
                        <div key={`empty-${index}`} className="w-full h-full flex items-center justify-center border border-dashed border-gray-300">
                            {/* Empty slot */}
                        </div>
                    ))}
                </div>
                </Link>
            </div>
            <div className={`${isDarkMode ? 'text-white' : 'text-black'} mt-2 text-center`}>
                {shelfName}
            </div>
        </div>
    );

    return (
        <div className={`${isDarkMode ? 'bg-zinc-900' : 'bg-white'} relative`}>
            <svg className="absolute top-0 left-0 w-full h-full z-10" style={{ pointerEvents: 'none' }}></svg>
            <div className="relative flex ">
                <div className='w-2/3 mt-6'>
                    <h1 className="text-center text-2xl font-bold mb-6">Shelves</h1>
                    <div className="grid grid-cols-4 justify-center gap-6">
                        {Object.keys(shelves).map(shelfName => renderShelf(shelfName, shelves[shelfName], shelfRefs))}
                    </div>
                </div>
                <div className="w-1/3 mt-6">
                    <h1 className="text-center text-2xl font-bold mb-6">Orders</h1>
                    <div className="flex flex-wrap justify-center gap-6">
                        {Object.keys(orders).map(orderName => (
                            <Link href="/pages/shelf-list">
                            <div 
                                key={orderName} 
                                className="flex flex-col items-center mb-8" 
                                ref={el => orderRefs.current[orderName] = el}
                            >
                                <div className="w-full h-full max-w-xs" style={{ height: '200px' }}>
                                    <div className="grid grid-cols-2 grid-rows-4 gap-2 w-full h-full border-2 border-dashed border-gray-300 p-2">
                                        {orders[orderName].map(item => (
                                            <div 
                                                key={item.id} 
                                                className={`w-full h-full flex items-center justify-center bg-zinc-600 text-white border-2 border-zinc-700 p-2 cursor-pointer ${targetItem && targetItem.id === item.id && 'bg-blue-500'}`}
                                                onClick={() => handleItemClick({ id: item.id, order: orderName }, 'order')}
                                            >
                                                {item.name}
                                            </div>
                                        ))}
                                        {Array.from({ length: 8 - orders[orderName].length }, (_, index) => (
                                            <div key={`empty-${index}`} className="w-full h-full flex items-center justify-center border border-dashed border-gray-300">
                                                {/* Empty slot */}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className={`${isDarkMode ? 'text-white' : 'text-black'} mt-2 text-center`}>
                                    {orderName}
                                </div>
                            </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}