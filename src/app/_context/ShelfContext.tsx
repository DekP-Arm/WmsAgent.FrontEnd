// _context/ShelfContext.tsx
'use client';

import React, { createContext, useState, ReactNode } from 'react';

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

type ShelfContextType = {
  shelves: Shelf[];
  addShelf: (shelf: Shelf) => void;
};

export const ShelfContext = createContext<ShelfContextType | undefined>(undefined);

export const ShelfProvider = ({ children }: { children: ReactNode }) => {
  const [shelves, setShelves] = useState<Shelf[]>([]);

  const addShelf = (shelf: Shelf) => {
    setShelves([...shelves, shelf]);
  };

  return (
    <ShelfContext.Provider value={{ shelves, addShelf }}>
      {children}
    </ShelfContext.Provider>
  );
};
