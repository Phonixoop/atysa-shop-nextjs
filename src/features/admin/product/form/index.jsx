import React, { useEffect, useState } from "react";

// with
import withLabel from "ui/forms/with-label";
import withValidation from "ui/forms/with-validation";

//ui
import Button from "ui/buttons";
import WarningButton from "ui/buttons/warning";
import TextField from "ui/forms/text-field";
import IntegerField from "ui/forms/integer-field";
import MultiSelectBox from "ui/forms/multi-select";
import CheckBox from "ui/forms/checkbox";

import Upload from "ui/icons/upload";
import Modal from "ui/modals";

import ProductImage from "ui/product-image";
import GalleryView from "ui/gallery-view";
import Gallery from "features/admin/gallery";
import MaterialFields from "features/admin/material-fields";
import NutritionFields from "features/admin/nutrition-fields";

import withModal from "ui/modals/with-modal";
//icons

import { useQuery } from "@tanstack/react-query";

//api
import { getCategories } from "api";
import BlurImage from "ui/blur-image";

// data
import { DAYS } from "data";

//validations
import { isEnglish, isEmpty } from "validations";

const TextFieldWithLabel = withLabel(TextField);
const IntegerWithLabel = withLabel(IntegerField);

const TextFieldWithValidation = withValidation(TextFieldWithLabel);
const IntegerFieldWithValidation = withValidation(IntegerWithLabel);

const GalleryWithModal = withModal(Gallery);

export default function ProductForm({
  formData = undefined,
  isLoading = false,
  onDelete = () => {},
  onSubmit = () => {},
}) {
  const { data: categories } = useQuery(["categories"], () => getCategories(), {
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    cacheTime: 0,
  });

  const [productForm, setProductForm] = useState(formData);
  const [validations, setValidations] = useState({
    slug: [""],
    name: [""],
  });

  const canSubmit =
    Object.entries(validations)
      .map(([_, value]) => {
        return value.length;
      })
      .reduce((a, b) => {
        return a + b;
      }, 0) <= 0 && isLoading === false;

  const productImages =
    productForm.images && productForm.defaultImage
      ? [productForm.defaultImage, ...productForm.images]
      : productForm.defaultImage
      ? [productForm.defaultImage]
      : [];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(productForm);
      }}
      className={`flex flex-col justify-center items-start w-full py-5 gap-5 ${
        isLoading ? "opacity-50" : ""
      }`}
    >
      <div className="w-full flex-1">
        <TextFieldWithValidation
          isRtl={false}
          label="پیوند"
          value={productForm.slug}
          validations={[isEmpty, isEnglish]}
          onValidation={(value) =>
            setValidations((prev) => {
              return { ...prev, slug: value };
            })
          }
          onChange={(value) =>
            setProductForm((prev) => {
              const parsedValue = value.trimLeft().replace(" ", "-");
              return { ...prev, ...{ slug: parsedValue } };
            })
          }
          disabled={isLoading}
        />
      </div>

      <div className="flex flex-col desktopMin:flex-row w-full justify-start items-stretch gap-5">
        <div className="flex flex-col w-full desktopMin:w-1/2 gap-5 flex-1 ">
          <div className="flex-1">
            <TextFieldWithValidation
              label="نام"
              value={productForm.name}
              validations={[isEmpty]}
              onValidation={(value) =>
                setValidations((prev) => {
                  return { ...prev, name: value };
                })
              }
              onChange={(value) =>
                setProductForm((prev) => {
                  return { ...prev, ...{ name: value } };
                })
              }
              disabled={isLoading}
            />
          </div>
          <div className="flex-1">
            <TextFieldWithValidation
              label="توضیحات"
              value={productForm.description}
              onChange={(value) =>
                setProductForm((prev) => {
                  return { ...prev, ...{ description: value } };
                })
              }
              disabled={isLoading}
            />
          </div>
          <div className="flex-1">
            <IntegerFieldWithValidation
              label="قیمت"
              value={productForm.price}
              onChange={(value) =>
                setProductForm((prev) => {
                  return { ...prev, ...{ price: value } };
                })
              }
              disabled={isLoading}
            />
          </div>
          <div className="flex-1">
            <IntegerFieldWithValidation
              label="کالری"
              value={productForm.calories}
              onChange={(value) =>
                setProductForm((prev) => {
                  return { ...prev, ...{ calories: value } };
                })
              }
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="flex laptopMax:relative laptopMax:overflow-hidden justify-center items-center  border-dashed border-gray-400 border-2 h-20 desktopMin:h-auto flex-1  rounded-xl">
          <GalleryModal
            srcs={productImages}
            onChange={(selectedImageUrls) => {
              if (selectedImageUrls.length <= 0) return;
              setProductForm((prev) => {
                return {
                  ...prev,
                  ...{
                    defaultImage: selectedImageUrls[0],
                    images: selectedImageUrls.slice(
                      1,
                      selectedImageUrls.length
                    ),
                  },
                };
              });
            }}
          />
        </div>
      </div>

      <div className="flex w-full justify-start items-center text-right">
        <CheckBox
          value={productForm.isActive}
          onChange={(value) => {
            setProductForm((prev) => {
              return { ...prev, ...{ isActive: value } };
            });
          }}
        >
          active :
        </CheckBox>
      </div>
      <div>
        {!!categories && (
          <MultiSelectBox
            values={productForm?.categories?.map((item) => item.id)}
            list={categories.map((item) => {
              return {
                key: item.id,
                value: item.name,
              };
            })}
            onChange={(values) =>
              setProductForm((prev) => {
                return { ...prev, ...{ category_ids: values } };
              })
            }
          />
        )}
      </div>

      <MultiSelectBox
        className="bg-atysa-900 text-white shadow-2xl shadow-atysa-900"
        values={productForm?.deliver_period?.availableDaysOfWeek?.filter(
          (item) => {
            return Object.entries(DAYS).filter(([key, value]) => item === key);
          }
        )}
        list={Object.entries(DAYS)
          .reverse()
          .map(([key, value]) => {
            return {
              key,
              value,
            };
          })}
        onChange={(values) => {
          setProductForm((prev) => {
            return {
              ...prev,
              ...{
                deliver_period: {
                  ...prev?.deliver_period,
                  availableDaysOfWeek: values,
                },
              },
            };
          });
        }}
      />
      <IntegerWithLabel
        label="موجودی"
        value={productForm?.available_quantity}
        onChange={(value) => {
          setProductForm((prev) => {
            return {
              ...prev,
              available_quantity: value,
            };
          });
        }}
      />
      <div
        dir="rtl"
        className="flex  justify-start items-center gap-5 w-full py-5"
      >
        <TextFieldWithLabel
          label="نوع وعده"
          value={productForm?.meal_type}
          onChange={(value) => {
            setProductForm((prev) => {
              return {
                ...prev,
                meal_type: value,
              };
            });
          }}
        />
        {["صبحانه", "ناهار", "شام", "اسنک", "میان وعده"].map((mealType) => {
          return (
            <>
              <button
                type="button"
                className="bg-atysa-primary text-atysa-main rounded-full w-fit px-2 py-1"
                onClick={() => {
                  setProductForm((prev) => {
                    return {
                      ...prev,
                      meal_type: mealType,
                    };
                  });
                }}
              >
                {mealType}
              </button>
            </>
          );
        })}
      </div>

      <IntegerWithLabel
        label="تاخیر در ارسال سفارش (به ساعت)"
        value={productForm?.deliver_period?.delay}
        onChange={(value) => {
          setProductForm((prev) => {
            return {
              ...prev,
              ...{
                deliver_period: {
                  ...prev?.deliver_period,
                  delay: value,
                },
              },
            };
          });
        }}
      />
      <div className="w-full flex-col gap-5 flex justify-center items-center py-10 bg-gray-200 rounded-xl">
        <h3 className="text-atysa-900">مواد تشکیل دهنده</h3>
        <div className="flex justify-center items-center w-[500px]">
          <MaterialFields
            values={
              !!productForm.materials || productForm.materials?.length > 0
                ? productForm.materials
                : []
            }
            onChange={(materials) => {
              setProductForm((prev) => {
                return { ...prev, materials };
              });
            }}
          />
        </div>
      </div>

      <div className="w-full flex-col gap-5 flex justify-center items-center py-10 bg-gray-200 rounded-xl">
        <h3 className="text-atysa-900">KCLP</h3>
        <div className="flex justify-center items-center w-[500px]">
          <NutritionFields
            values={
              !!productForm.nutritions || productForm.nutritions?.length > 0
                ? productForm.nutritions
                : []
            }
            onChange={(nutritions) => {
              setProductForm((prev) => {
                return { ...prev, nutritions };
              });
            }}
          />
        </div>
      </div>

      <Button
        className="bg-atysa-main "
        disabled={!canSubmit}
        isLoading={isLoading}
        type="submit"
      >
        ثبت
      </Button>

      {!!productForm.id && (
        <WarningButton
          type="button"
          disabled={false}
          isLoading={isLoading}
          onClick={() => onDelete(productForm.id)}
        >
          حذف
        </WarningButton>
      )}
    </form>
  );
}

