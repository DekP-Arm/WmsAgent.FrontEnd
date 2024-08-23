import React, { useState } from "react";

interface Item {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  dockId?: string;
  paletteId?: string; // เปลี่ยนเป็น paletteId
  isAdded: boolean; // เพิ่มสถานะ isAdded
}

interface Order {
  id: number;
  items: Item[];
}

interface Palette {
  id: string;
  name: string;
}

interface Dock {
  id: string;
  name: string;
  palettes: Palette[];
}

const initialOrders: Order[] = [
  {
    id: 1,
    items: [
      { id: "item1", name: "ช้าง", quantity: 12, unit: "pac", isAdded: false },
      { id: "item2", name: "สิงห์", quantity: 13, unit: "pac", isAdded: false },
    ],
  },
  {
    id: 2,
    items: [
      { id: "item3", name: "ลีโอ", quantity: 14, unit: "pac", isAdded: false },
      {id: "item4",name: "อิชิตัน",quantity: 15,unit: "pac",isAdded: true,},
    ],
  },
];

const initialDocks: Dock[] = [
  {
    id: "dock1",
    name: "GroupAA",
    palettes: [
      { id: "palette1", name: "Palette 1" },
      { id: "palette2", name: "Palette 2" },
      { id: "palette3", name: "Palette 3" },
      { id: "palette4", name: "Palette 4" },
      { id: "palette5", name: "Palette 5" },
    ],
  },
  {
    id: "dock2",
    name: "GroupAB",
    palettes: [
      { id: "palette1", name: "Palette 1" },
      { id: "palette2", name: "Palette 2" },
    ],
  },
];

export function Orders2() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [docks] = useState<Dock[]>(initialDocks);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [selectedPaletteId, setSelectedPaletteId] = useState<string>("");
  const [selectedDockId, setSelectedDockId] = useState<string>("");

  const handleDockChange = (
    orderId: number,
    itemId: string,
    dockId: string,
  ) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              items: order.items.map((item) =>
                item.id === itemId
                  ? { ...item, dockId }
                  : item,
              ),
            }
          : order,
      ),
    );
  };

  const handlePaletteChange = (
    orderId: number,
    itemId: string,
    paletteId: string,
  ) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              items: order.items.map((item) =>
                item.id === itemId
                  ? { ...item, paletteId, isAdded: !!paletteId }
                  : item,
              ),
            }
          : order,
      ),
    );
  };

  const handlePaletteClick = (paletteId: string, dockId: string) => {
    setSelectedPaletteId(paletteId);
    setSelectedDockId(dockId);

    const itemsInPalette = orders.flatMap((order) =>
      order.items.filter(
        (item) => item.paletteId === paletteId && item.dockId === dockId,
      ),
    );

    setSelectedItems(itemsInPalette);
    setShowPopup(true);
  };

  return (
    <div className="flex h-screen w-full bg-neutral-900 text-neutral-50">
      <div className="w-3/4 p-16">
        <h1 className="mb-4 text-3xl font-bold text-white">Order</h1>
        <table className="min-w-full divide-y divide-gray-200 overflow-hidden rounded-lg bg-gray-800 dark:divide-gray-700">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                order_id
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Quantities
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Unit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Dock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Palette
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Status
              </th>{" "}
              {/* เพิ่มคอลัมน์สถานะ */}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 bg-gray-900 text-white">
            {orders.map((order) => (
              <React.Fragment key={order.id}>
                {order.items
                  .filter((item) => !item.isAdded) 
                  .map((item, index, filteredItems) => (
                    <tr key={item.id} className="bg-gray-800 hover:bg-gray-700">
                      {index === 0 && (
                        <td
                          rowSpan={filteredItems.length} 
                          className="whitespace-nowrap px-6 py-4 text-sm font-medium"
                          style={{ verticalAlign: "middle" }}
                        >
                          {order.id}
                        </td>
                      )}
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                        <input
                          type="text"
                          value={item.name}
                          readOnly
                          className="rounded bg-gray-900 px-2 py-1 text-white"
                        />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        {item.quantity}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        {item.unit}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <select
                          className="rounded bg-gray-900 px-2 py-1 text-white"
                          value={item.dockId || ""}
                          onChange={(e) =>
                            handleDockChange(order.id, item.id, e.target.value)
                          }
                        >
                          <option value="">Select Dock</option>
                          {docks.map((dock) => (
                            <option key={dock.id} value={dock.id}>
                              {dock.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <select
                          className="rounded bg-gray-900 px-2 py-1 text-white"
                          value={item.paletteId || ""}
                          onChange={(e) =>
                            handlePaletteChange(
                              order.id,
                              item.id,
                              e.target.value,
                            )
                          }
                        >
                          <option value="">Select Palette</option>
                          {docks
                            .find((dock) => dock.id === item.dockId)
                            ?.palettes.map((palette) => (
                              <option key={palette.id} value={palette.id}>
                                {palette.name}
                              </option>
                            ))}
                        </select>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        {item.isAdded ? "Added" : "Not Added"}
                      </td>
                    </tr>
                  ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <div className="w-1/4 bg-gray-800 p-16">
        <h2 className="mb-4 text-xl font-bold text-white">DOCK</h2>
        <div className="space-y-8">
          {docks.map((dock) => (
            <div key={dock.id} className="rounded bg-gray-900 p-4">
              <div className="grid grid-cols-4 gap-4">
                {dock.palettes.map((palette) => (
                  <div
                    key={palette.id}
                    onClick={() => handlePaletteClick(palette.id, dock.id)}
                    className={`${
                      palette
                        ? "cursor-pointer bg-gray-600 text-xs text-white"
                        : "border-2 border-dashed border-gray-500"
                    } py-2 text-center`}
                  >
                    {palette.name || ""}
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center text-white">{dock.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="w-1/2 rounded bg-gray-900 p-6">
            <h2 className="mb-4 text-xl font-bold text-white">
              Selected Items for Palette: {selectedPaletteId}
            </h2>
            <ul>
              {selectedItems.length > 0 ? (
                selectedItems.map((item) => (
                  <li key={item.id} className="mb-2 text-white">
                    <div>Name: {item.name}</div>
                    <div>Quantity: {item.quantity}</div>
                    <div>Unit: {item.unit}</div>
                    {/* แสดงสถานะ */}
                  </li>
                ))
              ) : (
                <li className="text-white">No items found.</li>
              )}
            </ul>
            <button
              onClick={() => setShowPopup(false)}
              className="mt-4 rounded bg-red-600 px-4 py-2 text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders2;
