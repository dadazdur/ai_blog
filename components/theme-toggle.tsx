"use client";

/**
 * Il tema attivo è già leggibile dal DOM (attributo data-theme o preferenza di
 * sistema): l'icona giusta la sceglie il CSS, così il pulsante non ha stato
 * React e non c'è disallineamento tra server e client.
 */
export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const explicit = root.getAttribute("data-theme");
    const current = explicit ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";

    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("sa-theme", next);
    } catch {
      // navigazione privata: la scelta vale per questa sessione
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Cambia tema chiaro o scuro"
      className="grid h-9 w-9 place-items-center rounded-[3px] text-ink-2 transition-colors hover:bg-sunken hover:text-ink"
    >
      <svg className="theme-sun" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M12 2.8v2.1M12 19.1v2.1M2.8 12h2.1M19.1 12h2.1M5.4 5.4l1.5 1.5M17.1 17.1l1.5 1.5M18.6 5.4l-1.5 1.5M6.9 17.1l-1.5 1.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
      <svg className="theme-moon" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
