import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import Sitemap from 'vite-plugin-sitemap';

// Define the static routes Google needs to index as potential Sitelinks
const dynamicRoutes = [
    '/',
    '/about',
    '/services',
    '/network',
    '/precedent',
    '/contact',
    '/precedent/for/startup',
    '/precedent/for/small-business',
    '/precedent/for/corporate',
    '/precedent/for/individual'
];

export default defineConfig({
    plugins: [
        react(),
        Sitemap({
            hostname: 'https://cwplegal.africa', // Your exact production domain
            dynamicRoutes,
            readable: true, // Formats the XML nicely
            robots: [{
                userAgent: '*',
                allow: '/',
            }]
        })
    ],
});