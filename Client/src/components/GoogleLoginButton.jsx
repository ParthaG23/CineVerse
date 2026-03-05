import { useEffect, useRef, memo } from "react";

/* GLOBAL SCRIPT LOADER (prevents multiple downloads) */
let googleScriptPromise = null;

const loadGoogleScript = () => {
  if (googleScriptPromise) return googleScriptPromise;

  googleScriptPromise = new Promise((resolve) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }

    const existing = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]'
    );

    if (existing) {
      existing.addEventListener("load", resolve);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = resolve;

    document.body.appendChild(script);
  });

  return googleScriptPromise;
};

const GoogleLoginButton = ({ onSuccess }) => {
  const buttonRef = useRef(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      console.error("Missing VITE_GOOGLE_CLIENT_ID in .env");
      return;
    }

    const initializeGoogle = async () => {
      await loadGoogleScript();

      if (!window.google?.accounts?.id) return;
      if (!buttonRef.current) return;

      /* PREVENT DOUBLE INITIALIZATION */
      if (initializedRef.current) return;
      initializedRef.current = true;

      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            if (onSuccess) onSuccess(response);
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

    return () => {
      if (buttonRef.current) {
        buttonRef.current.innerHTML = "";
      }
      initializedRef.current = false;
    };
  }, [onSuccess]);

  return (
    <div className="flex justify-center w-full">
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