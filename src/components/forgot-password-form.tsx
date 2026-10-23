"use client";
import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordResetAction } from "@/app/actions";
import { Icon } from "./icon";
import { ActionForm } from "./action-form";

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(
    requestPasswordResetAction,
    {},
  );
  return (
    <ActionForm action={action} className="form-stack">
      <label>
        Email address
        <input
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
      </label>
      {state.error && (
        <p className="form-message error" role="alert">
          {state.error}
        </p>
      )}
      {state.success ? (
        <p className="form-message success" role="status">
          {state.success}
        </p>
      ) : (
        <button className="button button-green full-width" disabled={pending}>
          {pending ? "Sending…" : "Send reset link"}
          <Icon name="arrow" size={18} />
        </button>
      )}
      <p className="auth-switch">
        Remembered it? <Link href="/login">Log in</Link>
      </p>
    </ActionForm>
  );
}
