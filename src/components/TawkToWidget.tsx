
import { useEffect } from 'react';

export const TawkToWidget = () => {
  useEffect(() => {
    // Check if Tawk.to script is already loaded
    if (window.Tawk_API) {
      return;
    }

    // Initialize Tawk_API
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    // Create and inject the Tawk.to script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://embed.tawk.to/68434831a62149190d373f54/1it3d44ki';
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');

    // Insert the script into the document
    const firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode?.insertBefore(script, firstScript);

    // Cleanup function
    return () => {
      // Optional: Clean up if needed when component unmounts
      // Note: Tawk.to widget typically persists across page changes
    };
  }, []);

  return null; // This component doesn't render anything visible
};

declare global {
  interface Window {
    Tawk_API: any;
    Tawk_LoadStart: Date;
  }
}
