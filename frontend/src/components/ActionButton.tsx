import React, { ReactNode, ButtonHTMLAttributes } from "react";
import GradientBorder from "./GradientBorder";

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
    <GradientBorder className={`${className}`} borderWidth={2}>
      <button
        className={`rounded-full p-4 active:scale-95 transition-all ${className} hover:opacity-50`}
        {...rest}
      >
        {children}
      </button>
    </GradientBorder>
  );
};

export default ActionButton;
