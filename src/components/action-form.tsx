"use client";
import { startTransition, type ReactNode } from "react";

// Dispatch manually so a validation-error result does not reset uncontrolled inputs.
export function ActionForm({
  action,
  children,
  className,
}: {
  action: (data: FormData) => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <form
      className={className}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        startTransition(() => action(data));
      }}
    >
      {children}
    </form>
  );
}