function GalleryModal({ srcs = [], onChange = () => {} }) {
  const [showGalleryModela, setShowGalleryModal] = useState(false);
  return (
    <>
      <div
        className="flex flex-col gap-2 justify-center items-center cursor-pointer"
        disabled={true}
        onClick={() => setShowGalleryModal(true)}
      >
        <div className="flex flex-wrap justify-end">
          {srcs.map((src, i) => {
            return <BlurImage key={i} width={40} height={40} src={src} />;
          })}
        </div>
        {srcs.length <= 0 && (
          <>
            گالری
            <Upload />
          </>
        )}
      </div>
      <Modal
        isOpen={showGalleryModela}
        onClose={() => setShowGalleryModal(false)}
        size="lg"
        center
        title="انتخاب عکس محصول"
      >
        <div className=" flex flex-grow w-full h-full justify-center overflow-y-auto">
          <div className="flex flex-1  px-10 flex-grow justify-center items-start">
            <Gallery
              initialValues={[]}
              onChange={(files) => onChange(files.map((a) => a.url))}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}

// function SelectCategories({
//   initialCategories = [],
//   categories = [],
//   onChange = () => {},
// }) {
//   const [selectedCategory, setSelectedCategory] = useState([]);
//   return (
//     <div className="flex gap-2">
//       <MultiBox
//         initialKeys={initialCategories}
//         list={categories}
//         multiple={true}
//         onChange={(selectedCategories) => {
//           onChange(selectedCategories);
//         }}
//         onClick={(category) => {
//           console.log(category);
//         }}
//         onContextMenu={(category) => {}}
//         renderItem={(category, selected) => {
//           return (
//             <div
//               className={`${
//                 selected ? "bg-atysa-200 text-black scale-105" : ""
//               }   p-2 rounded-lg cursor-pointer hover:scale-105 text-center`}
//             >
//               {category.name}
//             </div>
//           );
//         }}
//       />
//     </div>
//   );
// }
