import { useEffect, useState, useCallback } from "react";
import { X, Share, Plus, MoreVertical, Download } from "lucide-react";

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────
type Platform = "android" | "ios" | null;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────
const DISMISSED_KEY = "pwa_install_dismissed_v2";
const INSTALLED_KEY = "pwa_installed";

function detectPlatform(): Platform {
  const ua = navigator.userAgent;
  const isIOS = /iPhone|iPad|iPod/.test(ua);
  const isAndroid = /Android/.test(ua);
  if (isIOS) return "ios";
  if (isAndroid) return "android";
  return null;
}

function isMobile(): boolean {
  return (
    /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    window.innerWidth < 768
  );
}

function isAlreadyInstalled(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true
  );
}

// ──────────────────────────────────────────────
// iOS Step Component
// ──────────────────────────────────────────────
const IOSStep = ({
  step,
  icon,
  text,
}: {
  step: number;
  icon: React.ReactNode;
  text: React.ReactNode;
}) => (
  <div className="pwa-ios-step">
    <div className="pwa-ios-step-number">{step}</div>
    <div className="pwa-ios-step-content">
      <span className="pwa-ios-step-icon">{icon}</span>
      <span className="pwa-ios-step-text">{text}</span>
    </div>
  </div>
);

// ──────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────
export function PWAInstallBanner() {
  const [platform, setPlatform] = useState<Platform>(null);
  const [visible, setVisible] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  // Capture the Android install prompt
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // Determine visibility
  useEffect(() => {
    if (!isMobile()) return;
    if (isAlreadyInstalled()) return;
    if (localStorage.getItem(DISMISSED_KEY)) return;
    if (localStorage.getItem(INSTALLED_KEY)) return;

    const plat = detectPlatform();
    if (!plat) return;

    setPlatform(plat);

    // For Android: wait for the deferred prompt (up to 3 s), or show guide
    // For iOS: show immediately after a short delay
    const timer = setTimeout(() => {
      setVisible(true);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  // Mark as installed when the PWA is launched standalone after install
  useEffect(() => {
    if (isAlreadyInstalled()) {
      localStorage.setItem(INSTALLED_KEY, "1");
    }
  }, []);

  const dismiss = useCallback(() => {
    setVisible(false);
    localStorage.setItem(DISMISSED_KEY, "1");
  }, []);

  const handleAndroidInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    setInstalling(true);
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        localStorage.setItem(INSTALLED_KEY, "1");
        setVisible(false);
      }
    } finally {
      setInstalling(false);
      setDeferredPrompt(null);
    }
  }, [deferredPrompt]);

  if (!visible || !platform) return null;

  // ── Android Banner ──────────────────────────
  if (platform === "android") {
    return (
      <>
        <style>{pwaStyles}</style>
        <div className="pwa-banner pwa-banner-android" role="banner">
          <div className="pwa-banner-inner">
            <img src="/icon-192.png" alt="DND Jursoc" className="pwa-app-icon" />
            <div className="pwa-text">
              <p className="pwa-title">Instalá la app</p>
              <p className="pwa-subtitle">Acceso rápido desde tu inicio</p>
            </div>
            <button
              className="pwa-install-btn"
              onClick={handleAndroidInstall}
              disabled={installing || !deferredPrompt}
              aria-label="Instalar aplicación"
            >
              {installing ? (
                <span className="pwa-spinner" />
              ) : (
                <>
                  <Download size={14} strokeWidth={2.5} />
                  {deferredPrompt ? "Instalar" : "Agregar"}
                </>
              )}
            </button>
            <button
              className="pwa-close-btn"
              onClick={dismiss}
              aria-label="Cerrar"
            >
              <X size={16} />
            </button>
          </div>

          {/* If no native prompt yet, show manual guide */}
          {!deferredPrompt && (
            <div className="pwa-android-guide">
              <p className="pwa-guide-title">Cómo instalarla manualmente:</p>
              <div className="pwa-android-steps">
                <div className="pwa-android-step">
                  <span className="pwa-android-step-num">1</span>
                  <span>
                    Tocá el menú{" "}
                    <MoreVertical
                      size={13}
                      className="pwa-inline-icon"
                      strokeWidth={2.5}
                    />{" "}
                    (tres puntitos) de Chrome
                  </span>
                </div>
                <div className="pwa-android-step">
                  <span className="pwa-android-step-num">2</span>
                  <span>
                    Seleccioná <strong>"Agregar a pantalla de inicio"</strong>
                  </span>
                </div>
                <div className="pwa-android-step">
                  <span className="pwa-android-step-num">3</span>
                  <span>Confirmá tocando <strong>"Agregar"</strong></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

  // ── iOS Banner ──────────────────────────────
  return (
    <>
      <style>{pwaStyles}</style>
      <div className="pwa-banner pwa-banner-ios" role="banner">
        <div className="pwa-banner-inner">
          <img src="/icon-192.png" alt="DND Jursoc" className="pwa-app-icon" />
          <div className="pwa-text">
            <p className="pwa-title">Instalá la app</p>
            <p className="pwa-subtitle">Acceso directo desde tu inicio</p>
          </div>
          <button
            className="pwa-close-btn"
            onClick={dismiss}
            aria-label="Cerrar"
          >
            <X size={16} />
          </button>
        </div>

        <div className="pwa-ios-steps">
          <IOSStep
            step={1}
            icon={
              <Share
                size={16}
                strokeWidth={2.2}
                className="pwa-share-icon"
              />
            }
            text={
              <>
                Tocá el botón de{" "}
                <strong>Compartir</strong>{" "}
                <Share size={13} strokeWidth={2.5} className="pwa-inline-icon" />{" "}
                abajo en Safari
              </>
            }
          />
          <IOSStep
            step={2}
            icon={<Plus size={16} strokeWidth={2.5} className="pwa-plus-icon" />}
            text={
              <>
                Seleccioná{" "}
                <strong>"Agregar a pantalla de inicio"</strong>
              </>
            }
          />
          <IOSStep
            step={3}
            icon={<span className="pwa-check-icon">✓</span>}
            text={
              <>
                Tocá <strong>"Agregar"</strong> arriba a la derecha
              </>
            }
          />
        </div>

        {/* iOS arrow pointing down to the share bar */}
        <div className="pwa-ios-arrow" aria-hidden="true">▼</div>
      </div>
    </>
  );
}

// ──────────────────────────────────────────────
// Styles (injected as <style> to avoid coupling)
// ──────────────────────────────────────────────
const pwaStyles = `
  .pwa-banner {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 9999;
    background: linear-gradient(135deg, #0d1a3a 0%, #111c3f 60%, #0f2251 100%);
    border-top: 1px solid rgba(99, 149, 255, 0.25);
    box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.55), 0 -1px 0 rgba(99, 149, 255, 0.15);
    padding: 12px 16px;
    font-family: 'Inter', system-ui, sans-serif;
    animation: pwa-slide-up 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }

  @keyframes pwa-slide-up {
    from { transform: translateY(100%); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
  }

  .pwa-banner-inner {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .pwa-app-icon {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.4);
  }

  .pwa-text {
    flex: 1;
    min-width: 0;
  }

  .pwa-title {
    font-size: 14px;
    font-weight: 700;
    color: #fff;
    margin: 0 0 1px;
    letter-spacing: -0.2px;
  }

  .pwa-subtitle {
    font-size: 11.5px;
    color: rgba(180, 200, 255, 0.7);
    margin: 0;
  }

  .pwa-install-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    background: linear-gradient(135deg, #3a7bd5, #2563eb);
    color: #fff;
    border: none;
    border-radius: 20px;
    padding: 7px 14px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    flex-shrink: 0;
    box-shadow: 0 2px 12px rgba(37, 99, 235, 0.5);
    transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
    -webkit-tap-highlight-color: transparent;
  }

  .pwa-install-btn:active {
    transform: scale(0.95);
    box-shadow: 0 1px 6px rgba(37, 99, 235, 0.4);
  }

  .pwa-install-btn:disabled {
    opacity: 0.6;
    cursor: default;
  }

  .pwa-close-btn {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.12);
    color: rgba(255,255,255,0.6);
    border-radius: 50%;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: background 0.15s, color 0.15s;
    -webkit-tap-highlight-color: transparent;
  }

  .pwa-close-btn:active {
    background: rgba(255,255,255,0.18);
    color: #fff;
  }

  .pwa-spinner {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: pwa-spin 0.7s linear infinite;
  }

  @keyframes pwa-spin {
    to { transform: rotate(360deg); }
  }

  /* ── Android guide ── */
  .pwa-android-guide {
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid rgba(99,149,255,0.15);
  }

  .pwa-guide-title {
    font-size: 11px;
    font-weight: 600;
    color: rgba(180,200,255,0.6);
    margin: 0 0 7px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .pwa-android-steps {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .pwa-android-step {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12.5px;
    color: rgba(210,225,255,0.85);
    line-height: 1.35;
  }

  .pwa-android-step-num {
    background: rgba(37,99,235,0.35);
    border: 1px solid rgba(99,149,255,0.3);
    color: #93c5fd;
    font-size: 11px;
    font-weight: 700;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  /* ── iOS steps ── */
  .pwa-ios-steps {
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid rgba(99,149,255,0.15);
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .pwa-ios-step {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 12.5px;
    color: rgba(210,225,255,0.85);
    line-height: 1.4;
  }

  .pwa-ios-step-number {
    background: rgba(37,99,235,0.35);
    border: 1px solid rgba(99,149,255,0.3);
    color: #93c5fd;
    font-size: 11px;
    font-weight: 700;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .pwa-ios-step-content {
    display: flex;
    align-items: center;
    gap: 5px;
    flex-wrap: wrap;
  }

  .pwa-share-icon {
    color: #60a5fa;
    vertical-align: middle;
  }

  .pwa-plus-icon {
    color: #34d399;
    vertical-align: middle;
  }

  .pwa-check-icon {
    color: #34d399;
    font-size: 14px;
    font-weight: 700;
  }

  .pwa-inline-icon {
    display: inline;
    vertical-align: middle;
    position: relative;
    top: -1px;
    color: #60a5fa;
  }

  .pwa-ios-arrow {
    text-align: center;
    font-size: 12px;
    color: rgba(99,149,255,0.5);
    margin-top: 6px;
    animation: pwa-bounce 1.4s ease-in-out infinite;
  }

  @keyframes pwa-bounce {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(4px); }
  }
`;
