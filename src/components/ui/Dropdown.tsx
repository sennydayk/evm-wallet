import { useState, useRef, useEffect } from "react";

type DropdownOption = {
  value: string;
  label: string;
};

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export const Dropdown = ({
  options,
  value,
  onChange,
  className = "",
  disabled = false,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`dropdown ${disabled ? "dropdown--disabled" : ""} ${className}`}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        className={`dropdown__trigger ${isOpen ? "dropdown__trigger--open" : ""}`}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="dropdown__selected">
          {selectedOption?.label ?? ""}
        </span>
        <span
          className={`dropdown__arrow ${isOpen ? "dropdown__arrow--open" : ""}`}
        >
          ▾
        </span>
      </button>
      {isOpen && (
        <ul className="dropdown__menu" role="listbox">
          {options.map((option) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              className={`dropdown__option ${option.value === value ? "dropdown__option--selected" : ""}`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
