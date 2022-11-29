import AddressFields from "features/address-fields";

export default function AddressForm({ addresses }) {
  return (
    <AddressFields
      values={addresses}
      onChange={(addresses) => {
        setUserForm((prev) => {
          return { ...prev, addresses };
        });
      }}
    />
  );
}
