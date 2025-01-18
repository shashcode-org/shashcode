/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        display: ["Oswald, ui-serif"],
        body: ["Inter", "sans-serif"],
      },
      colors: {
        signature_yellow: "#E7A420",
        signature_gray: "#7F7C7A",
        signature_light: "#FFFEFD",
        signature_dark: "#2F2D30",
        vite_light: "#ffffffde",
        vite_dark: "#242424",
        primary: "#4A90E2",
        accent: "#50E3C2",
        warning: "#FFC107",
        success: "#4CAF50",
        danger: "#F44336",
      },
    },
  },
  plugins: [],
};

