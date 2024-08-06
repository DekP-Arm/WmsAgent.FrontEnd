'use client';
import { useRouter } from "next/navigation";
import React from 'react';

interface Order {
  id: string;
  info: string;
  unit: string;
  startPoint: string;
  destination: string;
}

export function Officer() {

    const router = useRouter();
  // Sample order data
  const orders: Order[] = [
    {
      id: 'Order A109',
      info: 'Oishi x3, Singha x2',
      unit: '2 palettes',
      startPoint: 'AS1000-3013',
      destination: 'TB1000-1001',
    },
    {
      id: 'Order B203',
      info: 'Pepsi x4, Sprite x1',
      unit: '3 palettes',
      startPoint: 'AS2000-3023',
      destination: 'TB2000-2001',
    },
    {
      id: 'Order C307',
      info: 'Red Bull x5, Monster x2',
      unit: '4 palettes',
      startPoint: 'AS3000-3033',
      destination: 'TB3000-3001',
    },
    {
      id: 'Order D408',
      info: 'Water x10',
      unit: '5 palettes',
      startPoint: 'AS4000-4044',
      destination: 'TB4000-4004',
    },
    {
      id: 'Order E509',
      info: 'Juice x8',
      unit: '4 palettes',
      startPoint: 'AS5000-5055',
      destination: 'TB5000-5005',
    },
    {
      id: 'Order F610',
      info: 'Snack x12',
      unit: '6 palettes',
      startPoint: 'AS6000-6066',
      destination: 'TB6000-6006',
    },
    {
      id: 'Order G711',
      info: 'Beer x7, Chips x4',
      unit: '3 palettes',
      startPoint: 'AS7000-7077',
      destination: 'TB7000-7007',
    },
    {
      id: 'Order H812',
      info: 'Tea x5',
      unit: '2 palettes',
      startPoint: 'AS8000-8088',
      destination: 'TB8000-8008',
    },
    {
      id: 'Order I913',
      info: 'Coffee x6',
      unit: '3 palettes',
      startPoint: 'AS9000-9099',
      destination: 'TB9000-9009',
    },
    {
      id: 'Order J014',
      info: 'Energy Drink x4',
      unit: '2 palettes',
      startPoint: 'AS10000-10010',
      destination: 'TB10000-10010',
    },
  ];

  // Function to handle the click event
  const handleRowClick = (orderId: string) => {
    const confirmed = window.confirm(`Are you sure you want to proceed with ${orderId}?`);
    if (confirmed) {
      // Redirect to the task management page
      router.push(`/process/${orderId}`);
    }
  };


  return (
    <div className='h-screen w-full bg-neutral-900 text-neutral-50'>
     <div className="overflow-x-auto p-16 rounded-lg">
      <h1 className="text-3xl font-bold text-white mb-4">
        Task Officer
      </h1>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 rounded-lg overflow-hidden bg-gray-800">
        <thead className="bg-gray-900 text-white">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Order Id
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Order Info.
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Unit
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              StartPoint
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Destination
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-700 text-white">
          {orders.map((order) => (
            <tr
              key={order.id}
              className="bg-gray-800 hover:bg-gray-700 cursor-pointer"
              onClick={() => handleRowClick(order.id)}
              role="button"
              tabIndex={0}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {order.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {order.info}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {order.unit}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {order.startPoint}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {order.destination}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
}
