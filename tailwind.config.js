export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                serif: ['"Great Vibes"', 'cursive'],
                sans: ['"Montserrat"', 'sans-serif'],
            },
            colors: {
                primary: "#5D7C89",
                secondary: "#F4F6F7",
                accent: "#B0BEC5",
                "card-bg": "#FFFFFF",
            },
            // We can add custom animations back if needed here, 
            // but Tailwind typically handles them via utility classes.
            animation: {
                'fade-in': 'fadeIn 1s ease-out forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            }
        },
    },
    plugins: [],
}
