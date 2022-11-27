import { useEffect, useState } from "react";

import MultiRowTextBox from "@/ui/forms/multi-row";
import { useRef } from "react";

import withLable from "ui/forms/with-label";
import withValidation from "ui/forms/with-validation";

import TextField from "ui/forms/text-field";
import TextAreaField from "ui/forms/textarea-field";
import Button from "ui/buttons";
import RadioBox from "ui/forms/radiobox";

const TextWithLable = withLable(TextField);
const TextAreaWithLable = withLable(TextAreaField);

export default function AddressFields({ values = [], onChange = () => {} }) {
  const [addresses, setAddresses] = useState(values || []);

  function updateAddresses(value) {
    const updatedAddress = addresses.map((address) => {
      const { title, description, isActive } = value;
      if (value.id === address.id) {
        return { ...address, ...{ title, description, isActive } };
      }
      return address;
    });
    setAddresses(updatedAddress);
  }

  function updateAddressActiveState({ isActive, id }) {
    const updatedAddress = addresses.map((address) => {
      return { ...address, isActive: id === address.id ? true : false };
    });
    setAddresses(updatedAddress);
  }
  useEffect(() => {
    onChange(addresses);
  }, [addresses]);

  return (
    <>
      <MultiRowTextBox
        values={addresses}
        onChange={setAddresses}
        renderItems={(item, removeRow, addRow) => {
          const { id, title, description, isActive } = item;
          return (
            <>
              <div className="w-fit">
                <RadioBox
                  groupName="address"
                  checked={addresses.length === 1 ? true : isActive}
                  onChange={(checked) => {
                    updateAddressActiveState({ isActive: checked, id });
                  }}
                />
              </div>
              <div className="bg-atysa-primary w-full border-dashed border-[1px] border-atysa-800 rounded-xl shadow-inner w-full p-5">
                <AddressGroupTextBox
                  key={item.id}
                  value={{ id, title, description }}
                  onChange={(value) => {
                    updateAddresses(value);
                  }}
                />
              </div>
            </>
          );
        }}
      />
    </>
  );
}

function AddressGroupTextBox({
  value = { id: 0, name: "", weight: "" },
  focused = false,
  onChange = () => {},
  onKeyUp = () => {},
}) {
  const ref = useRef(undefined);
  return (
    <div className="flex flex-col w-full gap-2">
      <div className=" flex-grow">
        <TextWithLable
          label="نام"
          value={value.title}
          focused={focused}
          onChange={(val) => {
            onChange({ ...value, title: val });
          }}
          onKeyUp={onKeyUp}
        />
      </div>
      <div className="flex-grow">
        <TextAreaWithLable
          label="توضیحات آدرس"
          value={value.description}
          onChange={(val) => {
            onChange({ ...value, description: val });
          }}
          onKeyUp={onKeyUp}
        />
      </div>
    </div>
  );
}
