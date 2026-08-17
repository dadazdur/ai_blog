"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useConsent } from "@/components/consent";

const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID ?? "y3qz0gvh8h";

/**
 * Aree escluse dalla misurazione.
 *
 * Clarity registra le sessioni: dentro l'area riservata e l'amministrazione
 * significherebbe filmare indirizzi email degli iscritti, nomi e documenti dei
 * clienti. Sono dati di terzi che non ci hanno autorizzato nulla, quindi lì lo
 * script non parte proprio.
 */
const AREE_ESCLUSE = ["/admin", "/area-riservata"];

export function Analytics() {
  const consent = useConsent();
  const pathname = usePathname();

  if (consent?.scelta !== "accettato") return null;
  if (!CLARITY_ID) return null;
  if (AREE_ESCLUSE.some((area) => pathname?.startsWith(area))) return null;

  return (
    <Script
      id="microsoft-clarity"
      strategy="afterInteractive"
      // Lo script viene montato solo dopo il consenso; la chiamata `consent`
      // lo comunica anche a Clarity, che altrimenti userebbe il proprio default.
      onLoad={() => {
        const clarity = (window as unknown as { clarity?: (...args: unknown[]) => void }).clarity;
        clarity?.("consent");
      }}
    >
      {`(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "${CLARITY_ID}");`}
    </Script>
  );
}
