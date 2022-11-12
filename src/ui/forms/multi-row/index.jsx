import { useState } from "react";
import TextField from "ui/forms/text-field";
import IntegerField from "ui/forms/integer-field";
import withLabel from "@/ui/forms/with-label";

import TrashIcon from "@/ui/icons/trash";
import { PlusIcon } from "@heroicons/react/24/outline";
import CircleButton from "@/ui/buttons/circle";
import { useEffect } from "react";

const TextWithLable = withLabel(TextField);
const IntegerWithLable = withLabel(IntegerField);
export default function MultiRowTextBox({
  materials = [],
  onChange = () => {},
}) {
  function updateMaterials(value) {
    const updatedMaterial = materials.map((material) => {
      const { name, weight } = value;
      if (value.id === material.id) {
        return { ...material, ...{ name, weight } };
      }
      return material;
    });
    onChange(updatedMaterial);
  }
  function addRow() {
    const newMat = [
      ...materials,
      {
        id: materials[materials.length - 1]?.id + 1 || 0,
        name: "",
        weight: "",
      },
    ];
    onChange(newMat);
  }
  function removeRow(id) {
    if (materials.length <= 0) return;
    const removedMats = materials.filter((a) => a.id !== id);
    onChange(removedMats);
  }
  function canRemoveByKeyboardMinus(value) {
    if (
      value.name.substring(value?.name.length - 1, value?.name.lenght) ===
        "-" ||
      value.weight.substring(value?.weight.length - 1, value?.weight.lenght) ===
        "-"
    )
      return true;
    return false;
  }
  return (
    <>
      <div
        className="flex flex-col h-1/2 justify-center items-center  gap-2 w-full"
        onKeyUp={(e) => {
          if (e.key === "Enter") addRow();
        }}
      >
        {materials.map(({ id, name, weight }) => {
          return (
            <TwoTextBox
              value={{ id, name, weight }}
              onChange={(value) => {
                if (canRemoveByKeyboardMinus(value)) return removeRow(id);

                updateMaterials(value);
              }}
              canRemove={true}
              onRemove={(id) => removeRow(id)}
            />
          );
        })}
        <button
          type="button"
          className="flex justify-center items-center text-white w-full h-10 bg-atysa-900 rounded-lg"
          onClick={addRow}
        >
          <PlusIcon className=" w-3 h-3 stroke-[2px] " />
        </button>
      </div>
    </>
  );
}

function TwoTextBox({
  value = { id: 0, name: "", weight: "" },
  canRemove = false,
  onChange = () => {},
  onRemove = () => {},
}) {
  return (
    <div dir="rtl" className="flex justify-center items-center  gap-2 w-full">
      <div className="flex-grow">
        <TextWithLable
          value={value.name}
          onChange={(val) => {
            onChange({ ...value, name: val });
          }}
          label="نام"
          textPlaceHolder=""
        />
      </div>
      <div className="flex-grow">
        <IntegerWithLable
          value={value.weight}
          onChange={(val) => {
            onChange({ ...value, weight: val });
          }}
          label="مقدار"
          textPlaceHolder=""
        />
      </div>
      <div className="flex justify-end flex-grow gap-2 ">
        <CircleButton
          disabled={!canRemove}
          onClick={() => onRemove(value.id)}
          className="relative flex bg-atysa-900  disabled:bg-gray-300 disabled:text-gray-400 ring-inset  hover:ring-1 hover:ring-atysa-900 transition-all justify-center items-center hover:bg-opacity-50 rounded-full p-2 group "
        >
          <TrashIcon className="group-disabled:stroke-gray-400 stroke-white w-3 h-3 stroke-[1.8px] group-hover:stroke-black  " />
        </CircleButton>
      </div>
    </div>
  );
}
