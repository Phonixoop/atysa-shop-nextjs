import TextField from "../text-field";

export default function SimpleTextField({
  value,
  onChange = () => {},
  ...rest
}) {
  function parse(val) {
    return val.replace(/[^0-9]/g, "");
  }

  return (
    <TextField
      value={value}
      className="bg-black"
      onChange={(val) => onChange(parse(val))}
      {...rest}
    />
  );
}
