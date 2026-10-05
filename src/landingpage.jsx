import React, { useState } from 'react';
import {
  MessageCircle,
  ShieldCheck,
  Star,
  CheckCircle2,
  Menu,
  X,
  Smile,
  AlertCircle,
  BadgeCheck,
  Truck,
  MapPin,
} from 'lucide-react';

// Images: same file names as before (replace the files in src/assets with your optimized versions)
import phoneImg from './assets/phone.webp';
import desktopImg from './assets/desktop.webp';
import Logo from './assets/ds.webp';
import shop from './assets/new.webp';
import profile from './assets/profile.webp';
import intro from './assets/intro.webp';
import checkout from './assets/checkout.webp';

// ── Image dimensions ─────────────────────────────────────────────────────────
// IMPORTANT: set these to the real pixel width/height of each image file in src/assets
// (right-click file > Properties > Details). Correct values = zero layout shift (CLS).
const DIMS = {
  logo:     { width: 500,  height: 500 },
  desktop:  { width: 1400, height: 875 },
  phone:    { width: 400,  height: 726 },
  shop:     { width: 500,  height: 889 },
  profile:  { width: 500,  height: 910 },
  intro:    { width: 500,  height: 912 },
  checkout: { width: 500,  height: 900 },
};
// ────────────────────────────────────────────────────────────────────────────

// ── Supabase: loaded lazily (keeps ~73 KiB of JS out of the first load) ─────
let supabasePromise;
const getSupabase = () => {
  if (!supabasePromise) {
    supabasePromise = import('@supabase/supabase-js')
      .then(({ createClient }) => {
        const url = import.meta.env.VITE_SUPABASE_URL;
        const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
        if (!url || !key) {
          throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
        }
        return createClient(url, key);
      })
      .catch((err) => {
        supabasePromise = undefined; // allow a retry instead of caching the failure
        throw err;
      });
  }
  return supabasePromise;
};
// ────────────────────────────────────────────────────────────────────────────

// ── Accepts an email OR a phone number in one field ─────────────────────────
const parseContact = (raw) => {
  const value = raw.trim();

  if (value.includes('@')) {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    return ok ? { type: 'email', value: value.toLowerCase() } : null;
  }

  let phone = value.replace(/[\s\-().]/g, '');
  if (!/^\+?\d{9,15}$/.test(phone)) return null;

  // Kenyan numbers: 07XXXXXXXX / 01XXXXXXXX / 2547XXXXXXXX  ->  +2547XXXXXXXX
  if (/^0[17]\d{8}$/.test(phone)) phone = '+254' + phone.slice(1);
  else if (/^254[17]\d{8}$/.test(phone)) phone = '+' + phone;

  return { type: 'phone', value: phone };
};
// ────────────────────────────────────────────────────────────────────────────

// Brand Palette
const brandColors = {
  bg: 'bg-[#1f2a37]',
  text: 'text-[#1f2a37]',
  border: 'border-[#1f2a37]',
  lightBg: 'bg-slate-50',
  accent: 'text-indigo-600',
};

// Static content lives outside the component so it isn't recreated on every render
const PROBLEMS = [
  { icon: AlertCircle, label: 'Buyers worry about paying the wrong seller.' },
  { icon: Smile, label: 'Sellers deal with buyers who never show up' },
  { icon: MessageCircle, label: 'Everything happens in scattered DMs with no record' },
];

const SELLER_POINTS = [
  { title: 'Create your shop', desc: 'Set up your shop, add your products and start selling.' },
  { title: 'List your items for free', desc: 'Upload your clothes, add prices and reach new buyers.' },
  { title: 'Manage everything in one place', desc: 'Keep your products, chats, orders and payments organised.' },
  { title: 'Build a following of loyal buyers', desc: 'Buyers can follow your profile and get notified whenever you drop new pieces.' },
];

const TRUST_POINTS = [
  { icon: ShieldCheck, text: 'Pay securely' },
  { icon: MessageCircle, text: 'Chat before buying' },
  { icon: BadgeCheck, text: 'Real buyer reviews' },
  { icon: Truck, text: 'Clear delivery' },
];

