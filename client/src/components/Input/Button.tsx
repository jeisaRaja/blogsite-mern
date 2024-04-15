import React, { MouseEventHandler, ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  type?: "submit" | "reset" | "button" | undefined;
  dark?: boolean;
  onclick?: MouseEventHandler<HTMLButtonElement>;
}
const Button: React.FC<ButtonProps> = ({ children, type, dark, onclick }) => {
  return (
    <button
      onClick={onclick}
      type={type}
      className={`
      flex justify-center border-solid border-2 py-3 px-3 rounded-md mt-4 text-sm
      ${
        dark
          ? "text-white bg-neutral-700 hover:bg-neutral-800"
          : "text-black hover:bg-neutral-100 bg-white"
      }
      ${type === "submit" ? "w-full" : ""}
    `}
    >
      {children}
    </button>
  );
};

export default Button;
