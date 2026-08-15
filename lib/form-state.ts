/**
 * Stati dei form gestiti con useActionState.
 * Vivono fuori dai file "use server" perché quei moduli possono esportare
 * soltanto funzioni asincrone.
 */

export type NewsletterState = {
  status: "idle" | "success" | "already" | "error";
  message: string;
};

export const newsletterInitialState: NewsletterState = { status: "idle", message: "" };

export type AuthState = { status: "idle" | "error" | "success"; message: string };
export const authInitialState: AuthState = { status: "idle", message: "" };

export type AdminState = { status: "idle" | "error" | "success"; message: string };
export const adminInitialState: AdminState = { status: "idle", message: "" };
