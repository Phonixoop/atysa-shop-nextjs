import { useState } from "react";

export default function withLabel(Component) {
  return function WrappedComponent({
    children,
    value,
    label,
    onChange = () => {},
    ...rest
  }) {
    const [focused, setFocused] = useState(false);
    return (
      <div className="flex flex-row-reverse relative">
        <Component
          value={value}
          onChange={(value) => {
            onChange(value);
          }}
          focused={focused}
          onBlur={() => setFocused(false)}
          label={label}
          {...rest}
        >
          {children}
        </Component>

        <label
          onClick={() => setFocused(true)}
          className="absolute text-sm text-gray-500 dark:text-gray-400
          duration-300 transform -translate-y-4 scale-75 top-4 z-10
          origin-top-right right-2.5 peer-focus:text-atysa-main
          peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100
          peer-placeholder-shown:translate-y-0 peer-focus:scale-75
          peer-focus:-translate-y-4 select-none"
        >
          {label}
        </label>
      </div>
    );
  };
}
