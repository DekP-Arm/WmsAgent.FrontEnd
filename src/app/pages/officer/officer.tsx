'use client';
import { useRouter } from "next/navigation";
import React from 'react';
import { Order, orders } from './order';

export function Officer() {
  const router = useRouter();

  // Function to handle the click event
  const handleRowClick = (orderId: string) => {
    router.push(`/pages/officer/${orderId}`);
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
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Quantities
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
                  {order.items.map((item, index) => (
                    <div key={index}>
                      {item.name}
                    </div>
                  ))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {order.items.map((item, index) => (
                    <div key={index}>
                      {item.quantity}
                    </div>
                  ))}
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

export default Officer;
