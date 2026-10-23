"use client";
import { useActionState } from "react";
import Link from "next/link";
import { resetPasswordAction } from "@/app/actions";
import { Icon } from "./icon";
import { ActionForm } from "./action-form";

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(resetPasswordAction, {});
  return (
    <ActionForm action={action} className="form-stack">
      <input type="hidden" name="token" value={token} />
      <label>
        New password
        <input
          name="password"
          type="password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          minLength={8}
          maxLength={72}
          required
        />
      </label>
      {state.error && (
        <p className="form-message error" role="alert">
          {state.error}
        </p>
      )}
      {state.success ? (
        <>
          <p className="form-message success" role="status">
            {state.success}
          </p>
          <Link href="/login" className="button button-green full-width">
            Log in <Icon name="arrow" size={18} />
          </Link>
        </>
      ) : (
        <button className="button button-green full-width" disabled={pending}>
          {pending ? "Updating…" : "Update password"}
          <Icon name="arrow" size={18} />
        </button>
      )}
    </ActionForm>
  );
}
