import { useEffect, useState } from "react";
import TextField from "ui/forms/text-field";
import FloatField from "ui/forms/float-field";
import withLabel from "@/ui/forms/with-label";
import MultiRowTextBox from "@/ui/forms/multi-row";
import { useRef } from "react";

const TextWithLable = withLabel(TextField);
const FloatWithLable = withLabel(FloatField);

export default function NutritionFields({ values = [], onChange = () => {} }) {
  const [nutritions, setNutritions] = useState(values);
  function updateNutritions(value) {
    const updatedNutrition = nutritions.map((nutrition) => {
      const { name, amount } = value;
      if (value.id === nutrition.id) {
        return { ...nutrition, ...{ name, amount } };
      }
      return nutrition;
    });
    setNutritions(updatedNutrition);
  }

  useEffect(() => {
    onChange(nutritions);
  }, [nutritions]);

  return (
    <MultiRowTextBox
      values={nutritions}
      onChange={setNutritions}
      renderItems={(item, removeRow, addRow) => {
        const { id, name, amount } = item;
        return (
          <>
            <NutritionGroupTextBox
              key={item.id}
              value={{ id, name, amount }}
              onKeyUp={(e) => {
                if (e.key === "+") {
                  addRow();
                } else if (e.key === "-") {
                  removeRow(id);
                }
              }}
              onChange={(value) => {
                const canAdd = Object.entries(value)
                  .filter(([key, v]) => key != "id")
                  .some(([_, v]) => {
                    const lastValue =
                      v?.toString().substring(v.length - 1, v.lenght) || "";

                    return lastValue === "+" || lastValue === "-";
                  });

                if (canAdd) return;

                updateNutritions(value);
              }}
            />
          </>
        );
      }}
    />
  );
}

function NutritionGroupTextBox({
  value = { id: 0, name: "", amount: "" },
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
          value={value.amount}
          onChange={(val) => {
            onChange({ ...value, amount: val });
          }}
          onKeyUp={onKeyUp}
        />
      </div>
    </>
  );
}