const BUYER_POINTS = [
  { title: 'Discover local sellers', desc: 'Find boutiques, thrift sellers and fashion listings in one place.' },
  { title: 'Follow your favourite shops', desc: 'Get notified when sellers add new products.' },
  { title: 'See clear prices and real reviews', desc: 'Make informed decisions before you buy.' },
  { title: 'Pay securely', desc: 'Funds are held securely and only released once you confirm your order arrived.' },
];

const STEPS = [
  { step: '01', icon: MapPin, title: 'Discover', desc: 'Browse products and shops.' },
  { step: '02', icon: MessageCircle, title: 'Chat', desc: 'Ask questions and confirm the details.' },
  { step: '03', icon: ShieldCheck, title: 'Pay & receive', desc: 'Pay securely, receive your order and confirm delivery.' },
];

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', contact: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ── Saves to Supabase (client is loaded on first focus / submit) ──────────
  const handleJoin = async (e) => {
    e.preventDefault();
    if (!formData.contact || !formData.name) return;

    const contact = parseContact(formData.contact);
    if (!contact) {
      setError('Please enter a valid email address or phone number.');
      return;
    }

    setIsLoading(true);
    setError('');

    let sbError = null;
    try {
      // Email OR phone is stored in the existing `email` column (no new column needed)
      const supabase = await getSupabase();
      const result = await supabase
        .from('waitlist')
        .insert([{ full_name: formData.name.trim(), email: contact.value }]);
      sbError = result.error;
    } catch (err) {
      sbError = err;
    }

    setIsLoading(false);

    if (sbError) {
      // Real reason is visible in the browser console (F12) while you debug
      console.error('Waitlist error:', sbError);
      if (sbError.code === '23505') {
        setError('This email or phone number is already on the waitlist!');
      } else {
        setError('Something went wrong. Please try again.');
      }
      return;
    }

    setSubmitted(true);
    setFormData({ name: '', contact: '' });
  };
  // ────────────────────────────────────────────────────────────────────────

  const scrollToWaitlist = () => {
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-600 selection:bg-[#1f2a37] selection:text-white overflow-x-hidden">

      {/* Navigation */}
      <header>
        <nav aria-label="Main" className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <button
                type="button"
                aria-label="Wireshops — back to top"
                className="flex-shrink-0 flex items-center gap-2 cursor-pointer"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                {/* Logo size reduced to w-10 h-10 */}
                <span className={`w-10 h-10 ${brandColors.bg} rounded-xl flex items-center justify-center shadow-lg shadow-gray-200 overflow-hidden`}>
                  <img
                    src={Logo}
                    alt=""
                    width={DIMS.logo.width}
                    height={DIMS.logo.height}
                    className="w-full h-full object-cover"
                  />
                </span>
                <span className={`font-bold text-2xl ${brandColors.text} tracking-tight`}>Wireshops</span>
              </button>

              <div className="hidden md:flex items-center space-x-8">
                <a href="#problem" className="text-slate-600 hover:text-[#1f2a37] font-medium text-sm transition-colors">Why Wireshops</a>
                <a href="#sellers" className="text-slate-600 hover:text-[#1f2a37] font-medium text-sm transition-colors">Sell Clothes</a>
                <a href="#buyers" className="text-slate-600 hover:text-[#1f2a37] font-medium text-sm transition-colors">Shop Fashion</a>
                <button type="button" onClick={scrollToWaitlist} className={`${brandColors.bg} text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-all shadow-md hover:shadow-xl transform hover:-translate-y-0.5`}>
                  Join Now
                </button>
              </div>

              <div className="md:hidden flex items-center">
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-gray-600 p-2"
                  aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={isMenuOpen}
                  aria-controls="mobile-menu"
                >
                  {isMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div id="mobile-menu" className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 p-4 flex flex-col gap-4 shadow-xl z-50">
              <a href="#problem" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-gray-800 p-2">Why Wireshops</a>
              <a href="#sellers" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-gray-800 p-2">Sell Your Clothes</a>
              <a href="#buyers" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-gray-800 p-2">Shop Fashion</a>
              <button type="button" onClick={scrollToWaitlist} className={`${brandColors.bg} text-white px-5 py-3 rounded-xl text-center font-bold`}>
                Join Now
              </button>
            </div>
          )}
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="pt-20 pb-12 lg:pt-20 lg:pb-20 overflow-hidden relative">
          <div aria-hidden="true" className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] md:w-[800px] h-[500px] bg-gray-100 rounded-full blur-3xl -z-10 opacity-60"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">

            <h1 className={`text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight ${brandColors.text} mb-6 max-w-5xl leading-tight`}>
              Buy &amp; sell fashion safely. <br className="hidden md:block" />
              <span className="text-slate-500">Without the stress.</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-4 leading-relaxed px-4">
              Chat first. Pay safely. Track your order easily.
            </p>

            <button type="button" onClick={scrollToWaitlist} className={`${brandColors.bg} text-white px-8 py-4 rounded-full text-base font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mb-12`}>
              Join  the waiting list →
            </button>

            {/* Hero Mockups */}
            <div className="relative w-full max-w-5xl mt-2 px-2 md:px-0">
              <div className="relative mx-auto border-[#1f2a37] bg-[#1f2a37] border-[4px] md:border-[8px] rounded-t-2xl md:rounded-t-3xl shadow-2xl max-w-4xl overflow-hidden">
                <div className="bg-white">
                  <img
                    src={desktopImg}
                    alt="Wireshops seller dashboard on desktop"
                    width={DIMS.desktop.width}
                    height={DIMS.desktop.height}
                    fetchPriority="high"
                    decoding="async"
                    className="w-full h-auto block opacity-95"
                  />
                </div>
              </div>

              <div className="absolute -bottom-4 -right-2 sm:-bottom-8 sm:right-0 md:-bottom-12 md:-right-4 w-[100px] sm:w-[140px] md:w-[200px] z-20 hover:-translate-y-2 transition-transform duration-500">
                <div className="relative border-[#1f2a37] bg-[#1f2a37] border-[3px] md:border-[6px] rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden">
                  <div aria-hidden="true" className="absolute top-0 left-1/2 -translate-x-1/2 w-10 md:w-20 h-3 md:h-5 bg-[#1f2a37] z-30 rounded-b-md md:rounded-b-xl"></div>
                  <div className="bg-white rounded-[1.2rem] md:rounded-[2rem] overflow-hidden">
                    <img
                      src={phoneImg}
                      alt="Wireshops mobile app"
                      width={DIMS.phone.width}
                      height={DIMS.phone.height}
                      fetchPriority="high"
                      decoding="async"
                      className="w-full h-auto block"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        {/* scroll-mt: lands the section heading ~24px under the navbar (80px) on every screen size, no extra gap */}
        <section id="problem" className="scroll-mt-10 md:scroll-mt-2 py-16 md:py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className={`text-3xl md:text-4xl font-bold ${brandColors.text} mb-4`}>Buying &amp; selling clothes online is not easy.</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">It shouldn't be this hard.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-16">
              {PROBLEMS.map((item) => (
                <div key={item.label} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.icon className="text-red-400" size={24} aria-hidden="true" />
                  </div>
                  <p className={`font-semibold ${brandColors.text} text-lg`}>{item.label}</p>
                </div>
              ))}
            </div>

            <div className="text-center mb-12">
              <h2 className={`text-3xl md:text-4xl font-bold ${brandColors.text} mb-4`}>We made fashion safe to buy &amp; sell online</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 ${brandColors.bg} rounded-xl flex items-center justify-center mb-6`}>
                  <MessageCircle className="text-white" size={24} aria-hidden="true" />
                </div>
                <h3 className={`text-xl font-bold ${brandColors.text} mb-3`}>Ask before you buy</h3>
                <p className="text-slate-600 leading-relaxed">
                  Chat with sellers about size, condition and delivery before placing your order.
                </p>
              </div>

              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 ${brandColors.bg} rounded-xl flex items-center justify-center mb-6`}>
                  <ShieldCheck className="text-white" size={24} aria-hidden="true" />
                </div>
                <h3 className={`text-xl font-bold ${brandColors.text} mb-3`}>Pay securely</h3>
                <p className="text-slate-600 leading-relaxed">
                  Pay through Wireshops and your funds are held safely. Released only once your order arrives and you're happy.
                </p>
              </div>

              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 ${brandColors.bg} rounded-xl flex items-center justify-center mb-6`}>
                  <Star className="text-white" size={24} aria-hidden="true" />
                </div>
                <h3 className={`text-xl font-bold ${brandColors.text} mb-3`}>Ratings from real buyers</h3>
                <p className="text-slate-600 leading-relaxed">
                  Reviews are connected to completed purchases, helping you buy with more confidence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* For Sellers Section */}
        <section id="sellers" className="scroll-mt-10 md:scroll-mt-2 py-16 md:py-24 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

              {/* Text content uses order-2 on mobile (bottom) and lg:order-1 on desktop (left) */}
              <div className="lg:w-1/2 order-2 lg:order-1">
                <div className="inline-block px-4 py-1.5 bg-gray-100 rounded-full text-xs font-bold uppercase tracking-widest text-slate-600 mb-6">
                  For Sellers
                </div>
                <h2 className={`text-3xl md:text-5xl font-bold ${brandColors.text} mb-6 md:mb-8 tracking-tight`}>
                  Turn your clothes <br /> into cash.
                </h2>
                <ul className="space-y-6">
                  {SELLER_POINTS.map((item) => (
                    <li key={item.title} className="flex gap-4 group">
                      <div className="mt-1 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 group-hover:bg-[#1f2a37] transition-colors">
                        <CheckCircle2 className="text-[#1f2a37] group-hover:text-white transition-colors" size={16} aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className={`font-bold text-lg ${brandColors.text}`}>{item.title}</h3>
                        <p className="text-slate-600 text-sm md:text-base">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="mt-8 text-slate-600 font-medium text-sm">👉 Your old outfit is someone else's next favourite look.</p>
              </div>

              {/* Phone-frame images: hidden on small screens (below md), shown on tablets and larger */}
              <div className="hidden md:block lg:w-1/2 w-full order-1 lg:order-2">
                <div className="relative py-10 md:py-16 flex justify-center">
                  <div aria-hidden="true" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-full md:h-[120%] bg-gradient-to-tr from-slate-100 to-transparent rounded-full -z-10"></div>
                  <div className="flex flex-row justify-center items-center gap-2 sm:gap-3">
                    <div className={`w-32 sm:w-56 lg:w-64 border-[4px] md:border-[6px] ${brandColors.border} bg-[#1f2a37] rounded-2xl md:rounded-[2rem] shadow-xl overflow-hidden transform -rotate-6 hover:rotate-0 transition-all duration-500 z-10`}>
                      <img
                        src={shop}
                        alt="Seller shop page on Wireshops"
                        width={DIMS.shop.width}
                        height={DIMS.shop.height}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-auto opacity-90"
                      />
                    </div>
                    <div className={`w-32 sm:w-56 lg:w-64 border-[4px] md:border-[6px] ${brandColors.border} bg-[#1f2a37] rounded-2xl md:rounded-[2rem] shadow-xl overflow-hidden transform translate-y-8 md:translate-y-16 rotate-6 hover:rotate-0 transition-all duration-500 z-10`}>
                      <img
                        src={profile}
                        alt="Seller profile page on Wireshops"
                        width={DIMS.profile.width}
                        height={DIMS.profile.height}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-auto opacity-90"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why We're Building This */}
        <section className="py-16 md:py-24 bg-[#1f2a37] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center">
              <div className="md:w-1/2">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Built for how people actually shop fashion in Kenya</h2>
                <p className="text-slate-300 text-lg leading-relaxed mb-4">
                  People already discover fashion on Instagram, TikTok and WhatsApp. We didn't try to replace that.
                </p>
                <p className="text-slate-300 text-lg leading-relaxed mb-8">
                  We made it <span className="text-white font-semibold">safer, simpler, and organised.</span>
                </p>

              </div>
              <div className="md:w-1/2 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                {TRUST_POINTS.map((item) => (
                  <div key={item.text} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                    <item.icon className="text-indigo-400" size={24} aria-hidden="true" />
                    <span className="font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* For Buyers Section */}
        <section id="buyers" className="scroll-mt-10 md:scroll-mt-2 py-16 md:py-24 bg-slate-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">

              {/* Text content uses order-2 on mobile (bottom) and lg:order-1 on desktop (placed on right due to flex-row-reverse) */}
              <div className="lg:w-1/2 order-2 lg:order-1">
                <div className="inline-block px-4 py-1.5 bg-indigo-100 rounded-full text-xs font-bold uppercase tracking-widest text-indigo-900 mb-6">
                  For Buyers
                </div>
                <h2 className={`text-3xl md:text-5xl font-bold ${brandColors.text} mb-8 tracking-tight`}>
                  Shop fashion with confidence.
                </h2>
                <ul className="space-y-6">
                  {BUYER_POINTS.map((item) => (
                    <li key={item.title} className="flex gap-4 group">
                      <div className="mt-1 w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 border border-slate-200 group-hover:border-[#1f2a37] transition-colors">
                        <CheckCircle2 className="text-slate-400 group-hover:text-[#1f2a37] transition-colors" size={16} aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className={`font-bold text-lg ${brandColors.text}`}>{item.title}</h3>
                        <p className="text-slate-600">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Phone-frame images: hidden on small screens (below md), shown on tablets and larger */}
              <div className="hidden md:block lg:w-1/2 w-full order-1 lg:order-2">
                <div className="relative py-10 md:py-16 flex justify-center">
                  <div aria-hidden="true" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-full md:h-[120%] bg-gradient-to-tr from-slate-100 to-transparent rounded-full -z-10"></div>

                  <div className="flex flex-row justify-center items-center gap-2 sm:gap-3 relative">
                    <div className={`w-32 sm:w-56 lg:w-64 border-[4px] md:border-[6px] ${brandColors.border} bg-[#1f2a37] rounded-2xl md:rounded-[2rem] shadow-xl overflow-hidden transform -rotate-6 hover:rotate-0 transition-all duration-500 z-10`}>
                      <img
                        src={intro}
                        alt="Buyer feed showing local shops and listings"
                        width={DIMS.intro.width}
                        height={DIMS.intro.height}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-auto opacity-90"
                      />
                    </div>

                    <div className={`w-32 sm:w-56 lg:w-64 border-[4px] md:border-[6px] ${brandColors.border} bg-[#1f2a37] rounded-2xl md:rounded-[2rem] shadow-xl overflow-hidden transform translate-y-8 md:translate-y-16 rotate-6 hover:rotate-0 transition-all duration-500 z-10`}>
                      <img
                        src={checkout}
                        alt="Buyer checkout with protected payment"
                        width={DIMS.checkout.width}
                        height={DIMS.checkout.height}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-auto opacity-90"
                      />
                    </div>

                    {/* Floating Review Box */}
                    <div className="absolute -bottom-10 sm:-bottom-6 -right-2 sm:-right-4 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 hidden sm:block z-20 max-w-[200px]">
                      <div className="flex gap-1 text-yellow-400 mb-2" role="img" aria-label="5 out of 5 stars">
                        {[0, 1, 2, 3, 4].map((i) => (
                          <Star key={i} fill="currentColor" size={16} aria-hidden="true" />
                        ))}
                      </div>
                      <p className="text-xs text-slate-600">"Finally, a place where I feel safe paying online."</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className={`text-3xl md:text-4xl font-bold ${brandColors.text} mb-4`}>How it works</h2>
              <p className="text-lg text-slate-600 max-w-xl mx-auto">Three simple steps. That's it.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
              {STEPS.map((item) => (
                <div key={item.step} className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow text-center">
                  <div aria-hidden="true" data-step={item.step} className="h-12 mb-4 text-5xl font-extrabold leading-none text-slate-100 before:content-[attr(data-step)]"></div>
                  <div className={`w-12 h-12 ${brandColors.bg} rounded-xl flex items-center justify-center mb-4 mx-auto`}>
                    <item.icon className="text-white" size={22} aria-hidden="true" />
                  </div>
                  <h3 className={`text-lg font-bold ${brandColors.text} mb-2`}>{item.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Waitlist */}
        <section id="waitlist" className="scroll-mt-10 md:scroll-mt-2 py-16 md:py-24 bg-white relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

            <div className={`${brandColors.bg} rounded-3xl p-8 md:p-16 shadow-2xl overflow-hidden relative`}>
              {/* Decor */}
              <div aria-hidden="true" className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
              <div aria-hidden="true" className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-indigo-500 opacity-20 rounded-full blur-2xl"></div>

              {submitted ? (
                /* ── Success State: short and simple ── */
                <div className="relative z-10 flex flex-col items-center" role="status" aria-live="polite">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center mb-5 mx-auto">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center shadow-lg">
                      <CheckCircle2 className="text-[#1f2a37]" size={24} aria-hidden="true" />
                    </div>
                  </div>

                  <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 tracking-tight">
                    You're on the list! 🎉
                  </h2>
                  <p className="text-base md:text-lg text-slate-300 max-w-md mx-auto leading-relaxed">
                    Thanks for joining Wireshops early access. We'll be in touch as soon as we launch.
                  </p>
                </div>
              ) : (
                /* ── Default Form State ── */
                <>
                  <h2 className="text-2xl md:text-5xl font-bold text-white mb-4 tracking-tight relative z-10">Get early access</h2>
                  <p className="text-base md:text-lg text-slate-300 mb-2 max-w-xl mx-auto relative z-10">
                    We’re inviting a limited number of clothing sellers and buyers across Kenya to join Wireshops before we launch.
                  </p>
                  <p className="text-sm text-slate-300 mb-10 relative z-10">As an early user, you'll enjoy exclusive launch benefits, extra promotion, and 3 months with zero commission.</p>

                  <form
                    onSubmit={handleJoin}
                    onFocus={() => getSupabase().catch(() => {})}
                    className="flex flex-col sm:flex-row gap-3 justify-center w-full max-w-lg mx-auto relative z-10"
                  >
                    <label htmlFor="waitlist-name" className="sr-only">Full name</label>
                    <input
                      id="waitlist-name"
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      autoComplete="name"
                      className="w-full sm:flex-1 px-5 py-4 rounded-xl border-0 bg-white/10 text-white placeholder-slate-300 focus:ring-2 focus:ring-white focus:outline-none backdrop-blur-sm"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                    <label htmlFor="waitlist-contact" className="sr-only">Email or phone number</label>
                    <input
                      id="waitlist-contact"
                      type="text"
                      name="contact"
                      placeholder="Email or Phone No."
                      autoComplete="email"
                      className="w-full sm:flex-1 px-5 py-4 rounded-xl border-0 bg-white/10 text-white placeholder-slate-300 focus:ring-2 focus:ring-white focus:outline-none backdrop-blur-sm"
                      value={formData.contact}
                      onChange={handleInputChange}
                      required
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full sm:w-auto bg-white text-[#1f2a37] px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Joining...' : 'Join Now'}
                    </button>
                  </form>

                  {error && (
                    <p role="alert" className="mt-4 text-red-400 text-sm font-medium relative z-10">{error}</p>
                  )}
                </>
              )}

              <footer className="mt-8 text-xs text-slate-300 uppercase tracking-widest relative z-10">
                <p>© 2026 Wireshops — Buy it. Sell it. Trust it. 🇰🇪</p>
              </footer>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;