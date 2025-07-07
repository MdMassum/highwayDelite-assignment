import React from "react";
import clsx from "clsx";
import { ClipLoader } from "react-spinners";

type ButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
};

const Button: React.FC<ButtonProps> = ({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
  className = "",
}) => {
  const baseStyles =
    "flex items-center justify-center font-medium rounded-md transition-colors duration-200 focus:outline-none cursor-pointer";

  const variants: Record<string, string> = {
    primary: "bg-[#367AFF] text-white hover:bg-blue-600",
    secondary: "bg-gray-200 text-black hover:bg-gray-300",
    outline: "border border-gray-400 text-black hover:bg-gray-100",
  };

  const sizes: Record<string, string> = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  };

  const composedClasses = clsx(
    baseStyles,
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    disabled && "opacity-50 cursor-not-allowed",
    className
  );

  return (
    <button
      type={type}
      onClick={onClick}
      className={composedClasses}
      disabled={disabled || loading}
    >
      {loading ? (
        <ClipLoader
          size={20}
          color={variant === "primary" ? "#ffffff" : "#000000"}
          cssOverride={{ marginRight: "0.5rem" }}
        />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
