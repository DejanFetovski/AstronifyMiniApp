import React, { ReactNode, ButtonHTMLAttributes } from "react";

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <button
      className={`rounded-full p-4 active:scale-95 transition-all ${className}`}
      {...rest}
    >
      <img src="assets/images/button.png"></img>
    </button>
  );
};

export default ActionButton;
