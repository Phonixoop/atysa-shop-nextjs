import { useTable, useSortBy } from "react-table";

export default function Table({ columns, data }) {
  const tableInstance = useTable({ columns, data }, useSortBy);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <>
      <div className="flex justify-center items-center w-full h-full">
        <div className="w-9/12 overflow-auto rounded-[20px]">
          <table {...getTableProps()} className=" w-full text-center">
            <thead>
              {
                // Loop over the header rows
                headerGroups.map((headerGroup) => {
                  const { key, ...restHeaderGroupProps } =
                    headerGroup.getHeaderGroupProps();

                  return (
                    <tr
                      className="text-center"
                      key={key}
                      {...restHeaderGroupProps}
                    >
                      {
                        // Loop over the headers in each row
                        headerGroup.headers.map((column) => {
                          const { key, ...restHeaderProps } =
                            column.getHeaderProps(
                              column.getSortByToggleProps()
                            );
                          return (
                            <th
                              key={key}
                              {...restHeaderProps}
                              className="text-center font-black text-black px-6 py-3 bg-gray-50  text-xs leading-4 tracking-wider"
                            >
                              <div className="text-center select-none">
                                {
                                  // Render the header
                                  column.render("Header")
                                }

                                {column.isSorted
                                  ? column.isSortedDesc
                                    ? "🔻"
                                    : "🔺"
                                  : ""}
                              </div>
                            </th>
                          );
                        })
                      }
                    </tr>
                  );
                })
              }
            </thead>
            {/* Apply the table body props */}
            <tbody
              {...getTableBodyProps()}
              className="bg-white divide-y divide-gray-200"
            >
              {
                // Loop over the table rows
                rows.map((row) => {
                  // Prepare the row for display
                  prepareRow(row);
                  const { key, ...restRowProps } = row.getRowProps();
                  return (
                    // Apply the row props
                    <tr key={key} {...restRowProps}>
                      {
                        // Loop over the rows cells
                        row.cells.map((cell) => {
                          const { key, ...restCellProps } = cell.getCellProps();
                          // Apply the cell props
                          return (
                            <td
                              key={key}
                              {...restCellProps}
                              className="px-6 py-4 whitespace-no-wrap text-sm leading-5 font-medium text-gray-900"
                            >
                              {
                                // Render the cell contents
                                cell.render("Cell")
                              }
                            </td>
                          );
                        })
                      }
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
