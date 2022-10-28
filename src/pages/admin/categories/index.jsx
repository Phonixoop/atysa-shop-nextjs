import React, { useMemo, useState } from "react";
import Link from "next/link";
import AdminLayout from "layouts/adminLayout";
import List from "ui/list";
import { prisma } from "modules/prisma";
import { jsonify } from "@/utils";
import { useTable } from "react-table";
import XIcon from "@/ui/icons/xicon";
import Modal from "@/ui/modals";
// with
import withLabel from "@/ui/froms/with-label";
import withValidation from "@/ui/froms/with-validation";

//ui
import TextField from "@/ui/froms/text-field";
import IntegerField from "@/ui/froms/integer-field";

const TextFieldWithLabel = withLabel(TextField);
const IntegerFieldWithLabel = withLabel(IntegerField);

const TextFieldWithValidation = withValidation(TextFieldWithLabel);
const IntegerFieldwithValidation = withValidation(IntegerFieldWithLabel);

// const categoryForm = {
//   name: "ویرایش دسته بندی",
//   fields: [
//     {
//       id: "0",
//       label: "نام",
//       value: "",
//       Component: TextFieldWithValidation,
//       validations: [isFilled],
//     },
//     {
//       id: "2",
//       label: "پیوند",
//       value: "",
//       Component: TextFieldWithValidation,
//     },
//     {
//       id: "3",
//       label: "توضیحات",
//       value: "",
//       Component: TextFieldWithValidation,
//     },
//   ],
// };

export default function CategoriesPage({ categories = [] }) {
  const columns = useMemo(
    () => [
      {
        Header: "نام",
        accessor: "name",
      },
      {
        Header: "پیوند",
        accessor: "slug",
      },
      {
        Header: "تعداد محصول",
        accessor: "product_ids",
        Cell: ({ row }) => {
          const data = row.original;
          return data.product_ids.length;
        },
      },
    ],
    []
  );
  const data = useMemo(() => categories, []);

  return (
    <div className="flex w-full h-full justify-center items-center">
      <div className="w-6/12 overflow-hidden rounded-[20px]">
        <Table {...{ columns, data }} />
      </div>
    </div>
  );
}

function Table({ columns, data }) {
  const isFilled = (text) =>
    text?.lenght > 0 ? "" : "این فیلد نباید خالی باشد";

  let categoryForm = {
    fields: [],
  };
  const catForm = React.useRef();
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const tableInstance = useTable({ columns, data });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;
  return (
    <>
      <div className="flex w-full h-full justify-center items-center">
        <div className="w-6/12 overflow-hidden rounded-[20px]">
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
                              <button
                                onClick={() => {
                                  categoryForm.fields = [];
                                  catForm.current = [];

                                  Object.entries(data[0]).map(
                                    ([key, value], index) => {
                                      return catForm.current.push({
                                        label: key,
                                        value,
                                        Component: TextFieldWithValidation,
                                        validations: [isFilled],
                                      });
                                    }
                                  );

                                  setShowCategoryModal(true);
                                }}
                              >
                                {
                                  // Render the cell contents
                                  cell.render("Cell")
                                }
                              </button>
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

      <Modal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex gap-6 flex-col justify-center items-center bg-gray-50 w-11/12 md:w-6/12 h-5/6 absolute z-[200] top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2  rounded-xl overflow-hidden "
        >
          <div className="flex justify-end pr-6 items-center h-6  w-full">
            <button
              onClick={() => setShowCategoryModal(false)}
              className="flex justify-center first-letter:items-center"
            >
              <XIcon />
            </button>
          </div>
          <div className="flex flex-grow w-full justify-center overflow-y-auto">
            <div className="flex flex-1 p-10 flex-grow justify-center items-start ">
              <MyForm form={catForm.current} />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

function MyForm({ children, form = {}, onSubmit = () => {} }) {
  const [data, setData] = useState(form);
  console.log(data);
  return (
    <form className="w-full flex flex-col gap-4" onSubmit={onSubmit(data)}>
      {form?.map(({ label, value, validations, Component }, index) => {
        return (
          <>
            <Component
              key={index}
              label={label}
              value={data[index].value}
              validations={validations}
              onValidation={(validations) =>
                setData(
                  data.map((field) => {
                    if (field.id != data[index].id) return field;
                    console.log(data[index]);
                    return {
                      ...field,
                      validations,
                    };
                  })
                )
              }
              onChange={(value) =>
                setData(
                  data.map((field) => {
                    if (field.id != data[index].id) return field;
                    console.log(data[index]);
                    return {
                      ...field,
                      value,
                    };
                  })
                )
              }
            />
          </>
        );
      })}
    </form>
  );
}

export async function getServerSideProps() {
  const categories = jsonify(await prisma.category.findMany());
  console.log(categories.lenght);
  return { props: { categories } };
}

CategoriesPage.PageLayout = AdminLayout;
