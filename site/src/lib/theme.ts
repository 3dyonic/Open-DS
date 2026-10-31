// The site theme: shared by the switch (client) and the layout (server).
export const THEME_KEY = "open-ds-theme";
export const DARK_QUERY = "(prefers-color-scheme: dark)";

// Runs in <head> before the page paints, so a saved choice never flashes the other theme.
// A saved choice that matches the device is dropped: the site follows the device again.
export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");var d=matchMedia("${DARK_QUERY}").matches?"dark":"light";if(t==="light"||t==="dark"){if(t===d){localStorage.removeItem("${THEME_KEY}")}else{document.documentElement.dataset.theme=t}}}catch(e){}})();`;
