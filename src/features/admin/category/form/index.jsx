import React, { useState } from "react";

// with
import withLabel from "@/ui/forms/with-label";
import withValidation from "@/ui/forms/with-validation";

//ui
import Button from "@/ui/buttons";
import WarningButton from "@/ui/buttons/warning";
import TextField from "@/ui/forms/text-field";
import CheckBox from "@/ui/forms/checkbox";

const TextFieldWithLabel = withLabel(TextField);
const TextFieldWithValidation = withValidation(TextFieldWithLabel);

//icons
import Upload from "@/ui/icons/upload";

const isEmpty = (text) =>
  text?.length > 0 ? "" : "این فیلد نباید خالی رها شود";
const isEnglish = (text) =>
  !(text.match(/^[a-zA-Z0-9-]+$/) === null)
    ? ""
    : "فقط عدد و حروف انگلیسی مجاز است";

export default function ProductForm({
  formData = undefined,
  isLoading = false,
  onDelete = () => {},
  onSubmit = () => {},
}) {
  const [categoryForm, setCategoryForm] = useState(formData);
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

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(categoryForm);
      }}
      className={`flex flex-col justify-center items-end w-full gap-5 ${
        isLoading ? "opacity-50" : ""
      }`}
    >
      <div className="w-full flex-1">
        <TextFieldWithValidation
          isRtl={false}
          label="پیوند"
          value={categoryForm.slug}
          validations={[isEmpty, isEnglish]}
          onValidation={(value) =>
            setValidations((prev) => {
              return { ...prev, slug: value };
            })
          }
          onChange={(value) =>
            setCategoryForm((prev) => {
              const parsedValue = value.trimLeft().replace(" ", "-");
              return { ...prev, ...{ slug: parsedValue } };
            })
          }
          disabled={isLoading}
        />
      </div>
      <div
        dir="rtl"
        className="flex flex-col desktopMin:flex-row w-full justify-start items-stretch gap-5"
      >
        <div className="flex flex-col w-full desktopMin:w-1/2 gap-5 flex-1 ">
          <div className="flex-1">
            <TextFieldWithValidation
              label="نام"
              value={categoryForm.name}
              validations={[isEmpty]}
              onValidation={(value) =>
                setValidations((prev) => {
                  return { ...prev, name: value };
                })
              }
              onChange={(value) =>
                setCategoryForm((prev) => {
                  return { ...prev, ...{ name: value } };
                })
              }
              disabled={isLoading}
            />
          </div>
          <div className="flex-1">
            <TextFieldWithValidation
              label="توضیحات"
              value={categoryForm.description}
              onChange={(value) =>
                setCategoryForm((prev) => {
                  return { ...prev, ...{ description: value } };
                })
              }
              disabled={isLoading}
            />
          </div>
        </div>
        <div className="flex justify-center items-center  border-dashed border-gray-400 border-2 h-20 desktopMin:h-auto desktopMin:flex-1  rounded-xl">
          <Upload />
        </div>
      </div>
      <div className="flex w-full justify-end items-center text-right">
        <CheckBox
          value={categoryForm.isActive}
          onChange={(value) => {
            setCategoryForm((prev) => {
              return { ...prev, ...{ isActive: value } };
            });
          }}
        >
          active :
        </CheckBox>
      </div>
      <Button
        className="bg-atysa-secondry"
        type="submit"
        disabled={true}
        isLoading={isLoading}
      >
        ثبت
      </Button>

      {!!categoryForm.id && (
        <WarningButton
          type="button"
          disabled={isLoading}
          isLoading={isLoading}
          onClick={() => onDelete(categoryForm.id)}
        >
          حذف
        </WarningButton>
      )}
    </form>
  );
}
