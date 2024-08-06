// app/process/[id].tsx

'use client';

import { useRouter } from 'next/router';
import React from 'react';

interface Order {
  id: string;
  info: string;
  unit: string;
  startPoint: string;
  destination: string;
}

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

const Process = () => {
  const router = useRouter();
  const { id } = router.query;

  const order = orders.find(order => order.id === id);

  if (!order) {
    return <p>Order not found</p>;
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Task Officer - {order.id}</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <p className="text-lg"><strong>Order Info:</strong> {order.info}</p>
        <p className="text-lg"><strong>Unit:</strong> {order.unit}</p>
        <p className="text-lg"><strong>Start Point:</strong> {order.startPoint}</p>
        <p className="text-lg"><strong>Destination:</strong> {order.destination}</p>
      </div>
    </div>
  );
};

export default Process;
