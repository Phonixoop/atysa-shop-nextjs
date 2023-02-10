export default function SimpleTextField({
  className = "",
  autoFocus = false,
  value,
  onChange = () => {},
  ...rest
}) {
  return (
    <input
      dir="rtl"
      autoFocus={autoFocus}
      value={value}
      className={`border-none outline-none ${className}`}
      onChange={(e) => onChange(e.target.value)}
      {...rest}
    />
  );
}
