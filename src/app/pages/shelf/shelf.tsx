'use client';

import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useRouter } from 'next/navigation';

type Cell = {
  id: number;
  merged: boolean;
  colspan: number;
  rowspan: number;
  width: number;
  height: number;
  volume: number;
};

const ItemTypes = {
  CELL: 'cell',
};

const DraggableCell = ({
  cell,
  index,
  moveCell,
  onSelectCell,
  isSelected,
  barData
}: {
  cell: Cell;
  index: number;
  moveCell: (dragIndex: number, hoverIndex: number) => void;
  onSelectCell: (cellId: number) => void;
  isSelected: boolean;
  barData: { label: string; weight: number; percentage: number; color: string }[];
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

  const totalPercentage = barData.reduce((sum, bar) => sum + bar.percentage, 0);

  return (
    <div
      ref={(node) => ref(drop(node))}
      className={`border border-gray-400 cursor-move ${isSelected ? 'bg-blue-200' : ''}`}
      onClick={() => onSelectCell(cell.id)}
      style={{
        width: `${cell.width}px`,
        height: `100px`,
      }}
    >
      <div className='px-2 pt-1 flex flex-col'>
        <div className="flex justify-between">
          <span>Shelf list {cell.id + 1}</span>
          <div className="text-xs text-gray-400 flex">
            Space
            {100 - totalPercentage}%
          </div>
        </div>
        <div className="text-xs text-gray-400 flex">
          Volume: {cell.volume} cm³
        </div>
      </div>
      <div className='w-full h-2/3 mb-0 flex border border-zinc-600'>
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
        {100 - totalPercentage > 0 && (
          <div
            className='h-full border border-zinc-600 flex items-center justify-center bg-gray-100 text-zinc-500 text-xs'
            style={{ width: `${100 - totalPercentage}%` }}
          >
            {100 - totalPercentage}%
          </div>
        )}
      </div>
    </div>
  );
};

export default function ShelfList() {
  const router = useRouter();

  const [cells, setCells] = useState<Cell[]>([
    { id: 0, merged: false, colspan: 1, rowspan: 1, width: 700, height: 100, volume: 1000 },
    { id: 1, merged: false, colspan: 1, rowspan: 1, width: 700, height: 100, volume: 1000 },
    { id: 2, merged: false, colspan: 1, rowspan: 1, width: 700, height: 100, volume: 1000 },
    { id: 3, merged: false, colspan: 1, rowspan: 1, width: 700, height: 100, volume: 1000 }
  ]);

  const [dimensionX, setDimensionX] = useState<number | string>('');  // Height
  const [dimensionY, setDimensionY] = useState<number | string>('');  // Width
  const [dimensionZ, setDimensionZ] = useState<number | string>('');  // Depth
  const [selectedCellId, setSelectedCellId] = useState<number | null>(null);
  const [isSorted, setIsSorted] = useState(false);
  const [templates, setTemplates] = useState<{ id: number; cells: Cell[] }[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);

  const handleInputChange = (setDimension: React.Dispatch<React.SetStateAction<number | string>>) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value.replace(/^0+/, ''); // Remove leading zeroes
    setDimension(value === '' ? '' : Number(value)); // Convert to number if not empty
  };

  const addNewShelfList = () => {
    const newCellId = cells.length;
    const volume = Number(dimensionX) * Number(dimensionY) * Number(dimensionZ);

    const newCell: Cell = {
      id: newCellId,
      merged: false,
      colspan: 1,
      rowspan: 1,
      width: 700,
      height: 100,
      volume: volume
    };

    setCells([...cells, newCell]);
    setDimensionX('');
    setDimensionY('');
    setDimensionZ('');
  };

  const moveCell = (dragIndex: number, hoverIndex: number) => {
    const updatedCells = [...cells];
    const [movedCell] = updatedCells.splice(dragIndex, 1);
    updatedCells.splice(hoverIndex, 0, movedCell);
    setCells(updatedCells);
  };

  const handleCellSelect = (cellId: number) => {
    setSelectedCellId(cellId);
  };

  const selectedCellDetail = cells.find(cell => cell.id === selectedCellId);

  const barDataList = [
    [
      { label: 'Oishi', weight: 10, percentage: 10, color: 'bg-gradient-to-r from-emerald-900 via-emerald-600 to-emerald-300 background-animate' },
      { label: 'Singha', weight: 10, percentage: 20, color: 'bg-gradient-to-r from-blue-900 via-blue-600 to-blue-300 background-animate' },
      { label: 'Leo', weight: 10, percentage: 50, color: 'bg-gradient-to-r from-red-900 via-red-600 to-red-300 background-animate' },
      { label: 'Blend', weight: 10, percentage: 20, color: 'bg-gradient-to-r from-purple-900 via-purple-600 to-purple-300 background-animate' }
    ],
    [
      { label: 'Oishi', percentage: 30, color: 'bg-gradient-to-r from-emerald-900 via-emerald-600 to-emerald-300 background-animate' },
      { label: 'Singha', percentage: 20, color: 'bg-gradient-to-r from-blue-900 via-blue-600 to-blue-300 background-animate' },
      { label: 'Leo', percentage: 10, color: 'bg-gradient-to-r from-red-900 via-red-600 to-red-300 background-animate' },
      { label: 'Blend', percentage: 40, color: 'bg-gradient-to-r from-purple-900 via-purple-600 to-purple-300 background-animate' }
    ],
    [
      { label: 'Oishi', percentage: 10, color: 'bg-gradient-to-r from-emerald-900 via-emerald-600 to-emerald-300 background-animate' },
      { label: 'Singha', percentage: 20, color: 'bg-gradient-to-r from-blue-900 via-blue-600 to-blue-300 background-animate' }
    ],
    [
      { label: 'Singha', percentage: 20, color: 'bg-gradient-to-r from-blue-900 via-blue-600 to-blue-300 background-animate' },
      { label: 'Leo', percentage: 50, color: 'bg-gradient-to-r from-red-900 via-red-600 to-red-300 background-animate' },
      { label: 'Blend', percentage: 20, color: 'bg-gradient-to-r from-purple-900 via-purple-600 to-purple-300 background-animate' }
    ]
  ];

  const confirmSorting = () => {
    const sortedCells = [...cells].sort((a, b) => a.id - b.id);
    const renamedCells = sortedCells.map((cell, index) => ({
      ...cell,
      id: index
    }));
    setCells(renamedCells);
    setIsSorted(true);
  };

  const saveTemplate = () => {
    const newTemplate = {
      id: Date.now(),
      cells: [...cells] // or a deep copy if needed
    };
    setTemplates([...templates, newTemplate]);
  };

  const loadTemplate = (templateId: number) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setCells(template.cells);
      setSelectedTemplateId(templateId);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex">
        <div className="overflow-x-auto flex-1 p-4 relative">
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(1, 100px)` }}>
            {cells.map((cell, index) =>
              <DraggableCell
                key={cell.id}
                cell={cell}
                index={index}
                moveCell={moveCell}
                onSelectCell={handleCellSelect}
                isSelected={cell.id === selectedCellId}
                barData={barDataList[index % barDataList.length]}
              />
            )}
          </div>
          <div className='flex mt-10'>
            <button
              onClick={confirmSorting}
              className="bg-green-500 text-white p-2 rounded mr-2"
            >
              Confirm
            </button>
            <button
              onClick={saveTemplate}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Save Template
            </button>
          </div>
        </div>
        <div className="w-1/5 p-4 border-l border-gray-300 flex flex-col">
          {selectedCellDetail && (
            <div>
              <p className="text-md text-gray-800 font-bold mt-4">Shelf list {selectedCellDetail.id + 1}</p>
              <p className="mt-2 ml-4">Volume: {selectedCellDetail.volume} cm³</p>
              <p className="text-md text-gray-800 font-bold mt-4">Item:</p>
            </div>
          )}
        </div>
        <div className="w-1/5 p-4 border-l border-gray-300 flex flex-col items-center">
          <div className="mt-4">
            <p className="text-md font-bold">Add New Shelf List</p>
            <div className="flex flex-col gap-2 mt-2 ml-4">
              <label>
                Height
                <input
                  type="number"
                  value={dimensionX}
                  placeholder='cm'
                  onChange={handleInputChange(setDimensionX)}
                  className="border border-gray-300 p-2"
                />
              </label>
              <label>
                Width
                <input
                  type="number"
                  value={dimensionY}
                  placeholder='cm'
                  onChange={handleInputChange(setDimensionY)}
                  className="border border-gray-300 p-2"
                />
              </label>
              <label>
                Depth
                <input
                  type="number"
                  value={dimensionZ}
                  placeholder='cm'
                  onChange={handleInputChange(setDimensionZ)}
                  className="border border-gray-300 p-2"
                />
              </label>
              <button
                onClick={addNewShelfList}
                className="mt-4 bg-blue-500 text-white p-2 rounded"
              >
                Add New Shelf
              </button>
            </div>
          </div>
          <div className="mt-4">
            <div className='relative mx-auto'>
              <p className="text-lg font-bold">Saved Templates</p>
              <p className='text-xs text-gray-600'>Use template will be replace shelf</p>
            </div>
            <ul>
              {templates.map(template => (
                <li key={template.id} className="mt-2">
                  <button
                    onClick={() => loadTemplate(template.id)}
                    className={`p-2 rounded ${selectedTemplateId === template.id ? 'bg-gray-300' : 'bg-gray-100'}`}
                  >
                    Template {template.id}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
