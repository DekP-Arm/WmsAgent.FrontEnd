import { useEffect, useState } from 'react';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  content: PopupContent | null;
  selectedShelf: number | null;
  onSelectShelf: (shelfId: number, typeId: number) => void;
  onMovePalette: () => void;
  shelves: Shelf[];
  shelfTypes: ShelfType[];
}

export function Popup({
  isOpen,
  onClose,
  content,
  selectedShelf,
  onSelectShelf,
  onMovePalette,
  shelves,
  shelfTypes
}: PopupProps) {
  const [selectedShelfId, setSelectedShelfId] = useState<number | null>(null);
  const [selectedShelfTypeId, setSelectedShelfTypeId] = useState<number | null>(null);
  const [selectedShelfDetails, setSelectedShelfDetails] = useState<Shelf | null>(null);
  const [selectedShelfMap, setSelectedShelfMap] = useState<{ [shelfId: number]: number }>({});

  useEffect(() => {
    if (selectedShelf) {
      const shelf = shelves.find(s => s.id === selectedShelf);
      if (shelf) {
        setSelectedShelfId(shelf.id);
        setSelectedShelfTypeId(shelf.typeId);
        setSelectedShelfDetails(shelf);
        setSelectedShelfMap(prev => ({
          ...prev,
          [shelf.id]: shelf.typeId
        }));
      }
    } else {
      setSelectedShelfId(null);
      setSelectedShelfTypeId(null);
      setSelectedShelfDetails(null);
    }
  }, [selectedShelf, shelves]);

  useEffect(() => {
    if (content) {
      setSelectedShelfId(null);
      setSelectedShelfTypeId(null);
      setSelectedShelfDetails(null);
      setSelectedShelfMap({});
    }
  }, [content, isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !content) {
    return null;
  }

  const groupedShelves = shelves.reduce((acc: { [key: number]: Shelf[] }, shelf) => {
    if (!acc[shelf.typeId]) {
      acc[shelf.typeId] = [];
    }
    acc[shelf.typeId].push(shelf);
    return acc;
  }, {});

  const getShelfTypeName = (typeId: number) => {
    const shelfType = shelfTypes.find(st => st.id === typeId);
    return shelfType ? shelfType.name : 'Unknown';
  };

  const handleShelfClick = (shelfId: number, typeId: number) => {
    // Update selectedShelfMap to ensure only one shelf per typeId
    setSelectedShelfMap(prev => {
      const updatedMap = { ...prev };
      // Remove previous selection with the same shelfId
      if (updatedMap[shelfId] && updatedMap[shelfId] !== typeId) {
        delete updatedMap[shelfId];
      }
      updatedMap[shelfId] = typeId; // Set new selection
      return updatedMap;
    });

    // Update selectedShelf details
    const selectedShelf = shelves.find(shelf => shelf.id === shelfId && shelf.typeId === typeId);
    setSelectedShelfId(shelfId);
    setSelectedShelfTypeId(typeId);
    setSelectedShelfDetails(selectedShelf || null);
    onSelectShelf(shelfId, typeId);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleOverlayClick}
    >
      <div className="relative w-full max-w-screen-lg p-4 bg-white rounded-lg shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <h2 className="text-lg font-bold mb-2">Palette Details</h2>
        <div className="mb-4">
          <p><strong>ID:</strong> {content.id}</p>
          <p><strong>Name:</strong> {content.name}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Select Shelf by Type:</h3>
          {Object.entries(groupedShelves).map(([typeId, shelvesByType]) => (
            <div key={typeId} className="mb-4">
              <h4 className="text-md font-semibold mb-1">Shelf Type: {getShelfTypeName(parseInt(typeId))}</h4>
              {shelvesByType.map(shelf => (
                <div
                  key={shelf.id}
                  className={`p-2 border cursor-pointer ${selectedShelfId === shelf.id && selectedShelfTypeId === shelf.typeId ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  onClick={() => handleShelfClick(shelf.id, shelf.typeId)}
                >
                  {shelf.name} (Shelf ID: {shelf.id})
                </div>
              ))}
            </div>
          ))}
        </div>
        {selectedShelfDetails && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Selected Shelf Details:</h3>
            <p><strong>Shelf Type ID:</strong> {selectedShelfDetails.typeId}</p>
            <p><strong>Shelf Type Name:</strong> {getShelfTypeName(selectedShelfDetails.typeId)}</p>
            <p><strong>Shelf ID:</strong> {selectedShelfDetails.id}</p>
          </div>
        )}
        <button
          onClick={onMovePalette}
          className="bg-green-500 text-white p-2 rounded"
          disabled={!selectedShelfId}
        >
          Move to Selected Shelf
        </button>
      </div>
    </div>
  );
}
