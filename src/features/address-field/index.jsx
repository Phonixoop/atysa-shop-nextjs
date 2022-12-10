import { useEffect, useState } from "react";

import MultiRowTextBox from "@/ui/forms/multi-row";
import { useRef } from "react";

import withLable from "ui/forms/with-label";
import withValidation from "ui/forms/with-validation";

import TextField from "ui/forms/text-field";
import TextAreaField from "ui/forms/textarea-field";
import Button from "ui/buttons";
import Map from "ui/map";
import Modal from "ui/modals";
import LocationIcon from "ui/icons/location";
const TextWithLable = withLable(TextField);
const TextAreaWithLable = withLable(TextAreaField);

export default function AddressField({ address = {}, onChange = () => {} }) {
  const {
    id,
    title,
    description,
    location: { lat, lon },
  } = address;
  const [_address, setAddress] = useState(address);
  const [modal, setModal] = useState({ isOpen: false });

  function updateAddress(value) {
    const updatedAddress = addresses.map((address) => {
      const { title, description, location, isActive } = value;
      if (value.id === address.id) {
        return { ...address, ...{ title, description, location } };
      }
      return address;
    });
    setAddresses(updatedAddress);
  }

  // function updateAddressActiveState({ id }) {
  //   const updatedAddress = addresses.map((address) => {
  //     return { ...address, isActive: id === address.id ? true : false };
  //   });
  //   setAddresses(updatedAddress);
  // }
  useEffect(() => {
    onChange(_address);
  }, [_address]);
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
        <div className="flex-grow w-full">
          <TextWithLable
            required
            label="عنوان آدرس"
            value={_address.title}
            onChange={(val) => {
              setAddress({ ..._address, title: val });
            }}
          />
        </div>
        <div className="flex-grow w-full">
          <TextAreaWithLable
            required
            label="توضیحات آدرس"
            value={_address.description}
            onChange={(val) => {
              setAddress({ ..._address, description: val });
            }}
          />
        </div>
        <input
          required
          hidden
          value={_address?.location?.lat === 0 ? undefined : _address.location}
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
          {!_address.location && !modal?.location
            ? "موقعیت را انتخاب کنید"
            : ""}
        </span>
      </div>

      <Modal
        isOpen={modal.isOpen}
        center
        onClose={() => {
          close();
        }}
      >
        <div className=" flex flex-col justify-start items-center gap-5 w-full h-full ">
          <div className="relative w-full  max-h-[70%]">
            <div className="absolute top-5 z-50 w-full flex justify-center items-center">
              <TextWithLable bg="bg-white" extraclass label="جستجو" />
            </div>
            <Map
              location={_address.location}
              onChange={({ lat, lon }) => {
                setModal({ ...modal, location: { lat, lon } });
              }}
            />
            {/* <div className="absolute w-4 h-4 rounded-full bg-atysa-main ring-1 ring-white  absolute-center">
              <div className="absolute w-[2px] h-4  bg-atysa-main rounded-full absolute-center top-5 "></div>
            </div> */}
          </div>
          <Button
            className="flex gap-2 text-white  bg-atysa-900  md:w-6/12 w-11/12 px-2"
            onClick={() => {
              setAddress({
                ..._address,
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
