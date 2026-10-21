"use client";
import { useEffect, useRef, useState } from "react";
import { Icon } from "./icon";

type Option = { value: string; label: string };

// A small custom dropdown so the option list always opens downward and can be
// fully styled (native <select> popups are positioned by the browser).
export function SelectMenu({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handlePointer(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node))
        setOpen(false);
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const current = options.find((option) => option.value === value);
  return (
    <div className="select-menu" ref={ref}>
      <button
        type="button"
        className="select-menu-trigger"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((previous) => !previous)}
      >
        <span>{current?.label ?? options[0]?.label}</span>
        <Icon name="chevron" size={16} />
      </button>
      {open && (
        <div className="select-menu-list">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`select-menu-option${
                option.value === value ? " selected" : ""
              }`}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
