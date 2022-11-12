import TextField from "../text-field";

export default function SimpleTextField({
  value,
  onChange = () => {},
  ...rest
}) {
  return (
    <TextField
      value={value}
      className="bg-black"
      onChange={(val) => onChange(val)}
      {...rest}
    />
  );
}
