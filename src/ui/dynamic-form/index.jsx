import { useEffect, useState } from "react";

// with
import withLabel from "ui/forms/with-label";
import withValidation from "ui/forms/with-validation";

//ui
import TextField from "ui/forms/text-field";
import IntegerField from "ui/forms/integer-field";

import Button from "ui/buttons";
import MultiBox from "../forms/multi-box";

const TextFieldWithLabel = withLabel(TextField);
const IntegerWithLabel = withLabel(IntegerField);

const TextFieldWithValidation = withValidation(TextFieldWithLabel);
const IntegerFieldWithValidation = withValidation(IntegerWithLabel);

export default function DynamicForm({
  schema = {},
  initialData = {
    first_name: "ali",
    age: 5,
  },
  buttonTitle = "ثبت",
  isLoading = false,
  onSubmit = () => {},
}) {
  const [_schema, setSchema] = useState([]);
  const [form, setForm] = useState([]);
  const [validations, setValidations] = useState({});

  const canSubmit =
    Object.entries(validations)
      .map(([_, value]) => {
        return value.length;
      })
      .reduce((a, b) => {
        return a + b;
      }, 0) <= 0 && isLoading === false;

  useEffect(() => {
    const generatedSchema = schema.map((item) => {
      let input = undefined;
      if (item.type === "string") input = TextFieldWithValidation;
      else if (item.type === "number") input = IntegerFieldWithValidation;
      // if (item.type === "array")
      // {
      //   input = ()=>
      //   {
      //     return <>
      //     <MultiBox initialKeys={item.}/>
      //     </>
      //   };
      // }
      return {
        ...item,
        type: input,
      };
    });
    setForm(() => {
      const data = initialData;
      generatedSchema.map((item) => {
        data[item.key] = item.value;
      });
      return data;
    });

    setSchema(generatedSchema);
  }, []);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      {_schema.map((item) => {
        const Input = item.type;
        const value = form[item.key];

        return (
          <div className="p-2">
            <Input
              label={item.label}
              value={value}
              onChange={(value) => {
                setForm((prev) => {
                  return {
                    ...prev,
                    [item.key]: value,
                  };
                });
              }}
              validations={item.validations}
              onValidation={(value) => {
                setValidations((prev) => {
                  return { ...prev, [item.key]: value };
                });
              }}
            />
          </div>
        );
      })}
      <Button
        type="submit"
        isLoading={isLoading}
        disabled={!canSubmit}
        className="bg-atysa-main text-white"
      >
        {buttonTitle}
      </Button>
      <pre dir="ltr"> {JSON.stringify(validations, null, 2)}</pre>
    </form>
  );
}
