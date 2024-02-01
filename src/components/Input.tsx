import { ForwardRefRenderFunction, forwardRef } from "react";

interface InputInterface {
  placeholder: string;
  type: string;
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputInterface> = (
  { placeholder, type, ...rest },
  ref
) => {
  return (
    <div>
      <input
        type={type}
        placeholder={placeholder}
        ref={ref}
        {...rest}
        className="px-3 py-2 bg-gray-950 rounded-md w-full"
      />
    </div>
  );
};

const InputRef = forwardRef(InputBase);

export default InputRef;
