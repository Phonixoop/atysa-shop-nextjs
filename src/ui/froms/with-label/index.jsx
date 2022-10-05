export default function withLabel(Component) {
  return function WrappedComponent({
    value,
    label,
    onChange = () => {},
    ...rest
  }) {
    return (
      <div className="flex relative">
        <Component
          value={value}
          onChange={(value) => {
            onChange(value);
          }}
          label={label}
          {...rest}
        />
        <label
          htmlFor="floating_filled"
          className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-top-right right-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
        >
          {label}
        </label>
      </div>
    );
  };
}
