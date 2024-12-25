"use client";

type GradientBorderProps = {
  className: string;
  borderWidth: number;
  radius?: number;
  children: React.ReactNode;
  dark?: boolean;
};
export default function GradientBorder({
  className,
  borderWidth,
  children,
  radius,
  dark = false,
}: GradientBorderProps) {
  return (
    <div
      className={`border-wrap ${dark ? "dark" : "light"}`}
      style={{
        borderRadius: radius ? `${radius}px` : "9999px",
        padding: `${borderWidth}px`,
      }}
    >
      <div
        className={`border-content ${className}`}
        style={{ borderRadius: radius ? `${radius}px` : "9999px" }}
      >
        {children}
      </div>
    </div>
  );
}
