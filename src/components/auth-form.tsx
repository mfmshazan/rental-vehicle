"use client";
import { useActionState } from "react";
import Link from "next/link";
import { loginAction, registerAction } from "@/app/actions";
import { Icon } from "./icon";
import { ActionForm } from "./action-form";

export function AuthForm({ register = false }: { register?: boolean }) {
  const [state, action, pending] = useActionState(
    register ? registerAction : loginAction,
    {},
  );
  return (
    <ActionForm action={action} className="form-stack">
      {register && (
        <label>
          Your name
          <input
            name="name"
            placeholder="How should we call you?"
            autoComplete="name"
            required
            minLength={2}
            maxLength={80}
          />
        </label>
      )}
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
      {register && (
        <label>
          Mobile number
          <input
            name="phone"
            type="tel"
            placeholder="077 123 4567"
            autoComplete="tel"
            required
          />
          <small>
            This will be visible on your vehicle listings so renters can reach
            you.
          </small>
        </label>
      )}
      <label>
        Password
        <input
          name="password"
          type="password"
          placeholder={register ? "At least 8 characters" : "Your password"}
          autoComplete={register ? "new-password" : "current-password"}
          minLength={register ? 8 : 1}
          maxLength={72}
          required
        />
      </label>
      {state.error && (
        <p className="form-message error" role="alert">
          {state.error}
        </p>
      )}
      <button className="button button-green full-width" disabled={pending}>
        {pending
          ? "Just a moment…"
          : register
            ? "Create owner account"
            : "Log in"}
        <Icon name="arrow" size={18} />
      </button>
      {register && (
        <p className="fine-print">
          By creating an account, you agree to our{" "}
          <Link href="/guidelines">rental guidelines</Link> and{" "}
          <Link href="/privacy">privacy policy</Link>.
        </p>
      )}
      <p className="auth-switch">
        {register ? "Already part of Roam?" : "New to Roam?"}{" "}
        <Link href={register ? "/login" : "/register"}>
          {register ? "Log in" : "Create an owner account"}
        </Link>
      </p>
    </ActionForm>
  );
}
