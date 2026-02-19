import { useEffect, useRef, memo } from "react";

const GoogleLoginButton = ({ onSuccess }) => {
  const buttonRef = useRef(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    // 🔒 Safety check for missing client ID
    if (!clientId) {
      console.error("Missing VITE_GOOGLE_CLIENT_ID in .env");
      return;
    }

    // 🚀 Load Google Script if not already loaded
    const loadGoogleScript = () => {
      return new Promise((resolve) => {
        if (window.google?.accounts?.id) {
          resolve();
          return;
        }

        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        document.body.appendChild(script);
      });
    };

    const initializeGoogle = async () => {
      await loadGoogleScript();

      if (!window.google || !buttonRef.current) return;

      // 🧠 Prevent double initialization (IMPORTANT)
      if (initializedRef.current) return;
      initializedRef.current = true;

      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            if (onSuccess) {
              onSuccess(response);
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          shape: "pill",
          text: "continue_with",
          width: 320,
          logo_alignment: "center",
        });
      } catch (err) {
        console.error("Google Login Init Error:", err);
      }
    };

    initializeGoogle();

    // 🧹 Cleanup (important for SPA navigation)
    return () => {
      if (buttonRef.current) {
        buttonRef.current.innerHTML = "";
      }
      initializedRef.current = false;
    };
  }, [onSuccess]);

  return (
    <div className="flex justify-center w-full">
      {/* 🎬 Custom styled wrapper (matches CineVerse UI) */}
      <div
        ref={buttonRef}
        className="
          w-full flex justify-center
          [&>div]:!w-full
        "
      />
    </div>
  );
};

export default memo(GoogleLoginButton);
