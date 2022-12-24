export default function Form({
  children,
  className = "",
  onSubmit = () => {},
  ...rest
}) {
  return (
    <form
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      {...rest}
    >
      {children}
    </form>
  );
}
