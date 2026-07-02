import { useEffect, useRef } from "react";

declare global {
  interface Window {
    onloadTurnstileCallback?: () => void;
    turnstile?: {
      render: (container: string | HTMLElement, options: any) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

interface TurnstileProps {
  siteKey: string;
  onVerify: (token: string | null) => void;
  onExpire?: () => void;
  onError?: () => void;
}

export function Turnstile({ siteKey, onVerify, onExpire, onError }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!siteKey) {
      console.warn("Turnstile: siteKey is not configured.");
      return;
    }

    // Callback global de inicialización
    window.onloadTurnstileCallback = () => {
      renderWidget();
    };

    // Inyectar el script de Turnstile de forma dinámica si no existe
    let script = document.getElementById("cloudflare-turnstile-script") as HTMLScriptElement;
    if (!script) {
      script = document.createElement("script");
      script.id = "cloudflare-turnstile-script";
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    } else if (window.turnstile) {
      renderWidget();
    }

    function renderWidget() {
      if (containerRef.current && window.turnstile && !widgetIdRef.current) {
        try {
          widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            callback: (token: string) => {
              onVerify(token);
            },
            "expired-callback": () => {
              onVerify(null);
              if (onExpire) onExpire();
            },
            "error-callback": () => {
              onVerify(null);
              if (onError) onError();
            },
            theme: "auto",
          });
        } catch (err) {
          console.error("Error rendering Turnstile widget:", err);
        }
      }
    }

    return () => {
      // Remover el widget para evitar fugas de memoria al desmontar
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (e) {
          console.warn("Error removing Turnstile widget:", e);
        }
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, onVerify, onExpire, onError]);

  return <div ref={containerRef} className="flex justify-center my-4 min-h-[65px]" />;
}
