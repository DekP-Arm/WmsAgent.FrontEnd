'use client';

import React, { useState } from 'react';

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

export default function ShelfList() {
  const [selectedCells, setSelectedCells] = useState<Set<number>>(new Set());
  const [selectedCellDetail, setSelectedCellDetail] = useState<Cell | null>(null);

  // Define the shelf structure with 1 column and 4 rows
  const shelf: Shelf = {
    name: 'Shelf 1',
    rows: 4,
    cols: 1,
    cells: [
      { id: 0, merged: false, colspan: 1, rowspan: 1, width: 700, height: 100 },
      { id: 1, merged: false, colspan: 1, rowspan: 1, width: 700, height: 100 },
      { id: 2, merged: false, colspan: 1, rowspan: 1, width: 700, height: 100 },
      { id: 3, merged: false, colspan: 1, rowspan: 1, width: 700, height: 100 }
    ]
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
    setSelectedCellDetail(shelf.cells.find(cell => cell.id === cellId) || null);
  };

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

  return (
    <div className="flex">
      <div className="overflow-x-auto flex-1 p-4">
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${shelf.cols}, 100px)` }}>
          {shelf.cells.map((cell, cellIndex) =>
            cell.merged && (cell.colspan === 0 || cell.rowspan === 0) ? null : (
              <div
                key={cell.id}
                onClick={() => toggleCellSelection(cell.id)}
                className={`border border-gray-400 ${selectedCells.has(cell.id) ? '' : ''}`}
                style={{
                  width: `${cell.width}px`,
                  height: `100px`,
                  gridColumn: `span ${cell.colspan}`,
                  gridRow: `span ${cell.rowspan}`,
                }}
              >
                <div className='px-2 pt-1 flex'>
                  Shelf list {cell.id + 1}
                  <div className="ml-4 text-xs text-gray-400 flex">
                    Space
                    {barDataList[cellIndex].reduce((sum, bar) => sum + bar.percentage, 0) < 100 ? (
                      <div
                        className='ml-1 flex'
                        style={{ width: `${100 - barDataList[cellIndex].reduce((sum, bar) => sum + bar.percentage, 0)}%` }}
                      >Avaiable
                      <div className="ml-1">
                        {100 - barDataList[cellIndex].reduce((sum, bar) => sum + bar.percentage, 0)}%
                        </div>
                      </div>
                    ) : (
                      <div className='ml-1'>
                        Full
                      </div>
                    )}
                  </div>
                </div>
                {/* Horizontal Bar Chart */}
                <div className='w-full h-2/3 mb-0 flex border border-zinc-600'>
                  {barDataList[cellIndex].map((bar, index) => (
                    <div
                      key={index}
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
                  {/* Empty Space */}
                  {barDataList[cellIndex].reduce((sum, bar) => sum + bar.percentage, 0) < 100 && (
                    <div
                      className='h-full border border-zinc-600 flex items-center justify-center bg-gray-100 text-zinc-500 text-xs'
                      style={{ width: `${100 - barDataList[cellIndex].reduce((sum, bar) => sum + bar.percentage, 0)}%` }}
                    >
                      {100 - barDataList[cellIndex].reduce((sum, bar) => sum + bar.percentage, 0)}%
                    </div>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </div>
      <div className="w-1/4 p-4 border-l border-gray-300">
        {selectedCellDetail && (
          <div>
            <h2 className="text-xl font-bold mb-1">{shelf.name}</h2>
            <p className="text-md text-gray-500 ml-2 font-bold">Shelf list {selectedCellDetail.id + 1}</p>
            <p className="ml-2">Size: {selectedCellDetail.width} x {selectedCellDetail.height}</p>
            <p className="ml-2">Items :{selectedCellDetail.width} </p>
          </div>
        )}
      </div>
    </div>
  );
}
