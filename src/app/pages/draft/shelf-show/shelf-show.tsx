'use client';

import React, { useState, useEffect } from 'react';

type Cell = {
  id: number;
  merged: boolean;
  colspan: number;
  rowspan: number;
  width: number;
  height: number;
};

type Shelf = {
  name: string;
  rows: number;
  cols: number;
  cells: Cell[];
};

export default function ShelfPage() {
  const [shelf, setShelf] = useState<Shelf | null>(null);
  const [selectedCells, setSelectedCells] = useState<Set<number>>(new Set());
  const [selectedCellDetail, setSelectedCellDetail] = useState<Cell | null>(null);

  useEffect(() => {
    const savedShelf = localStorage.getItem('currentShelf');
    if (savedShelf) {
      setShelf(JSON.parse(savedShelf));
    }
  }, []);

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
    if (shelf) {
      setSelectedCellDetail(shelf.cells.find(cell => cell.id === cellId) || null);
    }
  };

  if (!shelf) {
    return <p>No shelf data available.</p>;
  }

  return (
    <div className="flex">
      <div className="overflow-x-auto flex-1 p-4">
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${shelf.cols}, ${100}px)` }}>
          {shelf.cells.map((cell) =>
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
            <h2 className="text-xl font-bold mb-1">Shelf {shelf.name}</h2>
            <p className="text-md text-gray-500 ml-2 font-bold">Block {selectedCellDetail.id + 1}</p>
            <p className="ml-2">Size: {selectedCellDetail.width} x {selectedCellDetail.height}</p>
            <p className="ml-2">Items: </p>
          </div>
        )}
      </div>
    </div>
  );
}
