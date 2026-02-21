import React, { useState } from 'react';
import {
    Menu, X, ChevronRight, Globe, Shield,
    Briefcase, BookOpen, ArrowRight, Building2,
    Loader2, Zap, ArrowUpRight
} from 'lucide-react';

export default function App() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activePersona, setActivePersona] = useState('corporate');

    // AI Intake State
    const [intakeStep, setIntakeStep] = useState(1);
    const [aiInput, setAiInput] = useState('');
    const [contactInfo, setContactInfo] = useState({ email: '', method: '' });
    const [aiResult, setAiResult] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiError, setAiError] = useState('');

    const personas = {
        corporate: {
            title: "Corporate & Institutional",
            description: "Robust legal frameworks, corporate governance, and dispute resolution for large-scale enterprises navigating complex regulatory environments.",
            features: ["Mergers & Acquisitions", "Regulatory Compliance", "Complex Commercial Litigation"]
        },
        business: {
            title: "SME & Emerging Business",
            description: "Agile legal structuring, IP protection, and foundational corporate governance designed to scale with growing businesses.",
            features: ["Company Formation & CAC", "Contract Lifecycle Management", "Employment & Labor Advisory"]
        }
    };

    const handleStepOneSubmit = () => {
        if (!aiInput.trim()) return;
        setIntakeStep(2);
    };

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        if (!contactInfo.email) return;
        executeAIAnalysis();
    };

    const handleChipClick = (text) => {
        setAiInput(text);
    };

    const executeAIAnalysis = async () => {
        setIsGenerating(true);
        setIntakeStep(3);
        setAiError('');
        setAiResult(null);

        const apiKey = "";
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

        const payload = {
            contents: [{ parts: [{ text: aiInput }] }],
            systemInstruction: {
                parts: [{ text: "You are an elite legal intake strategist for Clearwater Partners, a premium law firm in Nigeria. Analyze the user's business scenario. Keep your tone highly professional, authoritative, yet helpful. Categorize their needs and provide a brief strategic outlook. NEVER give explicit legal advice, only strategic categorizations of legal risk." }]
            },
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        classification: { type: "STRING", description: "Either 'SME / Emerging' or 'Corporate / Institutional'" },
                        keyRisks: { type: "ARRAY", items: { type: "STRING" }, description: "2 to 3 immediate legal or regulatory considerations." },
                        recommendedAction: { type: "STRING", description: "A brief 2-sentence professional recommendation on how Clearwater can assist." }
                    }
                }
            }
        };

        const delays = [1000, 2000, 4000, 8000, 16000];
        let attempt = 0;
        let success = false;

        while (attempt <= 5 && !success) {
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) throw new Error("API response error");

                const data = await response.json();
                const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

                if (textResponse) {
                    setAiResult(JSON.parse(textResponse));
                    success = true;
                } else {
                    throw new Error("Invalid format");
                }
            } catch (error) {
                if (attempt === 5) {
                    setAiError("We couldn't process your request at this time. Please try again later.");
                    break;
                }
                await new Promise(resolve => setTimeout(resolve, delays[attempt]));
                attempt++;
            }
        }

        setIsGenerating(false);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] font-sans text-neutral-50 selection:bg-neutral-200 selection:text-neutral-900">

            {/* Navigation */}
            <nav className="absolute w-full z-50 bg-transparent text-neutral-50 pt-6">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                    <div className="flex justify-between h-16 items-center border-b border-neutral-800 pb-6">
                        <div className="flex-shrink-0 flex items-center gap-4">
                            {/* Approximated CWP Logo Mark in SVG */}
                            <svg width="40" height="24" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M40 30 C40 10, 10 10, 10 30 C10 50, 40 50, 40 30 Z" stroke="white" strokeWidth="8" strokeLinecap="round" />
                                <path d="M35 30 L55 50 L75 20 L90 40" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="font-bold text-lg tracking-[0.15em] uppercase">Clearwater<span className="font-light">Partners</span></span>
                        </div>

                        <div className="hidden md:flex space-x-12 items-center text-sm">
                            <div className="flex items-center gap-2 text-white">
                                <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                                <a href="#" className="font-medium hover:text-neutral-300 transition-colors">Services</a>
                            </div>
                            <a href="#" className="font-medium text-neutral-400 hover:text-white transition-colors">The Network</a>
                            <a href="#" className="font-medium text-neutral-400 hover:text-white transition-colors">Precedent</a>
                            <a href="#" className="font-medium text-neutral-400 hover:text-white transition-colors">Contacts</a>
                        </div>

                        <div className="md:hidden flex items-center">
                            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* HERO: Pure Monochromatic Brutalism */}
            <section className="relative min-h-screen flex flex-col justify-center pt-32 pb-20 overflow-hidden bg-[#0a0a0a]">

                <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10 w-full">

                    {/* Left Content (Text & CWI Form) */}
                    <div className="lg:col-span-7 flex flex-col justify-center pr-0 lg:pr-12">

                        <h1 className="text-6xl sm:text-7xl md:text-[6rem] font-medium tracking-tight mb-8 leading-[1.05] text-white">
                            Strategic assessment <br />
                            <span className="font-serif italic font-light text-neutral-400 tracking-normal pr-4">for your</span>
                            business
                        </h1>

                        <div className="flex flex-col md:flex-row gap-8 mb-16 items-start">
                            <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] max-w-[320px] leading-relaxed text-neutral-500 font-semibold">
                                Describe your current maneuver or challenge — our intelligence engine (CWI) will outline immediate legal risk vectors.
                            </p>
                        </div>

                        {/* The Integrated AI Intake Component */}
                        <div className="max-w-xl relative">
                            <div className="absolute -left-6 lg:-left-12 top-0 bottom-0 w-px bg-neutral-800"></div>

                            {intakeStep === 1 && (
                                <div className="animate-in fade-in slide-in-from-left-4 duration-700">
                                    <div className="relative group">
                                        <textarea
                                            value={aiInput}
                                            onChange={(e) => setAiInput(e.target.value)}
                                            placeholder="e.g., We are raising a $2M seed round and need to restructure our cap table..."
                                            className="w-full bg-[#121212] border border-neutral-800 focus:border-neutral-500 text-white p-6 h-40 focus:ring-0 focus:outline-none placeholder-neutral-600 resize-none text-base transition-colors rounded-none"
                                        />
                                        <div className="absolute bottom-4 right-4 text-neutral-600 text-[10px] uppercase tracking-widest font-mono">
                                            Confidential // CWI
                                        </div>

                                        {/* Minimalist Prompt Chips */}
                                        <div className="absolute top-full left-0 mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-hide w-full">
                                            <button onClick={() => handleChipClick("We are preparing for a Series A funding round and need a comprehensive compliance audit.")} className="whitespace-nowrap text-[10px] bg-[#121212] hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white px-3 py-1.5 transition-colors uppercase tracking-wider font-semibold">
                                                Series A Structuring
                                            </button>
                                            <button onClick={() => handleChipClick("We are looking to acquire a smaller competitor in the logistics space and need to structure the M&A.")} className="whitespace-nowrap text-[10px] bg-[#121212] hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white px-3 py-1.5 transition-colors uppercase tracking-wider font-semibold">
                                                Competitor Acquisition
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8 mt-16">
                                        <button
                                            onClick={handleStepOneSubmit}
                                            disabled={!aiInput.trim()}
                                            className="bg-white hover:bg-neutral-200 disabled:bg-neutral-900 disabled:text-neutral-700 text-black font-medium py-3 px-8 rounded-full transition-all flex items-center justify-center gap-3 text-sm"
                                        >
                                            Analyze Scenario <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {intakeStep === 2 && (
                                <div className="animate-in fade-in duration-500 bg-[#121212] border border-neutral-800 p-8 lg:p-10">
                                    <h3 className="text-2xl font-medium mb-3 text-white tracking-tight">Secure Authentication</h3>
                                    <p className="text-neutral-400 text-sm mb-10 leading-relaxed font-light">
                                        To generate a highly tailored strategic brief, please authenticate. A confidential copy will be securely sent to your inbox.
                                    </p>

                                    <form onSubmit={handleEmailSubmit} className="flex flex-col gap-6">
                                        <div className="relative">
                                            <input
                                                type="email"
                                                required
                                                value={contactInfo.email}
                                                onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                                                placeholder="Corporate Email Address"
                                                className="w-full bg-transparent border-b border-neutral-700 focus:border-white text-white px-0 py-3 focus:outline-none focus:ring-0 rounded-none placeholder-neutral-600 transition-colors"
                                            />
                                        </div>
                                        <button type="submit" className="w-fit mt-4 bg-white hover:bg-neutral-200 text-black px-8 py-3 rounded-full font-medium transition-colors flex items-center gap-3 text-sm">
                                            Unlock Analysis <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                                        </button>
                                    </form>
                                </div>
                            )}

                            {intakeStep === 3 && (
                                <div className="animate-in fade-in duration-700 w-full lg:w-[150%] xl:w-[160%] z-20 relative bg-[#121212] border border-neutral-800 p-8 md:p-12 shadow-2xl">
                                    {isGenerating ? (
                                        <div className="flex flex-col items-start py-12 text-neutral-400">
                                            <Loader2 className="animate-spin w-8 h-8 text-white mb-8" />
                                            <p className="text-xl font-medium text-white mb-3 tracking-tight">Compiling Strategic Profile...</p>
                                            <p className="text-sm font-light">Cross-referencing regulatory frameworks and Clearwater precedent.</p>
                                        </div>
                                    ) : aiError ? (
                                        <div className="py-8">
                                            <div className="inline-block p-4 border border-neutral-700 text-neutral-300 mb-6 bg-[#0a0a0a] text-sm">
                                                {aiError}
                                            </div>
                                            <button onClick={() => setIntakeStep(1)} className="text-white hover:text-neutral-300 text-sm font-medium border-b border-white pb-1">
                                                Restart Initialization
                                            </button>
                                        </div>
                                    ) : aiResult && (
                                        <div>
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-neutral-800 pb-8 mb-10 gap-6">
                                                <div>
                                                    <h3 className="text-3xl font-medium text-white mb-2 tracking-tight">Strategic Brief</h3>
                                                    <p className="text-neutral-500 text-xs font-mono tracking-widest uppercase">AUTH // {contactInfo.email}</p>
                                                </div>
                                                <span className="border border-neutral-700 text-neutral-300 px-4 py-2 rounded-full text-xs font-bold tracking-[0.15em] uppercase">
                                                    {aiResult.classification}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-12">
                                                <div>
                                                    <h4 className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold mb-8 flex items-center gap-3">
                                                        Immediate Risk Vectors
                                                        <div className="h-px bg-neutral-800 flex-grow"></div>
                                                    </h4>
                                                    <ul className="space-y-6">
                                                        {aiResult.keyRisks.map((risk, idx) => (
                                                            <li key={idx} className="flex items-start gap-4">
                                                                <span className="text-neutral-600 font-mono text-xs mt-1">0{idx + 1}</span>
                                                                <span className="text-neutral-300 text-sm leading-relaxed font-light">{risk}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div>
                                                    <h4 className="text-[10px] uppercase tracking-[0.2em] text-white font-bold mb-8 flex items-center gap-3">
                                                        The Clearwater Approach
                                                        <div className="h-px bg-neutral-800 flex-grow"></div>
                                                    </h4>
                                                    <p className="text-neutral-300 text-sm leading-relaxed mb-10 font-light">
                                                        {aiResult.recommendedAction}
                                                    </p>
                                                    <button className="bg-white hover:bg-neutral-200 text-black font-medium py-3 px-8 rounded-full transition-colors flex items-center gap-3 text-sm">
                                                        Schedule Consultation <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="pt-8 border-t border-neutral-800 mt-4">
                                                <button onClick={() => { setAiInput(''); setIntakeStep(1); }} className="text-neutral-500 hover:text-white text-[10px] font-mono uppercase tracking-[0.2em] transition-colors">
                                                    [ Run Another Scenario ]
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Content (Abstract CW Logo curves) */}
                    <div className="hidden lg:flex lg:col-span-5 relative items-center justify-end overflow-visible pointer-events-none">
                        <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.03]">
                            <svg width="100%" height="100%" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* Outer sweeping C curve */}
                                <path d="M 600,100 C 100,100 0,300 0,500 C 0,700 200,800 500,800" stroke="white" strokeWidth="40" strokeLinecap="round" />
                                {/* Intersecting W/P loop */}
                                <path d="M 300,500 C 300,200 700,200 700,450 C 700,600 500,700 300,400" stroke="white" strokeWidth="40" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="500" cy="450" r="100" stroke="white" strokeWidth="40" />
                            </svg>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services/Personas Section - Minimalist Grid */}
            <section className="py-32 bg-white text-black border-t border-neutral-200">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

                    <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <h2 className="text-4xl md:text-5xl font-medium tracking-tight leading-tight">
                            Explore our <br /><span className="font-serif italic text-neutral-500 font-light">legal frameworks</span>
                        </h2>
                        <p className="text-neutral-500 max-w-sm text-sm font-light leading-relaxed">
                            Our practice is fundamentally aligned with the scale and velocity of your ambitions, spanning critical corporate sectors.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-neutral-200">
                        {/* Left Nav */}
                        <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-neutral-200 bg-neutral-50">
                            <button
                                onClick={() => setActivePersona('corporate')}
                                className={`w-full p-8 text-left transition-all flex items-center justify-between border-b border-neutral-200 ${activePersona === 'corporate' ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}
                            >
                                <div className="flex items-center gap-4">
                                    {activePersona === 'corporate' && <div className="w-1.5 h-1.5 rounded-full bg-black"></div>}
                                    <h3 className={`font-medium tracking-wide ${activePersona === 'corporate' ? 'text-black' : 'text-neutral-500'}`}>Corporate Governance</h3>
                                </div>
                            </button>

                            <button
                                onClick={() => setActivePersona('business')}
                                className={`w-full p-8 text-left transition-all flex items-center justify-between ${activePersona === 'business' ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}
                            >
                                <div className="flex items-center gap-4">
                                    {activePersona === 'business' && <div className="w-1.5 h-1.5 rounded-full bg-black"></div>}
                                    <h3 className={`font-medium tracking-wide ${activePersona === 'business' ? 'text-black' : 'text-neutral-500'}`}>SME & Emerging</h3>
                                </div>
                            </button>
                        </div>

                        {/* Right Content List */}
                        <div className="lg:col-span-8 bg-white">
                            <div className="p-8 lg:p-12 pb-6 border-b border-neutral-200">
                                <h3 className="text-2xl font-medium mb-4">{personas[activePersona].title}</h3>
                                <p className="text-neutral-600 font-light text-sm max-w-xl leading-relaxed">{personas[activePersona].description}</p>
                            </div>
                            <ul className="flex flex-col">
                                {personas[activePersona].features.map((feature, idx) => (
                                    <li key={idx} className="group border-b border-neutral-200 last:border-0 hover:bg-neutral-50 transition-colors">
                                        <a href="#" className="p-8 flex items-center justify-between">
                                            <span className="text-neutral-700 group-hover:text-black transition-colors font-medium">{feature}</span>
                                            <ArrowUpRight size={18} className="text-neutral-400 group-hover:text-black transition-colors" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* PRECEDENT SECTION (SEO Hub mapped to DGK Case Studies design) */}
            <section className="bg-[#0a0a0a] text-white pt-24 pb-32 border-t border-neutral-900">

                {/* Top Grid Area (Mimicking DGK client logos grid) */}
                <div className="border-t border-b border-neutral-800 mb-20 overflow-x-auto">
                    <div className="max-w-[1400px] mx-auto min-w-[800px] grid grid-cols-4 relative">
                        {/* Intersection Dots */}
                        <div className="absolute top-[-3px] left-0 w-1.5 h-1.5 bg-neutral-500 rounded-full"></div>
                        <div className="absolute top-[-3px] left-1/4 w-1.5 h-1.5 bg-neutral-500 rounded-full"></div>
                        <div className="absolute top-[-3px] left-2/4 w-1.5 h-1.5 bg-neutral-500 rounded-full"></div>
                        <div className="absolute top-[-3px] left-3/4 w-1.5 h-1.5 bg-neutral-500 rounded-full"></div>
                        <div className="absolute top-[-3px] right-0 w-1.5 h-1.5 bg-neutral-500 rounded-full"></div>

                        <div className="absolute bottom-[-3px] left-0 w-1.5 h-1.5 bg-neutral-500 rounded-full"></div>
                        <div className="absolute bottom-[-3px] left-1/4 w-1.5 h-1.5 bg-neutral-500 rounded-full"></div>
                        <div className="absolute bottom-[-3px] left-2/4 w-1.5 h-1.5 bg-neutral-500 rounded-full"></div>
                        <div className="absolute bottom-[-3px] left-3/4 w-1.5 h-1.5 bg-neutral-500 rounded-full"></div>
                        <div className="absolute bottom-[-3px] right-0 w-1.5 h-1.5 bg-neutral-500 rounded-full"></div>

                        {/* Network Nodes (Abstracting the global network) */}
                        <div className="border-r border-neutral-800 p-10 flex items-center justify-center">
                            <span className="text-neutral-500 font-bold tracking-widest uppercase text-xs flex items-center gap-2"><Globe size={14} /> Node: Lagos</span>
                        </div>
                        <div className="border-r border-neutral-800 p-10 flex items-center justify-center">
                            <span className="text-neutral-500 font-bold tracking-widest uppercase text-xs flex items-center gap-2"><Globe size={14} /> Node: Abuja</span>
                        </div>
                        <div className="border-r border-neutral-800 p-10 flex items-center justify-center">
                            <span className="text-neutral-500 font-bold tracking-widest uppercase text-xs flex items-center gap-2"><Globe size={14} /> Network Core</span>
                        </div>
                        <div className="p-10 flex items-center justify-center">
                            <span className="text-neutral-500 font-bold tracking-widest uppercase text-xs flex items-center gap-2"><Shield size={14} /> Compliance</span>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                        <h2 className="text-5xl md:text-6xl font-serif italic text-white tracking-tight leading-none">Precedent.</h2>

                        <div className="flex gap-4">
                            <button className="w-12 h-12 rounded-full border border-neutral-800 flex items-center justify-center hover:bg-neutral-800 transition-colors">
                                <ArrowRight size={18} className="text-white transform rotate-180" />
                            </button>
                            <button className="w-6 h-12 rounded-full bg-neutral-900 flex items-center justify-center hover:bg-neutral-800 transition-colors">
                                <ArrowRight size={20} className="text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Cards Grid matching DGK */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { tag: "Corporate Governance", title: "Navigating the New CAC Tax Reforms: A Guide for SMEs", excerpt: "Strategic breakdown of immediate liabilities." },
                            { tag: "Dispute Resolution", title: "Implications of Alternative Dispute Resolution in Tech Contracts", excerpt: "Mitigating risk in software SLAs." },
                            { tag: "M&A Advisory", title: "Structuring Cross-Border Acquisitions in West Africa", excerpt: "Regulatory hurdles and compliance mapping." },
                            { tag: "Network News", title: "Clearwater Expands Network Operations into Real Estate", excerpt: "Scaling expertise across jurisdictions." }
                        ].map((article, i) => (
                            <div key={i} className="bg-[#121212] border border-neutral-800 rounded-xl p-8 flex flex-col h-[320px] hover:border-neutral-600 transition-all group cursor-pointer">
                                <div className="mb-6">
                                    <span className="inline-block bg-neutral-900 text-neutral-400 text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full border border-neutral-800">
                                        {article.tag}
                                    </span>
                                </div>
                                <h3 className="text-xl font-medium text-white mb-4 leading-snug group-hover:text-neutral-300 transition-colors">
                                    {article.title}
                                </h3>
                                <p className="text-sm text-neutral-500 font-light mt-auto">
                                    {article.excerpt}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer (Strict Brutalist Grid) */}
            <footer className="bg-[#050505] text-neutral-400 pt-20 pb-10 border-t border-neutral-900">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

                    <div className="grid grid-cols-1 md:grid-cols-12 border-t border-b border-neutral-800">

                        {/* Logo Area */}
                        <div className="md:col-span-3 p-8 border-b md:border-b-0 md:border-r border-neutral-800 flex flex-col justify-between">
                            <span className="font-bold text-xl text-white tracking-[0.15em] uppercase">Clearwater</span>
                            <div className="mt-12 space-y-3 text-xs font-light">
                                <a href="#" className="block hover:text-white transition-colors">Our services</a>
                                <a href="#" className="block hover:text-white transition-colors">About us</a>
                                <a href="#" className="block hover:text-white transition-colors">The Network</a>
                                <a href="#" className="block hover:text-white transition-colors">Precedent</a>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="md:col-span-3 p-8 border-b md:border-b-0 md:border-r border-neutral-800 flex flex-col items-center justify-center text-center min-h-[250px]">
                            <span className="text-[10px] uppercase tracking-[0.2em] mb-4 font-bold text-neutral-600">Headquarters</span>
                            <p className="text-neutral-300 font-light leading-relaxed">
                                Clearwater Network<br />Victoria Island,<br />Lagos, Nigeria
                            </p>
                        </div>

                        {/* Phone */}
                        <div className="md:col-span-3 p-8 border-b md:border-b-0 md:border-r border-neutral-800 flex flex-col items-center justify-center text-center">
                            <span className="text-[10px] uppercase tracking-[0.2em] mb-4 font-bold text-neutral-600">Direct Line</span>
                            <p className="text-neutral-300 font-light">+234 800 000 0000</p>
                        </div>

                        {/* Email */}
                        <div className="md:col-span-3 p-8 flex flex-col items-center justify-center text-center">
                            <span className="text-[10px] uppercase tracking-[0.2em] mb-4 font-bold text-neutral-600">Intelligence Desk</span>
                            <p className="text-neutral-300 font-light">strategy@clearwater.com</p>
                        </div>

                    </div>

                    {/* Copyright Row */}
                    <div className="flex flex-col md:flex-row justify-between items-center mt-8 text-[10px] uppercase tracking-widest font-mono text-neutral-600">
                        <span>© 2026 Clearwater Partners. All rights reserved.</span>
                        <span className="mt-4 md:mt-0">Confidentiality & Privacy Policy</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}