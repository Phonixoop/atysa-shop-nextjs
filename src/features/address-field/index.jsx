import { useEffect, useState } from "react";

import MultiRowTextBox from "ui/forms/multi-row";
import { useRef } from "react";

// ui
import withLable from "ui/forms/with-label";
import withValidation from "ui/forms/with-validation";

//ui fields
import TextField from "ui/forms/text-field";
import TextAreaField from "ui/forms/textarea-field";
import PhoneField from "ui/forms/phone-field";

import Button from "ui/buttons";

import Map from "ui/map";
import Modal from "ui/modals";
import LocationIcon from "ui/icons/location";

//validations
import { isPhoneNumberOrEmpty, isElevenNumberOrEmpty } from "validations";

const PhoneWithLabel = withLable(PhoneField);
const PhoneWithValidation = withValidation(PhoneWithLabel);

const TextWithLable = withLable(TextField);
const TextAreaWithLable = withLable(TextAreaField);

export default function AddressField({
  address = {},
  onChange = () => {},
  onCanSubmit = () => {},
}) {
  const [_address, setAddress] = useState(address);
  const [validations, setValidations] = useState({
    phonenumber: [""],
  });

  const [modal, setModal] = useState({ isOpen: false });
  const mapRef = useRef(undefined);

  const canSubmit =
    Object.entries(validations)
      .map(([_, value]) => {
        return value.length;
      })
      .reduce((a, b) => {
        return a + b;
      }, 0) <= 0;

  onCanSubmit(canSubmit);
  function updateAddress(value) {
    const updatedAddress = addresses.map((address) => {
      const { title, description, location, phonenumber, isActive } = value;
      if (value.id === address.id) {
        return { ...address, ...{ title, description, phonenumber, location } };
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
            onChange={(title) => {
              setAddress({ ..._address, title });
            }}
          />
        </div>
        <div className="flex-grow w-full">
          <TextAreaWithLable
            required
            label="توضیحات آدرس"
            value={_address.description}
            onChange={(description) => {
              setAddress({ ..._address, description });
            }}
          />
        </div>
        <div className="flex-grow w-full">
          <PhoneWithValidation
            label="شماره تماس (اختیاری)"
            value={_address.phonenumber || ""}
            validations={[isElevenNumberOrEmpty, isPhoneNumberOrEmpty]}
            onValidation={(value) => {
              setValidations({
                phonenumber: value,
              });
            }}
            onChange={(phonenumber) => {
              setAddress({ ..._address, phonenumber });
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
          <LocationIcon className="w-4 h-4 fill-atysa-900" />
          <span className="text-atysa-900">ویرایش روی نقشه</span>
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
        size="sm"
        title="انتخاب موقعیت"
        zIndex="z-[10002]"
        onClose={() => {
          close();
        }}
      >
        <div className=" flex flex-col justify-start items-center gap-5 w-full h-full py-5">
          {/* <SearchMap />
          <button
            type="button"
            onClick={() => {
              console.log({ ol: mapRef.current.ol });
              mapRef.current.DrawFeature.clear();
              var lonlat = mapRef.current.ol.proj.transform(
                { lat: 35.754104943159945, lon: 51.362319945765186 },
                "EPSG:3857",
                "EPSG:4326"
              );
              // setModal((modal) => {
              //   return {
              //     ...modal,
              //     location: { lat: lonlat[1], lon: lonlat[0] },
              //   };
              // });

              var marker = new mapRef.current.ol.Feature(
                new mapRef.current.ol.geom.Point(
                  mapRef.current.ol.proj.fromLonLat(lonlat)
                )
              );
              mapRef.current.markers.getSource().addFeature(marker);
              mapRef.current.myMap.addLayer(mapRef.current.markers);
            }}
          >
            test
          </button> */}
          <div className="relative w-[600px]">
            <Map
              location={_address.location}
              onChange={({ lat, lon }) => {
                setModal({ ...modal, location: { lat, lon } });
                //      console.log({ lat, lon });
              }}
              onReady={(ol, DrawFeature, myMap, markers) => {
                mapRef.current = {
                  ol,
                  DrawFeature,
                  myMap,
                  markers,
                };
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

function SearchMap() {
  return (
    <>
      <div className="flex flex-col w-full justify-center items-center">
        <div className="w-full px-5">
          <TextWithLable label="جستجوی آدرس" />
        </div>
      </div>
    </>
  );
}
