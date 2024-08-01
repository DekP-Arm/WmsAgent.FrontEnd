'use client';

import React, { useState, useContext, ChangeEvent } from 'react';
import { ShelfContext } from '~/app/_context/ShelfContext'; // Adjust path as necessary

type Cell = {
  id: number;
  merged: boolean;
  colspan: number;
  rowspan: number;
  width: number;
  height: number;
};

export default function DynamicGrid() {
  const shelfContext = useContext(ShelfContext);

  if (!shelfContext) {
    throw new Error('ShelfContext must be used within a ShelfProvider');
  }

  const { addShelf } = shelfContext;

  const [rows, setRows] = useState<number>(0);
  const [cols, setCols] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>('');
  const [defaultCellWidth, setDefaultCellWidth] = useState<number>(100);
  const [defaultCellHeight, setDefaultCellHeight] = useState<number>(100);
  const [cells, setCells] = useState<Cell[]>([]);
  const [selectedCells, setSelectedCells] = useState<Set<number>>(new Set());
  const [shelfName, setShelfName] = useState<string>('');
  const [selectedCellDetail, setSelectedCellDetail] = useState<Cell | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleShelfNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setShelfName(e.target.value);
  };

  const handleWidthChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDefaultCellWidth(Number(e.target.value) || 0);
  };

  const handleHeightChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDefaultCellHeight(Number(e.target.value) || 0);
  };

  const createGrid = () => {
    const [inputRows, inputCols] = inputValue.split('*').map((str) => Number(str) || 0);
    setRows(inputRows);
    setCols(inputCols);

    const newCells: Cell[] = [];
    for (let i = 0; i < inputRows; i++) {
      for (let j = 0; j < inputCols; j++) {
        newCells.push({
          id: i * inputCols + j,
          merged: false,
          colspan: 1,
          rowspan: 1,
          width: defaultCellWidth,
          height: defaultCellHeight,
        });
      }
    }
    setCells(newCells);
    setSelectedCells(new Set());

    // Save shelf data to local storage
    const shelf: Shelf = {
      name: shelfName,
      rows: inputRows,
      cols: inputCols,
      cells: newCells,
    };
    localStorage.setItem('currentShelf', JSON.stringify(shelf));
  };

  const toggleCellSelection = (cellId: number) => {
    setSelectedCells((prevSelectedCells) => {
      const newSelectedCells = new Set(prevSelectedCells);
      if (newSelectedCells.has(cellId)) {
        newSelectedCells.delete(cellId);
      } else {
        newSelectedCells.add(cellId);
      }
      return newSelectedCells;
    });
    setSelectedCellDetail(cells.find(cell => cell.id === cellId) || null);
  };

  const mergeSelectedCells = () => {
    if (selectedCells.size < 2) return;

    const sortedSelectedCells = Array.from(selectedCells).sort((a, b) => a - b);
    const startCellId = sortedSelectedCells[0];
    const endCellId = sortedSelectedCells[sortedSelectedCells.length - 1];

    const startRow = Math.floor(startCellId / cols);
    const startCol = startCellId % cols;
    const endRow = Math.floor(endCellId / cols);
    const endCol = endCellId % cols;

    let newWidth = 0;
    let newHeight = 0;

    for (let i = startRow; i <= endRow; i++) {
      newHeight += defaultCellHeight;
    }

    for (let j = startCol; j <= endCol; j++) {
      newWidth += defaultCellWidth;
    }

    const newCells = cells.map((cell) => {
      if (selectedCells.has(cell.id)) {
        if (cell.id === startCellId) {
          return {
            ...cell,
            merged: true,
            colspan: endCol - startCol + 1,
            rowspan: endRow - startRow + 1,
            width: newWidth,
            height: newHeight,
          };
        } else {
          return { ...cell, merged: true, colspan: 0, rowspan: 0, width: 0, height: 0 };
        }
      }
      return cell;
    });

    // Recalculate IDs
    const recalculatedCells = newCells
      .filter(cell => !(cell.merged && (cell.colspan === 0 || cell.rowspan === 0)))
      .map((cell, index) => ({
        ...cell,
        id: index,
      }));

    setCells(recalculatedCells);
    setSelectedCells(new Set());
  };

  return (
    <div className="p-4 ">
      <div className="mb-4">
        <input
          type="text"
          onChange={handleShelfNameChange}
          className="border border-gray-300 p-2 rounded-md mr-2"
          placeholder="Enter Shelf Name"
        />
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className="border border-gray-300 p-2 rounded-md mr-2"
          placeholder="Enter rows*cols "
        />
        <button
          onClick={createGrid}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none"
        >
          Create Grid
        </button>
      </div>
      <div className="mb-4">
        <input
          type="number"
          value={defaultCellWidth}
          onChange={handleWidthChange}
          className="border border-gray-300 p-2 rounded-md mr-2"
          placeholder="Enter cell width"
        />
        <input
          type="number"
          value={defaultCellHeight}
          onChange={handleHeightChange}
          className="border border-gray-300 p-2 rounded-md"
          placeholder="Enter cell height"
        />
      </div>
      <button
        onClick={mergeSelectedCells}
        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none mb-4"
      >
        Merge Selected Cells
      </button>

      <div className="flex">
      <div className="overflow-x-auto flex-1">
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, ${defaultCellWidth}px)` }}>
          {cells.map((cell) =>
            cell.merged && (cell.colspan === 0 || cell.rowspan === 0) ? null : (
              <div
                key={cell.id}
                onClick={() => toggleCellSelection(cell.id)}
                className={`border border-gray-300 ${selectedCells.has(cell.id) ? 'bg-blue-200' : ''}`}
                style={{
                  width: `${cell.width}px`,
                  height: `${cell.height}px`,
                  gridColumn: `span ${cell.colspan}`,
                  gridRow: `span ${cell.rowspan}`,
                }}
              >
                Block {cell.id + 1}
                <div className="text-xs text-gray-400">
                  {cell.width} x {cell.height}
                </div>
              </div>
            )
          )}
        </div>
      </div>
      <div className="w-1/4 p-4 border-l border-gray-300">
        {selectedCellDetail && (
          <div>
            <h2 className="text-xl font-bold mb-1">Shelf {shelfName}</h2>
            <p className="text-md text-gray-500 ml-2 font-bold">Block {selectedCellDetail.id + 1}</p>
            <p className="ml-2">Size: {selectedCellDetail.width} x {selectedCellDetail.height}</p>
            <p className="ml-2">Items: </p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
