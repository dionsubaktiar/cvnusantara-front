import React from "react";

const HorizontalScrollTable = () => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 rounded-md">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Header 1
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Header 2
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Header 3
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Header 4
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Header 5
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Header 6
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Header 7
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <tr>
            <td className="px-6 py-4 whitespace-nowrap">Data 1</td>
            <td className="px-6 py-4 whitespace-nowrap">Data 2</td>
            <td className="px-6 py-4 whitespace-nowrap">Data 3</td>
            <td className="px-6 py-4 whitespace-nowrap">Data 4</td>
            <td className="px-6 py-4 whitespace-nowrap">Data 5</td>
            <td className="px-6 py-4 whitespace-nowrap">Data 6</td>
            <td className="px-6 py-4 whitespace-nowrap">Data 7</td>
          </tr>
          {/* Add more rows as needed */}
        </tbody>
      </table>
    </div>
  );
};

export default HorizontalScrollTable;
