export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                // Legacy — Kassandra & Brian (landing, intocable)
                sans: ["'Montserrat'", 'sans-serif'],
                serif: ["'Great Vibes'", 'cursive'],
                montserrat: ["'Montserrat'", 'sans-serif'],
                // Dynamic — invitaciones data-driven
                'inv-body': 'var(--inv-font-body)',
                'inv-display': 'var(--inv-font-display)',
            },
            colors: {
                // ── Kassandra & Brian (landing — intocable) ──────────────
                primary:       "#5D7C89",
                "primary-dark": "#0E1038",
                secondary:     "#F8FAFC",
                accent:        "#CBD5E1",
                "text-dark":   "#1E293B",
                "text-light":  "#64748B",
                "card-bg":     "#FFFFFF",

                // ── Dynamic invitation palette (CSS variables) ──────────
                inv: {
                    primary:       'rgb(var(--inv-primary) / <alpha-value>)',
                    'primary-light': 'rgb(var(--inv-primary-light) / <alpha-value>)',
                    accent:        'rgb(var(--inv-accent) / <alpha-value>)',
                    'accent-warm': 'rgb(var(--inv-accent-warm) / <alpha-value>)',
                    cream:         'rgb(var(--inv-cream) / <alpha-value>)',
                    light:         'rgb(var(--inv-light) / <alpha-value>)',
                    dark:          'rgb(var(--inv-dark) / <alpha-value>)',
                    text:          'rgb(var(--inv-text) / <alpha-value>)',
                    gray:          'rgb(var(--inv-gray) / <alpha-value>)',
                    teal:          'rgb(var(--inv-teal) / <alpha-value>)',
                    lily:          'rgb(var(--inv-lily) / <alpha-value>)',
                    firefly:       'rgb(var(--inv-firefly) / <alpha-value>)',
                    swamp:         'rgb(var(--inv-swamp) / <alpha-value>)',
                },
            },
            animation: {
                'fade-in': 'fadeIn 1s ease-out forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%':   { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
}
