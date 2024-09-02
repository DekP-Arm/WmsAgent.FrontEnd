import React, { useState, useMemo } from "react";

interface Order {
  id: number;
  company: string;
  warehouse: string;
  countOdorder: number;
  date: string;
}

const initialOrders: Order[] = [
  { id: 1, company: 'thaibev', warehouse: 'warehouse A', countOdorder: 13, date: '2023-07-14' },
  { id: 2, company: 'Oishi', warehouse: 'warehouse B', countOdorder: 132, date: '2023-08-20' },
  { id: 3, company: 'Singha', warehouse: 'warehouse C', countOdorder: 11, date: '2023-08-20' },
  { id: 4, company: 'Oishi', warehouse: 'warehouse D', countOdorder: 12, date: '2023-08-20' },
  { id: 5, company: 'Oishi', warehouse: 'warehouse E', countOdorder: 11, date: '2024-08-20' },
  { id: 6, company: 'Change', warehouse: 'warehouse F', countOdorder: 41, date: '2023-08-20' },
];

export function Orders2() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(initialOrders);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [companyFilter, setCompanyFilter] = useState<string>('');
  const [warehouseFilter, setWarehouseFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');


  // const fetchOrders = async () => {
  //   try {
  //     const response = await fetch('/api/orders'); 
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }
  //     const data: Order[] = await response.json();
  //     setOrders(data);
  //     setFilteredOrders(data);
  //   } catch (error) {
  //     console.error('Error fetching orders:', error);
  //   }
  // };


  const handleEdit = (order: Order) => {
    setCurrentOrder(order);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    console.log(currentOrder);
    if (currentOrder) {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === currentOrder.id ? currentOrder : order
        )
      );
      setIsModalOpen(false);
      setCurrentOrder(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "companyFilter") {
      setCompanyFilter(value);
    } else if (name === "warehouseFilter") {
      setWarehouseFilter(value);
    } else if (name === "dateFilter") {
      setDateFilter(value);
    } else if (name === "searchTerm") {
      setSearchTerm(value);
    } else if (currentOrder) {
      setCurrentOrder({
        ...currentOrder,
        [name]: value,
      });
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    if (companyFilter) {
      filtered = filtered.filter(order => order.company.includes(companyFilter));
    }
    if (warehouseFilter) {
      filtered = filtered.filter(order => order.warehouse.includes(warehouseFilter));
    }
    if (dateFilter) {
      filtered = filtered.filter(order => order.date === dateFilter);
    }
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.warehouse.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  };

  React.useEffect(() => {
    filterOrders();
    // fetchOrders();
  }, [companyFilter, warehouseFilter, dateFilter, searchTerm, orders]);

  // Memoized values for filter options
  const uniqueCompanies = useMemo(() => {
    const companies = new Set(orders.map(order => order.company));
    return Array.from(companies);
  }, [orders]);

  const uniqueWarehouses = useMemo(() => {
    const warehouses = new Set(orders.map(order => order.warehouse));
    return Array.from(warehouses);
  }, [orders]);

  return (
    <div className="flex h-screen w-full bg-neutral-900 text-neutral-50">
      <div className="w-3/4 p-16 mx-auto flex flex-col">
        <h1 className="mb-4 text-3xl font-bold text-white">OrderList</h1>
        <div className="mb-4">
          <select
            name="companyFilter"
            value={companyFilter}
            onChange={handleChange}
            className="mr-4 px-3 py-2 border rounded text-black"
          >
            <option value="">Select Company</option>
            {uniqueCompanies.map(company => (
              <option key={company} value={company}>{company}</option>
            ))}
          </select>
          <select
            name="warehouseFilter"
            value={warehouseFilter}
            onChange={handleChange}
            className="mr-4 px-3 py-2 border rounded text-black"
          >
            <option value="">Select Warehouse</option>
            {uniqueWarehouses.map(warehouse => (
              <option key={warehouse} value={warehouse}>{warehouse}</option>
            ))}
          </select>
          <input
            type="date"
            name="dateFilter"
            value={dateFilter}
            onChange={handleChange}
            className="mr-4 px-3 py-2 border rounded text-black"
          />
                    <input
            type="text"
            name="searchTerm"
            value={searchTerm}
            onChange={handleChange}
            placeholder="Search..."
            className="mr-4 px-3 py-2 border rounded text-black"
          />
        </div>
        <table className="min-w-full divide-y divide-gray-200 overflow-hidden rounded-lg bg-gray-800 dark:divide-gray-700">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">order_id</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">company</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">warehouse</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">CountOforder</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">date</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 bg-gray-900 text-white">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="bg-gray-800 hover:bg-gray-700">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">{order.id}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">{order.company}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">{order.warehouse}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">{order.countOdorder}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">{order.date}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <button
                    onClick={() => handleEdit(order)}
                    className="px-4 py-2 bg-white text-black rounded-3xl hover:bg-blue-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487l3.65 3.65m-.53 1.943l-7.82 7.82-4.285.713.714-4.285 7.82-7.82m2.12-2.121l2.12-2.12m-2.12 2.12l2.121 2.121" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal for Editing */}
        {isModalOpen && currentOrder && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-80">
              <h3 className="text-xl font-semibold mb-4">Edit Order</h3>
              <input
                type="text"
                name="company"
                value={currentOrder.company}
                onChange={handleChange}
                placeholder="Company"
                className="w-full mb-2 px-3 py-2 border rounded text-black"
              />
              <input
                type="text"
                name="warehouse"
                value={currentOrder.warehouse}
                onChange={handleChange}
                placeholder="Warehouse"
                className="w-full mb-2 px-3 py-2 border rounded text-black"
              />
              <input
                type="number"
                name="countOdorder"
                value={currentOrder.countOdorder}
                onChange={handleChange}
                placeholder="Count of Order"
                className="w-full mb-2 px-3 py-2 border rounded text-black"
              />
              <input
                type="date"
                name="date"
                value={currentOrder.date}
                onChange={handleChange}
                placeholder="Date"
                className="w-full mb-4 px-3 py-2 border rounded text-black"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-500 text-white rounded mr-2 hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders2;
