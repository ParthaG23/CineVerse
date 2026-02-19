import { useEffect } from "react";

const GoogleLoginButton = ({ onSuccess }) => {
  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: onSuccess,
    });

    google.accounts.id.renderButton(
      document.getElementById("googleBtn"),
      {
        theme: "outline",
        size: "large",
        shape: "pill",
        text: "continue_with",
      }
    );
  }, [onSuccess]);

  return <div id="googleBtn" className="flex justify-center" />;
};

export default GoogleLoginButton;
