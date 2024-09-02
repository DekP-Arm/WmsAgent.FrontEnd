import React, { useState, useMemo } from "react";
import { useTheme } from '~/app/_context/Theme'; // Adjust the import path accordingly

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

export default function Orders2() {
  const { isDarkMode, toggleTheme } = useTheme(); // Use the theme context
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(initialOrders);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [companyFilter, setCompanyFilter] = useState<string>('');
  const [warehouseFilter, setWarehouseFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleEdit = (order: Order) => {
    setCurrentOrder(order);
    setIsModalOpen(true);
  };

  const handleSave = () => {
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
  }, [companyFilter, warehouseFilter, dateFilter, searchTerm, orders]);

  const uniqueCompanies = useMemo(() => {
    const companies = new Set(orders.map(order => order.company));
    return Array.from(companies);
  }, [orders]);

  const uniqueWarehouses = useMemo(() => {
    const warehouses = new Set(orders.map(order => order.warehouse));
    return Array.from(warehouses);
  }, [orders]);

  return (
    <div className={`flex h-screen w-full ${isDarkMode ? 'bg-neutral-900 text-neutral-50' : 'bg-white text-black'}`}>
      <div className="w-3/4 p-16 mx-auto flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Order List</h1>
        </div>

        {/* Filters */}
        <div className="mb-4">
          <select
            name="companyFilter"
            value={companyFilter}
            onChange={handleChange}
            className={`mr-4 px-3 py-2 border rounded ${isDarkMode ? 'text-black' : 'text-black'}`}
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
            className={`mr-4 px-3 py-2 border rounded ${isDarkMode ? 'text-black' : 'text-black'}`}
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
            className={`mr-4 px-3 py-2 border rounded ${isDarkMode ? 'text-black' : 'text-black'}`}
          />
          <input
            type="text"
            name="searchTerm"
            value={searchTerm}
            onChange={handleChange}
            placeholder="Search..."
            className={`mr-4 px-3 py-2 border rounded ${isDarkMode ? 'text-black' : 'text-black'}`}
          />
        </div>

        {/* Orders Table */}
        <table className="min-w-full divide-y divide-gray-200 overflow-hidden rounded-lg">
          <thead className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">order_id</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">company</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">warehouse</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">CountOforder</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">date</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className={`${isDarkMode ? 'divide-gray-700 bg-gray-900 text-white' : 'divide-gray-300 bg-white text-black'}`}>
            {filteredOrders.map((order) => (
              <tr key={order.id} className={`${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">{order.id}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">{order.company}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">{order.warehouse}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">{order.countOdorder}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">{order.date}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <button
                    onClick={() => handleEdit(order)}
                    className={`px-4 py-2 rounded-3xl ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'} hover:bg-blue-600`}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal for Editing */}
        {isModalOpen && currentOrder && (
          <div className={`fixed inset-0 z-10 flex items-center justify-center ${isDarkMode ? 'bg-gray-900 bg-opacity-75' : 'bg-gray-200 bg-opacity-75'}`}>
            <div className={`bg-white rounded-lg p-8 shadow-lg ${isDarkMode ? 'text-black' : ''}`}>
              <h2 className="text-xl font-bold mb-4">Edit Order</h2>
              <label className="block mb-2">Company</label>
              <input
                type="text"
                name="company"
                value={currentOrder.company}
                onChange={handleChange}
                className="mb-4 w-full p-2 border rounded"
              />
              <label className="block mb-2">Warehouse</label>
              <input
                type="text"
                name="warehouse"
                value={currentOrder.warehouse}
                onChange={handleChange}
                className="mb-4 w-full p-2 border rounded"
              />
              <label className="block mb-2">Count Of Order</label>
              <input
                type="number"
                name="countOdorder"
                value={currentOrder.countOdorder}
                onChange={handleChange}
                className="mb-4 w-full p-2 border rounded"
              />
              <label className="block mb-2">Date</label>
              <input
                type="date"
                name="date"
                value={currentOrder.date}
                onChange={handleChange}
                className="mb-4 w-full p-2 border rounded"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  className={`mr-2 px-4 py-2 rounded-3xl ${isDarkMode ? 'bg-blue-400 text-black' : 'bg-blue-600 text-white'}`}
                >
                  Save
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className={`px-4 py-2 rounded-3xl ${isDarkMode ? 'bg-red-400 text-black' : 'bg-red-600 text-white'}`}
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
