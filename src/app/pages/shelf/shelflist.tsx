import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';

type Cell = {
    id: number;
    merged: boolean;
    colspan: number;
    rowspan: number;
    width: number;
    height: number;
    volume: number;
    type: 'Palette' | 'Pack';
    gridColumns?: number; // Optional property to store grid columns for Palette type
};

const ItemTypes = {
    CELL: 'cell',
};

const Shelflist = ({
    cell,
    index,
    moveCell,
    onSelectCell,
    isSelected,
    barData,
    handleAddPalette,
    handleTypeChange
}: {
    cell: Cell;
    index: number;
    moveCell: (dragIndex: number, hoverIndex: number) => void;
    onSelectCell: (cellId: number) => void;
    isSelected: boolean;
    barData: { label: string; weight: number; percentage: number; color: string }[];
    handleAddPalette: (cellId: number, gridColumns: number) => void;
    handleTypeChange: (cellId: number, newType: 'Palette' | 'Pack') => void;
}) => {
    const [, ref] = useDrag({
        type: ItemTypes.CELL,
        item: { index },
    });

    const [, drop] = useDrop({
        accept: ItemTypes.CELL,
        hover(item: { index: number }) {
            if (item.index !== index) {
                moveCell(item.index, index);
                item.index = index;
            }
        },
    });

    const [localGridColumns, setLocalGridColumns] = useState<number>(cell.gridColumns || 1);
    const [addedPaletteCount, setAddedPaletteCount] = useState<number>(0);

    const handleGridChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newGridColumns = Number(event.target.value);
        if (!isNaN(newGridColumns) && newGridColumns > 0) {
            setLocalGridColumns(newGridColumns);
            handleAddPalette(cell.id, newGridColumns); // Update the grid columns in parent
        }
    };

    const addPaletteSlot = () => {
        setAddedPaletteCount(prevCount => prevCount + 1);
    };

    return (
        <div
            ref={(node) => ref(drop(node))}
            className={`border border-gray-400 cursor-move ${isSelected ? 'bg-blue-200' : ''}`}
            onClick={() => onSelectCell(cell.id)}
            style={{
                width: `${cell.width}px`,
                height: `130px`,
            }}
        >
            <div className='px-2 pt-1 flex flex-col'>
                <div className="flex justify-between">
                    <span>Shelf list {cell.id + 1}</span>
                    <div className='flex'>
                        <select
                            value={cell.type}
                            onChange={(e) => handleTypeChange(cell.id, e.target.value as 'Palette' | 'Pack')}
                            className="text-sm px-2 border border-gray-300 mx-2"
                        >
                            <option value="Palette">Palette</option>
                            <option value="Pack">Pack</option>
                        </select>
                        {cell.type === 'Palette' && (
                            <div>
                                <label>
                                    
                                    <input
                                        type="number"
                                        value={localGridColumns}
                                        onChange={handleGridChange}
                                        placeholder='Grid'
                                        className="border border-gray-300 mr-2 text-sm w-6"
                                    />
                                </label>
                                <button
                                    className="bg-green-500 text-white px-2 text-sm rounded mr-2"
                                    onClick={() => { addPaletteSlot(); handleAddPalette(); }}
                                >
                                    Add Palette
                                </button>
                            </div>
                        )}
                        <div className="text-xs text-gray-400 flex">
                            Space {100 - barData.reduce((sum, bar) => sum + bar.percentage, 0)}%
                        </div>
                    </div>
                </div>
                <div className="text-xs text-gray-400 flex">
                    Volume: {cell.volume} cm³
                </div>
            </div>
            {cell.type === 'Palette' && (
                <div className="flex justify-center h-full z-10">
                    <div className='grid border border-black w-full h-2/3'
                        style={{ gridTemplateColumns: `repeat(${localGridColumns}, 1fr)` }}
                    >
                        {/* Display initial grid structure */}
                        {Array.from({ length: localGridColumns }).map((_, colIndex) => (
                            <div key={colIndex} className='border border-gray-300 flex items-center justify-center'>
                                {colIndex < addedPaletteCount ? (
                                    <div className="p-2">
                                        Added Palette {colIndex + 1}
                                    </div>
                                ) : (
                                    <div className="p-2 text-gray-400">
                                        Empty Slot
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {cell.type === 'Pack' && (
                <div className='w-full h-2/3 mb-0 flex border border-zinc-600 z-10'>
                    {barData.map((bar, barIndex) => (
                        <div
                            key={barIndex}
                            className={`h-full border border-zinc-600 ${bar.color} flex items-center justify-center`}
                            style={{ width: `${bar.percentage}%` }}
                        >
                            {bar.percentage > 0 && (
                                <div className="flex flex-col items-center justify-center text-xs text-white">
                                    <span>{bar.label}</span>
                                    <span>{bar.percentage}%</span>
                                    <span>{bar.weight}kg</span>
                                </div>
                            )}
                        </div>
                    ))}
                    {100 - barData.reduce((sum, bar) => sum + bar.percentage, 0) > 0 && (
                        <div
                            className='h-full border border-zinc-600 flex items-center justify-center bg-gray-100 text-zinc-500 text-xs'
                            style={{ width: `${100 - barData.reduce((sum, bar) => sum + bar.percentage, 0)}%` }}
                        >
                            {100 - barData.reduce((sum, bar) => sum + bar.percentage, 0)}%
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Shelflist;
