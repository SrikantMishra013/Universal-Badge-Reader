/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      scrollBehavior: ["responsive"],
      animation: {
        "fade-in-slide": "fadeInSlide 0.5s ease-out",
      },
      keyframes: {
        fadeInSlide: {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
