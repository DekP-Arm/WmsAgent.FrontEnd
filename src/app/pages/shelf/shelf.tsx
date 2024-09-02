'use client';

import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useSearchParams } from 'next/navigation';
import { useTheme } from '~/app/_context/Theme';
import Shelflist from './shelflist';

type Cell = {
  id: number;
  merged: boolean;
  colspan: number;
  rowspan: number;
  width: number;
  height: number;
  volume: number;
  type: 'Palette' | 'Pack';
  gridColumns?: number;
  addedPaletteCount?: number;  // Add the new property to track the number of added palettes
};

export default function ShelfList() {
  const { isDarkMode } = useTheme();
  const searchParams = useSearchParams();
  const shelfTypeId = searchParams.get('shelfTypeId');
  const shelfId = searchParams.get('shelfId');

  const [cells, setCells] = useState<Cell[]>([
    { id: 0, merged: false, colspan: 1, rowspan: 1, width: 700, height: 100, volume: 1000, type: 'Pack' },
    { id: 1, merged: false, colspan: 1, rowspan: 1, width: 700, height: 100, volume: 1000, type: 'Palette', gridColumns: 4, addedPaletteCount: 0 },
    { id: 2, merged: false, colspan: 1, rowspan: 1, width: 700, height: 100, volume: 1000, type: 'Pack' },
    { id: 3, merged: false, colspan: 1, rowspan: 1, width: 700, height: 100, volume: 1000, type: 'Palette', gridColumns: 3, addedPaletteCount: 0 }
  ]);

  const [dimensionX, setDimensionX] = useState<number | string>('');
  const [dimensionY, setDimensionY] = useState<number | string>('');
  const [dimensionZ, setDimensionZ] = useState<number | string>('');
  const [selectedCellId, setSelectedCellId] = useState<number | null>(null);
  const [isSorted, setIsSorted] = useState(false);
  const [templates, setTemplates] = useState<{ id: number; cells: Cell[] }[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  const [newGridColumns, setNewGridColumns] = useState<number>(1);

  const handleInputChange = (setDimension: React.Dispatch<React.SetStateAction<number | string>>) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value.replace(/^0+/, '');
    setDimension(value === '' ? '' : Number(value));
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
      volume: volume,
      type: 'Pack'
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

  const handleTypeChange = (cellId: number, newType: 'Palette' | 'Pack') => {
    setCells(cells.map(cell => cell.id === cellId ? { ...cell, type: newType } : cell));
  };

  const handleAddPalette = (cellId: number) => {
    setCells(prevCells =>
      prevCells.map(cell =>
        cell.id === cellId
          ? { ...cell, addedPaletteCount: (cell.addedPaletteCount || 0) + 1 }
          : cell
      )
    );
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

  const selectedCellDetail = cells.find(cell => cell.id === selectedCellId);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`${isDarkMode ? 'bg-zinc-900' : 'bg-white'} min-h-screen h-full flex relative`}>
        <div className={`${isDarkMode ? 'text-white' : 'text-black'} overflow-x-auto flex-1 p-4 relative`}>
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(1, 100px)` }}>
            <div className="mt-8 flex justify-between items-center w-full">
              <div className='flex'>
                <div className='flex w-16 text-bold'>Group {shelfTypeId}</div>
                <div className='flex w-16 text-md'>Shelf {shelfId}</div>
              </div>
              <div className='flex'>
                <input
                  type="text"
                  placeholder='Template name'
                  className="border border-gray-300 w-20 mx-1"
                />
                <button
                  onClick={saveTemplate}
                  className="bg-blue-500 text-white px-2 rounded"
                >
                  Save
                </button>
              </div>
            </div>
            {cells.map((cell, index) => (
              <div key={cell.id} className="mb-4">
                <Shelflist
                  cell={cell}
                  index={index}
                  moveCell={moveCell}
                  onSelectCell={handleCellSelect}
                  isSelected={cell.id === selectedCellId}
                  barData={[]}
                  handleAddPalette={() => handleAddPalette(cell.id)}
                  handleTypeChange={handleTypeChange}
                />
              </div>
            ))}
          </div>
        </div>
        <div className={`${isDarkMode ? 'text-white' : 'text-black'} w-1/6 p-4 border-l border-gray-300 flex flex-col`}>
          {selectedCellDetail && (
            <div>
              <p className="text-md  font-bold mt-4">Shelf list {selectedCellDetail.id + 1}</p>
              <p className="mt-2 ml-4">Volume: {selectedCellDetail.volume} cm³</p>
              <p className="mt-2 ml-4">Type: {selectedCellDetail.type}</p>
              {selectedCellDetail.type === 'Palette' && (
                <div>
                  <div className='text-md text-gray-800 font-bold mt-4 mb-2'>
                    Palette List
                  </div>
                  <div className='ml-4'>
                    {selectedCellDetail.addedPaletteCount && selectedCellDetail.addedPaletteCount > 0 ? (
                      Array.from({ length: selectedCellDetail.addedPaletteCount }).map((_, index) => (
                        <div key={index} className="p-2">
                          Added Palette {index + 1}
                        </div>
                      ))
                    ) : (
                      <div>No Palettes Added</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className={`${isDarkMode ? 'text-white' : 'text-black'} w-1/6 p-4 border-l border-gray-300 flex flex-col`}>
          <div className='mx-auto text-lg font-bold mt-3'>Incoming Item</div>
        </div>
        <div className={`${isDarkMode ? 'text-white' : 'text-black'} w-1/6 p-4 border-l border-gray-300 flex flex-col`}>
          <div className="mt-4">
            <p className="text-md font-bold">Add New Shelf List</p>
            <div className="flex flex-col gap-2 mt-2">
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
              <p className='text-xs text-gray-600'>Use template will be replaced shelf</p>
            </div>
            <ul>
              {templates.map(template => (
                <li key={template.id} className="mt-2">
                  <button
                    onClick={() => setSelectedTemplateId(template.id)}
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
