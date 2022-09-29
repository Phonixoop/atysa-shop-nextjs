import IntegerField from "../nteger-field";

export default function PhoneField({ value, onChange = () => {}, ...rest }) {
  function parse(val) {
    return val.replace(/[^0-9]/g, "");
  }

  return (
    <IntegerField
      value={value}
      onChange={(val) => onChange(parse(val))}
      {...rest}
    />
  );
}
