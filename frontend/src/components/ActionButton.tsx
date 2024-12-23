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
      className={`bg-gradient-to-r from-[rgba(255,83,188,0.15)] via-transparent to-[rgba(10,252,212,0.15)] border-[2px] border-[#FF53BC26] rounded-full p-4 backdrop-blur-[40px] ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default ActionButton;
