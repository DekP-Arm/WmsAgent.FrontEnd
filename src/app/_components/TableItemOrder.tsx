
interface TableItemOrderProps {
    product: string;
    Qty: number;
    Weight: number;
    Unit: string;
}

interface ListItemsInTableProps{
    items: TableItemOrderProps[];
}

export function TableItemOrder ({items} : ListItemsInTableProps) 
{

    
    
    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rounded-lg rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="rounded-lg text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Product name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Qty
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Weight (kg)
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Unit
                        </th>
                        {/* <th scope="col" className="px-6 py-3">
                            Price
                        </th> */}
                        <th scope="col" className="px-6 py-3">
                            <span className="sr-only">Edit</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        {items.map((item,index) => (
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {item.product}
                                </th>
                                <td className="px-6 py-4">
                                    {item.Qty}
                                </td>
                                <td className="px-6 py-4">
                                    {item.Weight}
                                </td>
                                <td className="px-6 py-4">
                                    {item.Unit}
                                </td>
                                <td className="px-6 py-4">
                                    <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}