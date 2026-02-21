/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                serif: ['"Playfair Display"', 'Georgia', 'serif'],
            },
            colors: {
                cwp: {
                    void: '#0a0a0a',
                    base: '#121212',
                    surface: '#171717',
                    border: '#262626',
                },
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out both',
                'fade-up': 'fadeUp 0.6s ease-out both',
                'slide-in-left': 'slideInLeft 0.5s ease-out both',
                'spin-slow': 'spin 8s linear infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(16px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideInLeft: {
                    '0%': { opacity: '0', transform: 'translateX(-16px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
            },
            transitionTimingFunction: {
                'cwp': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
            },
        },
    },
    plugins: [],
}
