import { useEffect, useState } from "react";
import TextField from "ui/forms/text-field";
import FloatField from "ui/forms/float-field";
import withLabel from "@/ui/forms/with-label";
import MultiRowTextBox from "@/ui/forms/multi-row";
import { useRef } from "react";

const TextWithLable = withLabel(TextField);
const FloatWithLable = withLabel(FloatField);

export default function MaterialFields({ values = [], onChange = () => {} }) {
  const [materials, setMaterials] = useState(values || []);
  function updateMaterials(value) {
    const updatedMaterial = materials.map((material) => {
      const { name, weight } = value;
      if (value.id === material.id) {
        return { ...material, ...{ name, weight } };
      }
      return material;
    });
    setMaterials(updatedMaterial);
  }

  useEffect(() => {
    onChange(materials);
  }, [materials]);

  return (
    <MultiRowTextBox
      values={materials}
      onChange={setMaterials}
      renderItems={(item, removeRow, addRow) => {
        const { id, name, weight } = item;
        return (
          <>
            <MaterialGroupTextBox
              key={item.id}
              value={{ id, name, weight }}
              onKeyUp={(e) => {
                if (e.key === "+") {
                  addRow();
                } else if (e.key === "-") {
                  removeRow(id);
                }
              }}
              onChange={(value) => {
                if (
                  Object.entries(value)
                    .filter(([key, v]) => key != "id")
                    .every(([_, v]) => {
                      const lastValue =
                        v?.substring(v.length - 1, v.lenght) || "";
                      return lastValue === "+" || lastValue === "-";
                    })
                )
                  return;

                updateMaterials(value);
              }}
            />
          </>
        );
      }}
    />
  );
}

function MaterialGroupTextBox({
  value = { id: 0, name: "", weight: "" },
  focused = false,
  onChange = () => {},
  onKeyUp = () => {},
}) {
  const ref = useRef(undefined);
  return (
    <>
      <div className="flex-grow">
        <TextWithLable
          label="نام"
          value={value.name}
          focused={focused}
          onChange={(val) => {
            onChange({ ...value, name: val });
          }}
          onKeyUp={onKeyUp}
        />
      </div>
      <div className="flex-grow">
        <FloatWithLable
          label="مقدار"
          value={value.weight}
          onChange={(val) => {
            onChange({ ...value, weight: val });
          }}
          onKeyUp={onKeyUp}
        />
      </div>
    </>
  );
}
