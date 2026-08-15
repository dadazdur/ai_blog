"use client";

import { useState, useTransition } from "react";
import { getDownloadUrl } from "@/app/actions/resources";
import { buttonClass } from "@/components/ui";
import { cn } from "@/lib/utils";

export function DownloadButton({
  resourceId,
  label = "Scarica",
  variant = "primary",
}: {
  resourceId: string;
  label?: string;
  variant?: "primary" | "outline";
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const result = await getDownloadUrl(resourceId);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      window.location.href = result.url;
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className={cn(buttonClass(variant, "sm"), "self-start")}
      >
        {pending ? "Preparo il file…" : label}
      </button>
      {error ? <p className="text-[0.8rem] text-danger">{error}</p> : null}
    </div>
  );
}

export function CopyPromptButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button type="button" onClick={copy} className={cn(buttonClass("outline", "sm"), "self-start")}>
      {copied ? "Copiato" : "Copia il prompt"}
    </button>
  );
}
