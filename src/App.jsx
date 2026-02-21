import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Network from './pages/Network';
import PartnerProfile from './pages/PartnerProfile';
import Precedent from './pages/Precedent';
import PersonaHub from './pages/PersonaHub';
import PrecedentArticle from './pages/PrecedentArticle';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

export default function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="about" element={<About />} />
                        <Route path="services" element={<Services />} />
                        <Route path="network" element={<Network />} />
                        <Route path="network/:slug" element={<PartnerProfile />} />
                        <Route path="precedent" element={<Precedent />} />
                        <Route path="precedent/for/:persona" element={<PersonaHub />} />
                        <Route path="precedent/:slug" element={<PrecedentArticle />} />
                        <Route path="contact" element={<Contact />} />
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}
