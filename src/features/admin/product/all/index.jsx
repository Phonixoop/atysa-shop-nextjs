import { useEffect, useState } from "react";
import Link from "next/link";

import { useRouter } from "next/router";
import { useTable } from "react-table";

import Modal from "@/ui/modals";

import ProductDetails from "@/features/admin/product/details";

export default function ProductAll({ columns, data }) {
  const router = useRouter();

  function handleCloseModal() {
    setIsRefreshing(true);
    router.replace("/admin/products");
  }

  if (!!!data)
    return "can't load table , there is probebly no internet available";
  const tableInstance = useTable({ columns, data });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;
  const [isRefreshing, setIsRefreshing] = useState(false);
  useEffect(() => {
    setIsRefreshing(false);
  }, [data]);
  return (
    <>
      <div className="flex w-full h-full justify-center items-center">
        <div className="w-6/12 overflow-hidden rounded-[20px]">
          {isRefreshing ? (
            <TableSkeleton />
          ) : (
            <table {...getTableProps()} className=" w-full text-center">
              <thead>
                {
                  // Loop over the header rows
                  headerGroups.map((headerGroup) => (
                    // Apply the header row props
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {
                        // Loop over the headers in each row
                        headerGroup.headers.map((column) => (
                          // Apply the header cell props
                          <th
                            {...column.getHeaderProps()}
                            className="text-center px-6 py-3 bg-gray-50  text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {
                              // Render the header
                              column.render("Header")
                            }
                          </th>
                        ))
                      }
                    </tr>
                  ))
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
                    return (
                      // Apply the row props
                      <tr {...row.getRowProps()}>
                        {
                          // Loop over the rows cells
                          row.cells.map((cell) => {
                            // Apply the cell props
                            return (
                              <td
                                {...cell.getCellProps()}
                                className="px-6 py-4 whitespace-no-wrap text-sm leading-5 font-medium text-gray-900"
                              >
                                <Link
                                  href={`/admin/products/?slug=${cell.row.original.slug}`}
                                  as={`/admin/products/${cell.row.original.slug}`}
                                >
                                  <button>
                                    {
                                      // Render the cell contents
                                      cell.render("Cell")
                                    }
                                  </button>
                                </Link>
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
          )}
        </div>
      </div>

      <Modal isOpen={!!router.query.slug} onClose={handleCloseModal}>
        <div className="flex flex-grow w-full justify-center overflow-y-auto">
          <div className="flex flex-1 p-10 flex-grow justify-center items-start">
            <ProductDetails slug={router.query.slug} />
            {/* <MyForm form={catForm.current} /> */}
          </div>
        </div>
      </Modal>
    </>
  );
}
function TableSkeleton() {
  return (
    <>
      <div className="flex flex-col justify-center items-center gap-5">
        <div className="w-full h-6 bg-gray-400 animate-pulse"></div>
        <div className="w-full h-6 bg-gray-400 animate-pulse"></div>
        <div className="w-full h-6 bg-gray-400 animate-pulse"></div>
        <div className="w-full h-6 bg-gray-400 animate-pulse"></div>
        <div className="w-full h-6 bg-gray-400 animate-pulse"></div>
      </div>
    </>
  );
}
