import React, { useState } from "react";
import PhoneField from "ui/froms/phone-field";

export default function TestPage() {
  const [phonenumber, setPhonenumber] = useState();
  return (
    <div>
      <PhoneField
        value={phonenumber}
        onChange={(value) => setPhonenumber(value)}
      />
    </div>
  );
}
