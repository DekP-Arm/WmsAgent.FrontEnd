import React, { useState } from 'react';

interface Item {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  dockId?: string; // Added for storing dock ID
  palette?: string; // Added for storing palette
}

interface Order {
  id: number;
  items: Item[];
}

interface Dock {
  id: string;
  name: string;
  palettes: string[];
}

const initialOrders: Order[] = [
  {
    id: 1,
    items: [
      { id: 'item1', name: 'ช้าง', quantity: 12, unit: 'pac' },
      { id: 'item2', name: 'สิงห์', quantity: 13, unit: 'pac' },
    ],
  },
  {
    id: 2,
    items: [
      { id: 'item3', name: 'ลีโอ', quantity: 14, unit: 'pac' },
      { id: 'item4', name: 'อิชิตัน', quantity: 15, unit: 'pac' },
    ],
  },
];

const initialDocks: Dock[] = [
  {
    id: 'dock1',
    name: 'GroupAA',
    palettes: ['Palette 1','Palette 2','Palette 3','Palette 4','Palette 5'],
  },
  {
    id: 'dock2',
    name: 'GroupAB',
    palettes: ['Palette 1', 'Palette 2'],
  },
];

export function Orders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [docks] = useState<Dock[]>(initialDocks);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [selectedPalette, setSelectedPalette] = useState<string>('');
  const [selectedDockId, setSelectedDockId] = useState<string>('');

  const handleDockChange = (orderId: number, itemId: string, dockId: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              items: order.items.map((item) =>
                item.id === itemId ? { ...item, dockId } : item
              ),
            }
          : order
      )
    );
  };

  const handlePaletteChange = (orderId: number, itemId: string, palette: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              items: order.items.map((item) =>
                item.id === itemId ? { ...item, palette } : item
              ),
            }
          : order
      )
    );
  };


  const handlePaletteClick = (palette: string, dockId: string) => {
    setSelectedPalette(palette);
    setSelectedDockId(dockId);

    const itemsInPalette = orders.flatMap((order) =>
      order.items.filter((item) => item.palette === palette && item.dockId === dockId)
    );

    setSelectedItems(itemsInPalette);
    setShowPopup(true);
  };

  return (
    <div className='flex h-screen w-full bg-neutral-900 text-neutral-50'>
      <div className='w-3/4 p-16'>
        <h1 className='text-3xl font-bold text-white mb-4'>Order</h1>
        <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700 rounded-lg overflow-hidden bg-gray-800'>
          <thead className='bg-gray-900 text-white'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>order_id</th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>items</th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>Quantities</th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>Unit</th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>Dock</th>
              <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>Palette</th>
            </tr>
          </thead>
          <tbody className='bg-gray-900 divide-y divide-gray-700 text-white'>
            {orders.map((order) => (
              <React.Fragment key={order.id}>
                {order.items.map((item, index) => (
                  <tr key={item.id} className='bg-gray-800 hover:bg-gray-700'>
                    {index === 0 && (
                      <td
                        rowSpan={order.items.length}
                        className='px-6 py-4 whitespace-nowrap text-sm font-medium'
                        style={{ verticalAlign: 'middle' }}
                      >
                        {order.id}
                      </td>
                    )}
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                      <input
                        type='text'
                        value={item.name}
                        readOnly
                        className='bg-gray-900 text-white rounded px-2 py-1'
                      />
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm'>{item.quantity}</td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm'>{item.unit}</td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm'>
                      <select
                        className='bg-gray-900 text-white rounded px-2 py-1'
                        value={item.dockId || ''}
                        onChange={(e) => handleDockChange(order.id, item.id, e.target.value)}
                      >
                        <option value=''>Select Dock</option>
                        {docks.map((dock) => (
                          <option key={dock.id} value={dock.id}>
                            {dock.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm'>
                      <select
                        className='bg-gray-900 text-white rounded px-2 py-1'
                        value={item.palette || ''}
                        onChange={(e) => handlePaletteChange(order.id, item.id, e.target.value)}
                      >
                        <option value=''>Select Palette</option>
                        {docks
                          .find((dock) => dock.id === item.dockId)
                          ?.palettes.map((palette, index) => (
                            <option key={index} value={palette}>
                              {palette}
                            </option>
                          ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <div className='w-1/4 p-16 bg-gray-800'>
        <h2 className='text-xl font-bold text-white mb-4'>DOCK</h2>
        <div className='space-y-8'>
          {docks.map((dock) => (
            <div key={dock.id} className='bg-gray-900 p-4 rounded'>
              <div className='grid grid-cols-4 gap-4'>
                {dock.palettes.map((palette, index) => (
                  <div
                    key={index}
                    onClick={() => handlePaletteClick(palette, dock.id)}
                    className={`${
                      palette ? 'bg-gray-600 text-white cursor-pointer text-xs' : 'border-2 border-dashed border-gray-500'
                    } text-center py-2`}
                  >
                    {palette || ''}
                  </div>
                ))}
              </div>
              <div className='text-center text-white mt-4'>{dock.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className='fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center'>
          <div className='bg-gray-900 p-6 rounded w-1/2'>
            <h2 className='text-xl font-bold text-white mb-4'>Selected Items for Palette: {selectedPalette}</h2>
            <ul>
              {selectedItems.length > 0 ? (
                selectedItems.map((item) => (
                  <li key={item.id} className='text-white mb-2'>
                    <div>Name: {item.name}</div>
                    <div>Quantity: {item.quantity}</div>
                    <div>Unit: {item.unit}</div>
                  </li>
                ))
              ) : (
                <li className='text-white'>No items found.</li>
              )}
            </ul>
            <button
              onClick={() => setShowPopup(false)}
              className='mt-4 px-4 py-2 bg-red-600 text-white rounded'
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;
