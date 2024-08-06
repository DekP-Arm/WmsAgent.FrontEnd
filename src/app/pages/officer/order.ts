export interface Item {
    name: string;
    quantity: string;
  }
  
  export interface Order {
    id: string;
    items: Item[];
    unit: string;
    startPoint: string;
    destination: string;
  }
  
  export const orders: Order[] = [
    {
      id: 'A109',
      items: [
        { name: 'Oishi', quantity: '3 bottles' },
        { name: 'Singha', quantity: '2 bottles' },
      ],
      unit: '2 palettes',
      startPoint: 'Dock A',
      destination: 'TB1000-1001',
    },
    {
      id: 'B203',
      items: [
        { name: 'Pepsi', quantity: '4 cans' },
        { name: 'Sprite', quantity: '1 can' },
      ],
      unit: '3 palettes',
      startPoint: 'Dock B',
      destination: 'TB2000-2001',
    },
    {
      id: 'C307',
      items: [
        { name: 'Red Bull', quantity: '5 cans' },
        { name: 'Monster', quantity: '2 cans' },
      ],
      unit: '4 palettes',
      startPoint: 'Dock C',
      destination: 'TB3000-3001',
    },
    {
      id: 'D408',
      items: [
        { name: 'Water', quantity: '10 bottles' },
      ],
      unit: '5 palettes',
      startPoint: 'Dock B',
      destination: 'TB4000-4004',
    },
    {
      id: 'E509',
      items: [
        { name: 'Juice', quantity: '8 bottles' },
      ],
      unit: '4 palettes',
      startPoint: 'Dock C',
      destination: 'TB5000-5005',
    },
  ];
  