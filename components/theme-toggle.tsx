"use client";

/**
 * Il tema attivo è già leggibile dal DOM (attributo data-theme o preferenza di
 * sistema): l'icona giusta la sceglie il CSS, così il pulsante non ha stato
 * React e non c'è nessun disallineamento tra server e client.
 */
export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const explicit = root.getAttribute("data-theme");
    const current =
      explicit ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";

    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("sa-theme", next);
    } catch {
      // navigazione privata: il tema resta valido per questa sessione
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Cambia tema chiaro o scuro"
      className="grid h-9 w-9 place-items-center rounded-full border border-rule text-ink-soft transition-colors hover:border-rule-strong hover:text-ink"
    >
      <svg className="theme-sun" width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.1 5.1l1.4 1.4M17.5 17.5l1.4 1.4M18.9 5.1l-1.4 1.4M6.5 17.5l-1.4 1.4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
      <svg className="theme-moon" width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.4 8.4 0 1 0 10.2 10.2Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
