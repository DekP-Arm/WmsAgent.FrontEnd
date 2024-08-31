"use client";

import React, { useState } from "react";

interface ItemData {
    id: number;
    dock: string;
    warehouse: string;
    quantity: number;
    unit: string;
    description: string;
    status: string;
}

export default function CheckTable() {
    const [data, setData] = useState<ItemData[]>([
        { id: 1, dock: "Dock A", warehouse: "Warehouse A", quantity: 100, unit: "Palette", description: "Oishi Green Tea - Honey", status: "Pending" },
        { id: 2, dock: "Dock B", warehouse: "Warehouse B", quantity: 50, unit: "Pack", description: "Oishi Green Tea - Original", status: "Pending" },
        { id: 3, dock: "Dock C", warehouse: "Warehouse A", quantity: 200, unit: "Items", description: "Oishi Green Tea - Lemon", status: "Pending" },
        { id: 4, dock: "Dock A", warehouse: "Warehouse C", quantity: 75, unit: "Palette", description: "Oishi Green Tea - Matcha", status: "Pending" },
        { id: 5, dock: "Dock D", warehouse: "Warehouse B", quantity: 120, unit: "Pack", description: "Oishi Green Tea - Grape", status: "Pending" },
        { id: 6, dock: "Dock E", warehouse: "Warehouse A", quantity: 60, unit: "Items", description: "Oishi Green Tea - Apple", status: "Pending" },
        { id: 7, dock: "Dock F", warehouse: "Warehouse C", quantity: 150, unit: "Palette", description: "Oishi Green Tea - Peach", status: "Pending" },
        { id: 8, dock: "Dock G", warehouse: "Warehouse B", quantity: 180, unit: "Pack", description: "Oishi Green Tea - Jasmine", status: "Pending" },
        { id: 9, dock: "Dock H", warehouse: "Warehouse C", quantity: 90, unit: "Items", description: "Oishi Green Tea - Mint", status: "Pending" },
        { id: 10, dock: "Dock I", warehouse: "Warehouse A", quantity: 130, unit: "Palette", description: "Oishi Green Tea - Lychee", status: "Pending" },
    ]);

    const [showPopup, setShowPopup] = useState(false);
    const [newItem, setNewItem] = useState<ItemData>({
        id: data.length + 1,
        dock: "Dock A",
        warehouse: "Warehouse A",
        quantity: 0,
        unit: "Palette",
        description: "",
        status: "Pending",
    });

    const addItemData = () => {
        setData([...data, { ...newItem, id: data.length + 1 }]);
        setShowPopup(false);
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Incoming Items</h2>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
                onClick={() => setShowPopup(true)}
            >
                Create ItemData
            </button>

            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Incoming Id</th>
                        <th className="py-2 px-4 border-b">Dock</th>
                        <th className="py-2 px-4 border-b">Warehouse</th>
                        <th className="py-2 px-4 border-b">Quantity</th>
                        <th className="py-2 px-4 border-b">Unit</th>
                        <th className="py-2 px-4 border-b">Description</th>
                        <th className="py-2 px-4 border-b">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(item => (
                        <tr key={item.id}>
                            <td className="py-2 px-4 border-b text-center">{item.id}</td>
                            <td className="py-2 px-4 border-b text-center">{item.dock}</td>
                            <td className="py-2 px-4 border-b text-center">{item.warehouse}</td>
                            <td className="py-2 px-4 border-b text-center">{item.quantity}</td>
                            <td className="py-2 px-4 border-b text-center">{item.unit}</td>
                            <td className="py-2 px-4 border-b text-center">{item.description}</td>
                            <td className="py-2 px-4 border-b text-center">
                                <span className={`font-bold ${item.status === "Accepted" ? "text-green-600" : item.status === "Rejected" ? "text-red-600" : ""}`}>
                                    {item.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Popup for creating new ItemData */}
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-bold mb-4 ">Create Items</h3>
                        
                        <div className="grid grid-cols-2 gap-x-4">
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Dock:</label>
                            <select
                                className="border border-gray-300 p-2 w-full"
                                value={newItem.dock}
                                onChange={(e) => setNewItem({ ...newItem, dock: e.target.value })}
                            >
                                <option>Dock A</option>
                                <option>Dock B</option>
                                <option>Dock C</option>
                                <option>Dock D</option>
                                <option>Dock E</option>
                            </select>
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Warehouse:</label>
                            <select
                                className="border border-gray-300 p-2 w-full"
                                value={newItem.warehouse}
                                onChange={(e) => setNewItem({ ...newItem, warehouse: e.target.value })}
                            >
                                <option>Warehouse A</option>
                                <option>Warehouse B</option>
                                <option>Warehouse C</option>
                            </select>
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Quantity:</label>
                            <input
                                type="number"
                                className="border border-gray-300 p-2 w-full"
                                value={newItem.quantity}
                                onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Unit:</label>
                            <select
                                className="border border-gray-300 p-2 w-full"
                                value={newItem.unit}
                                onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                            >
                                <option>Palette</option>
                                <option>Pack</option>
                                <option>Items</option>
                            </select>
                        </div>
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Description:</label>
                            <input
                                type="text"
                                className="border border-gray-300 p-2 w-full"
                                value={newItem.description}
                                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                            />
                        </div>
                        
                        <div className="flex justify-end">
                            <button
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
                                onClick={() => setShowPopup(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                onClick={addItemData}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
