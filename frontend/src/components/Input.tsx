import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import clsx from "clsx";

type InputProps = {
  label?: string;
  type?: string;
  name?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  fullWidth?: boolean;
};

const Input: React.FC<InputProps> = ({
  label,
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  required = true,
  disabled = false,
  error,
  className,
  fullWidth = true,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;
  const isFocused = value.length > 0;

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleBlur = () => {
    if (type === "email" && value) {
      if (!validateEmail(value)) {
        setLocalError("Please enter a valid email address.");
      } else {
        setLocalError(null);
      }
    }
  };

  return (
    <fieldset
      className={clsx(
        "relative mb-5 px-2 rounded-lg border transition-all",
        fullWidth && "w-full",
        error || localError
          ? "border-red-500 focus-within:ring-red-500"
          : "border-gray-300 focus-within:ring-blue-500",
        "focus-within:ring-1",
        className
      )}
    >
      {label && (
        <legend
          className={clsx(
            "absolute left-2 px-1 -top-2.5 text-xs transition-all duration-200 bg-white",
            isFocused ? "text-blue-600" : "text-gray-500"
          )}
        >
          {label}
        </legend>
      )}

      <div className="relative">
        <input
          type={inputType}
          name={name}
          id={name}
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onChange(e);
            if (type === "email") setLocalError(null);
          }}
          onBlur={handleBlur}
          disabled={disabled}
          required={required}
          className={clsx(
            "w-full px-2 pt-3 pb-3 bg-transparent border-none focus:outline-none text-sm",
            disabled && "cursor-not-allowed text-gray-400"
          )}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {(error || localError) && (
        <p className="text-sm text-red-500 mt-1">{error || localError}</p>
      )}
    </fieldset>
  );
};

export default Input;
