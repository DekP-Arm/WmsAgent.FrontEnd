'use client';
import React, { useEffect, useState } from 'react';
import { orders } from '../order'; // Adjust the path as necessary

interface Item {
  name: string;
  quantity: string;
}

interface Order {
  id: string;
  items: Item[];
  unit: string;
  startPoint: string;
  destination: string;

}

const OrderDetail = ({ params }: { params: { orderId: string } }) => {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const foundOrder = orders.find(order => order.id === params.orderId);
    setOrder(foundOrder || null);
  }, [params.orderId]);

  if (!order) {
    return (
      <div className='h-screen w-full bg-neutral-900 text-neutral-50 flex justify-center items-center'>
        <h1 className="text-3xl font-bold text-white mb-4">
          Loading...
        </h1>
      </div>
    );
  }

  return (
    <div className='h-screen w-full bg-neutral-900 text-neutral-50'>
      <div className="overflow-x-auto p-16 rounded-lg">
        <h1 className="text-3xl font-bold text-white mb-4">
          Order Details for {order.id}
        </h1>
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 rounded-lg overflow-hidden bg-gray-800">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-50 uppercase tracking-wider">
                Item
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-50 uppercase tracking-wider">
                Unit
              </th>

            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700 text-white">
            {order.items.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{item.quantity}</td>              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-8">
          <p className="text-xl mb-4">Start Point: {order.startPoint}</p>
          <p className="text-xl mb-4">Destination: {order.destination}</p>
        </div>
        {/* Add a 5x5 grid to show the shelf positions */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          {Array.from({ length: 8 }, (_, index) => (
            <div
              key={index}
              className={`border p-4 text-neutral-50 ${index < 2 ? 'bg-green-500' : 'bg-neutral-800'}`}
            >
              {index < 2 ? (
                <>
                  <p className="font-bold">{order.items[index]?.name}</p>
                  <p>Quantity: {order.items[index]?.quantity}</p>
                </>
              ) : (
                <p className="text-neutral-50"></p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
