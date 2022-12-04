import { useEffect, useState } from "react";

import MultiRowTextBox from "@/ui/forms/multi-row";
import { useRef } from "react";

import withLable from "ui/forms/with-label";
import withValidation from "ui/forms/with-validation";

import TextField from "ui/forms/text-field";
import TextAreaField from "ui/forms/textarea-field";
import Button from "ui/buttons";
import RadioBox from "ui/forms/radiobox";
import Map from "ui/map";
import Modal from "ui/modals";
import LocationIcon from "ui/icons/location";
const TextWithLable = withLable(TextField);
const TextAreaWithLable = withLable(TextAreaField);

export default function AddressFields({ values = [], onChange = () => {} }) {
  const [addresses, setAddresses] = useState(values || []);

  function updateAddresses(value) {
    const updatedAddress = addresses.map((address) => {
      const { title, description, location, isActive } = value;
      if (value.id === address.id) {
        return { ...address, ...{ title, description, location } };
      }
      return address;
    });
    setAddresses(updatedAddress);
  }

  function updateAddressActiveState({ id }) {
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
          const { id, title, description, location, isActive } = item;
          return (
            <>
              <div className="w-fit">
                <RadioBox
                  groupName="address"
                  checked={isActive}
                  onChange={(checked) => {
                    updateAddressActiveState({ id });
                  }}
                />
              </div>
              <div className="bg-atysa-primary w-full border-dashed border-[1px] border-atysa-800 rounded-xl shadow-inner p-5">
                <AddressGroupTextBox
                  key={item.id}
                  value={{ id, title, description, location }}
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
  value = { id: 0, title: "", description: "", location: { lat: 0, lon: 0 } },
  focused = false,
  onChange = () => {},
  onKeyUp = () => {},
}) {
  const ref = useRef(undefined);
  const [modal, setModal] = useState({ isOpen: false });

  function open() {
    setModal((prev) => {
      return { ...prev, isOpen: true };
    });
  }
  function close() {
    setModal((prev) => {
      return { ...prev, isOpen: false };
    });
  }
  return (
    <>
      <div className="flex flex-col justify-center items-center w-full gap-2">
        <div className=" flex-grow w-full">
          <TextWithLable
            required
            label="نام"
            value={value.title}
            focused={focused}
            onChange={(val) => {
              onChange({ ...value, title: val });
            }}
            onKeyUp={onKeyUp}
          />
        </div>
        <div className="flex-grow w-full">
          <TextAreaWithLable
            required
            label="توضیحات آدرس"
            value={value.description}
            onChange={(val) => {
              onChange({ ...value, description: val });
            }}
            onKeyUp={onKeyUp}
          />
        </div>
        <input
          required
          hidden
          value={value?.location?.lat === 0 ? undefined : value.location}
        />
        <Button
          className="flex gap-2 text-atysa-900 border-[1px] border-atysa-900 border-dashed  w-fit"
          onClick={() => {
            open();
          }}
        >
          <LocationIcon className="w-4 h-4 fill-black" />
          <span> ویرایش روی نقشه</span>
        </Button>
        <span className="text-red-500">
          {!value.location && !modal?.location ? "موقعیت را انتخاب کنید" : ""}
        </span>
      </div>

      <Modal
        isOpen={modal.isOpen}
        center
        onClose={() => {
          close();
        }}
      >
        <div className="flex flex-col justify-start items-center gap-5 w-full h-full ">
          <div className="w-full max-h-[70%]">
            <Map
              location={value.location}
              onChange={({ lat, lon }) => {
                setModal({ ...modal, location: { lat, lon } });
              }}
            />
          </div>
          <Button
            className="flex gap-2 text-white  bg-atysa-900  md:w-6/12 w-11/12 px-2"
            onClick={() => {
              onChange({
                ...value,
                location: { lat: modal.location.lat, lon: modal.location.lon },
              });
              close();
            }}
          >
            <LocationIcon className="w-4 h-4 fill-white" />
            ثبت موقعیت
          </Button>
        </div>
      </Modal>
    </>
  );
}
