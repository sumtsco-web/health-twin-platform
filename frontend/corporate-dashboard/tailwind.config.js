/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                background: '#0B0F19', // Very dark blue/black
                surface: '#151B2B',    // Slightly lighter for cards
                surfaceHighlight: '#1E273B',
                primary: {
                    DEFAULT: '#6366F1', // Indigo 500
                    glow: '#818CF8',    // Indigo 400
                },
                accent: {
                    cyan: '#06B6D4',    // Cyan 500
                    purple: '#A855F7',  // Purple 500
                },
                status: {
                    safe: '#10B981',    // Emerald 500
                    warning: '#F59E0B', // Amber 500
                    danger: '#EF4444',  // Red 500
                    critical: '#F43F5E', // Rose 500
                }
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #151B2B 0deg, #0B0F19 180deg)',
                'glass': 'linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
            },
            boxShadow: {
                'glow-primary': '0 0 20px rgba(99, 102, 241, 0.3)',
                'glow-danger': '0 0 20px rgba(239, 68, 68, 0.3)',
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
