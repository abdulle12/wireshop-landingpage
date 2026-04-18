import React, { useState } from 'react';
import { 
  MessageCircle, 
  ShieldCheck, 
  Star, 
  CheckCircle2, 
  Menu, 
  X, 
  Lock, 
  Smile, 
  AlertCircle,
  ArrowRight,
  MapPin,
  Users
} from 'lucide-react';
import phoneImg from './assets/phone.png';
import desktopImg from './assets/desktop.png';
import Logo from './assets/ds.png';
import shop from './assets/new.png';
import profile from './assets/profile.png';
import intro from './assets/intro.png';
import checkout from './assets/checkout.png';``


const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [submitted, setSubmitted] = useState(false);

  // Brand Palette
  const brandColors = {
    bg: 'bg-[#1f2a37]',
    text: 'text-[#1f2a37]',
    border: 'border-[#1f2a37]',
    lightBg: 'bg-slate-50',
    accent: 'text-indigo-600'
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (formData.email && formData.name) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '' });
      }, 3000);
    }
  };

  const scrollToWaitlist = () => {
    document.getElementById('waitlist').scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-600 selection:bg-[#1f2a37] selection:text-white overflow-x-hidden">
      
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
              <div className={`w-12 h-12 ${brandColors.bg} rounded-xl flex items-center justify-center shadow-lg shadow-gray-200 overflow-hidden`}>
                <img src={Logo} alt="Wireshops Logo" className="w-full h-full object-cover" />
              </div>
              <span className={`font-bold text-2xl ${brandColors.text} tracking-tight`}>Wireshops</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#problem" className="text-slate-600 hover:text-[#1f2a37] font-medium text-sm transition-colors">Why Wireshops</a>
              <a href="#sellers" className="text-slate-600 hover:text-[#1f2a37] font-medium text-sm transition-colors">Sellers</a>
              <a href="#buyers" className="text-slate-600 hover:text-[#1f2a37] font-medium text-sm transition-colors">Buyers</a>
              <button onClick={scrollToWaitlist} className={`${brandColors.bg} text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-all shadow-md hover:shadow-xl transform hover:-translate-y-0.5`}>
                Join Waitlist
              </button>
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 p-2">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 p-4 flex flex-col gap-4 shadow-xl z-50">
            <a href="#problem" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-gray-800 p-2">Why Wireshops</a>
            <a href="#sellers" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-gray-800 p-2">For Sellers</a>
            <a href="#buyers" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-gray-800 p-2">For Buyers</a>
            <button onClick={scrollToWaitlist} className={`${brandColors.bg} text-white px-5 py-3 rounded-xl text-center font-bold`}>
              Join Waitlist
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-12 lg:pt-20 lg:pb-20 overflow-hidden relative">
        {/* Background Gradient Blob */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] md:w-[800px] h-[500px] bg-gray-100 rounded-full blur-3xl -z-10 opacity-60"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          
          <h1 className={`text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight ${brandColors.text} mb-6 max-w-5xl leading-tight`}>
            Buy & sell locally. <br className="hidden md:block" />
            <span className="text-slate-400">Without the stress.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mb-4 leading-relaxed px-4">
            Connect with nearby shops, chat in real time, and pay safely — all in one simple platform.
          </p>
          <p className="text-sm md:text-base text-slate-400 mb-10 font-medium">
            No websites. No endless DMs. No trust issues.
          </p>

          <button onClick={scrollToWaitlist} className={`${brandColors.bg} text-white px-8 py-4 rounded-full text-base font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mb-12`}>
            Join the Waitlist →
          </button>

          {/* Hero Mockups */}
          <div className="relative w-full max-w-5xl mt-2 px-2 md:px-0">
            {/* Desktop Frame */}
            <div className={`relative mx-auto border-[#1f2a37] bg-[#1f2a37] border-[4px] md:border-[8px] rounded-t-2xl md:rounded-t-3xl shadow-2xl max-w-4xl overflow-hidden`}>
              <div className="bg-white">
                <img src={desktopImg} alt="Desktop Dashboard" className="w-full h-auto block opacity-95" />
              </div>
            </div>

            {/* Floating Phone */}
            <div className="absolute -bottom-4 -right-2 sm:-bottom-8 sm:right-0 md:-bottom-12 md:-right-4 w-[100px] sm:w-[140px] md:w-[200px] z-20 hover:-translate-y-2 transition-transform duration-500">
              <div className={`relative border-[#1f2a37] bg-[#1f2a37] border-[3px] md:border-[6px] rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden`}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 md:w-20 h-3 md:h-5 bg-[#1f2a37] z-30 rounded-b-md md:rounded-b-xl"></div>
                <div className="bg-white rounded-[1.2rem] md:rounded-[2rem] overflow-hidden">
                  <img src={phoneImg} alt="Mobile App" className="w-full h-auto block" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold ${brandColors.text} mb-4`}>Online shopping is broken.</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10">It shouldn't be this hard.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-16">
            {[
              { icon: AlertCircle, label: "Buyers fear getting scammed" },
              { icon: Smile, label: "Sellers deal with fake orders" },
              { icon: MessageCircle, label: "Everything happens in messy DMs" }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex items-center gap-4">
                <div className={`w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <item.icon className="text-red-400" size={24} />
                </div>
                <p className={`font-semibold ${brandColors.text} text-lg`}>{item.label}</p>
              </div>
            ))}
          </div>

          {/* Solution */}
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold ${brandColors.text} mb-4`}>We fixed the way people buy & sell online</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {/* Step 1 */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 ${brandColors.bg} rounded-xl flex items-center justify-center mb-6`}>
                <MessageCircle className="text-white" size={24} />
              </div>
              <h3 className={`text-xl font-bold ${brandColors.text} mb-3`}>Chat before you buy</h3>
              <p className="text-slate-500 leading-relaxed">
                Talk directly with shops — ask questions, confirm details, and negotiate in real time.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 ${brandColors.bg} rounded-xl flex items-center justify-center mb-6`}>
                <ShieldCheck className="text-white" size={24} />
              </div>
              <h3 className={`text-xl font-bold ${brandColors.text} mb-3`}>Pay with protection</h3>
              <p className="text-slate-500 leading-relaxed">
                Your money is held safely and only released after you receive your order. No more scam worries.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 ${brandColors.bg} rounded-xl flex items-center justify-center mb-6`}>
                <Star className="text-white" size={24} />
              </div>
              <h3 className={`text-xl font-bold ${brandColors.text} mb-3`}>Built on real trust</h3>
              <p className="text-slate-500 leading-relaxed">
                Verified reviews from real transactions — no fake ratings, no guesswork.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Sellers Section */}
      <section id="sellers" className="py-16 md:py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            
            <div className="lg:w-1/2 order-2 lg:order-1">
              <div className={`inline-block px-4 py-1.5 bg-gray-100 rounded-full text-xs font-bold uppercase tracking-widest text-slate-600 mb-6`}>
                For Sellers
              </div>
              <h2 className={`text-3xl md:text-5xl font-bold ${brandColors.text} mb-6 md:mb-8 tracking-tight`}>
                Run your shop. <br/> Simply.
              </h2>
              <ul className="space-y-6">
                {[
                  { title: "Create your shop in minutes", desc: "Set up your brand profile, add products, and start selling — zero coding required." },
                  { title: "List products for free", desc: "No upfront costs. Upload your inventory and start showcasing your products instantly." },
                  { title: "Manage orders, chats & payments in one place", desc: "Everything you need to run your business — from one simple, powerful dashboard." },
                  { title: "Build a loyal customer base", desc: "Shoppers can follow your store and get updates whenever you drop new products." }
                ].map((item, index) => (
                  <li key={index} className="flex gap-4 group">
                    <div className={`mt-1 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 group-hover:bg-[#1f2a37] transition-colors`}>
                      <CheckCircle2 className={`text-[#1f2a37] group-hover:text-white transition-colors`} size={16} />
                    </div>
                    <div>
                      <h4 className={`font-bold text-lg ${brandColors.text}`}>{item.title}</h4>
                      <p className="text-slate-500 text-sm md:text-base">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-slate-400 font-medium text-sm">👉 No tech skills needed.</p>
            </div>

            {/* Seller Visuals */}
            <div className="lg:w-1/2 order-1 lg:order-2 w-full">
              <div className="relative py-10 md:py-16 flex justify-center"> 
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-full md:h-[120%] bg-gradient-to-tr from-slate-100 to-transparent rounded-full -z-10"></div>
                <div className="flex flex-row justify-center items-center gap-4 sm:gap-6">
                  <div className={`w-32 sm:w-48 border-4 ${brandColors.border} bg-[#1f2a37] rounded-2xl md:rounded-3xl shadow-xl overflow-hidden transform -rotate-6 hover:rotate-0 transition-all duration-500 z-10`}>
                    <img src={shop} alt="Seller Dashboard" className="w-full h-auto opacity-90" />
                  </div>
                  <div className={`w-32 sm:w-48 border-4 ${brandColors.border} bg-[#1f2a37] rounded-2xl md:rounded-3xl shadow-xl overflow-hidden transform translate-y-8 md:translate-y-12 rotate-6 hover:rotate-0 transition-all duration-500 z-10`}>
                    <img src={profile} alt="Seller Analytics" className="w-full h-auto opacity-90" />
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Built for how people actually buy in Kenya</h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-4">
                Most commerce already happens on WhatsApp. We didn't change that.
              </p>
              <p className="text-slate-300 text-lg leading-relaxed mb-8">
                We made it <span className="text-white font-semibold">safer, simpler, and organized.</span>
              </p>
              <div className="p-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10 mb-4">
                <p className="text-white italic">"I just want to buy something without wondering if it's a scam."</p>
              </div>
              <div className="p-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
                <p className="text-white italic">"Finally, a place where I feel safe paying online."</p>
              </div>
            </div>
            <div className="md:w-1/2 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Lock, text: "Trust around payments" },
                { icon: Smile, text: "No unserious buyers" },
                { icon: AlertCircle, text: "Stop fear of scams" },
                { icon: ArrowRight, text: "Clear delivery terms" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                  <item.icon className="text-indigo-400" size={24} />
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* For Buyers Section */}
      <section id="buyers" className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">
            <div className="lg:w-1/2">
              <div className={`inline-block px-4 py-1.5 bg-indigo-100 rounded-full text-xs font-bold uppercase tracking-widest text-indigo-900 mb-6`}>
                For Buyers
              </div>
              <h2 className={`text-3xl md:text-5xl font-bold ${brandColors.text} mb-8 tracking-tight`}>
                Shop with confidence.
              </h2>
              <ul className="space-y-6">
                {[
                  { title: "Discover real local shops near you", desc: "Find verified sellers in one place instead of scrolling through random social media posts." },
                  { title: "Follow shops and get updates", desc: "Stay in the loop whenever your favourite sellers drop new products or deals." },
                  { title: "See clear pricing and reviews", desc: "No more guessing — honest prices and real buyer reviews, upfront." },
                  { title: "Pay safely — no more worrying", desc: "Your money is held securely and only released once you confirm your order arrived." }
                ].map((item, index) => (
                  <li key={index} className="flex gap-4 group">
                    <div className={`mt-1 w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 border border-slate-200 group-hover:border-[#1f2a37] transition-colors`}>
                      <CheckCircle2 className={`text-slate-400 group-hover:text-[#1f2a37] transition-colors`} size={16} />
                    </div>
                    <div>
                      <h4 className={`font-bold text-lg ${brandColors.text}`}>{item.title}</h4>
                      <p className="text-slate-500">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Buyer Visuals */}
            <div className="lg:w-1/2 w-full">
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="space-y-4 pt-8 md:pt-12">
                  <div className={`border-2 ${brandColors.border} rounded-2xl shadow-lg overflow-hidden`}>
                    <img src={intro} alt="Buyer Feed" className="w-full h-auto" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className={`border-2 ${brandColors.border} rounded-2xl shadow-lg overflow-hidden`}>
                    <img src={checkout} alt="Buyer Chat" className="w-full h-auto" />
                  </div>
                  <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-100 hidden sm:block">
                    <div className="flex gap-1 text-yellow-400 mb-2"><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/></div>
                    <p className="text-xs text-slate-500">"Finally, a place where I feel safe paying online."</p>
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
            <p className="text-lg text-slate-500 max-w-xl mx-auto">Three simple steps. That's it.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
            {[
              { step: "01", icon: MapPin, title: "Find a shop", desc: "Browse local sellers and discover products near you." },
              { step: "02", icon: MessageCircle, title: "Chat & place order", desc: "Ask questions, negotiate, and confirm your order in real time." },
              { step: "03", icon: ShieldCheck, title: "Pay safely → confirm → done", desc: "Pay with escrow protection. Release funds only when you're happy." }
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow text-center">
                <div className="text-5xl font-extrabold text-slate-100 mb-4">{item.step}</div>
                <div className={`w-12 h-12 ${brandColors.bg} rounded-xl flex items-center justify-center mb-4 mx-auto`}>
                  <item.icon className="text-white" size={22} />
                </div>
                <h3 className={`text-lg font-bold ${brandColors.text} mb-2`}>{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / CTA Waitlist */}
      <section id="waitlist" className="py-16 md:py-24 bg-white relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            
          <div className={`${brandColors.bg} rounded-3xl p-8 md:p-16 shadow-2xl overflow-hidden relative`}>
            {/* Decor */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-indigo-500 opacity-20 rounded-full blur-2xl"></div>

            <h2 className="text-2xl md:text-5xl font-bold text-white mb-4 tracking-tight relative z-10">Be among the first to try Wireshops</h2>
            <p className="text-base md:text-lg text-slate-300 mb-2 max-w-xl mx-auto relative z-10">
              We're launching soon in Kenya 🇰🇪
            </p>
            <p className="text-sm text-slate-400 mb-10 relative z-10">Join early users and get access first.</p>
            
            <form onSubmit={handleJoin} className="flex flex-col sm:flex-row gap-3 justify-center w-full max-w-lg mx-auto relative z-10">
              <input 
                type="text" 
                name="name"
                placeholder="Full Name" 
                className="w-full sm:flex-1 px-5 py-4 rounded-xl border-0 bg-white/10 text-white placeholder-slate-400 focus:ring-2 focus:ring-white focus:outline-none backdrop-blur-sm"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <input 
                type="email" 
                name="email"
                placeholder="Email Address" 
                className="w-full sm:flex-1 px-5 py-4 rounded-xl border-0 bg-white/10 text-white placeholder-slate-400 focus:ring-2 focus:ring-white focus:outline-none backdrop-blur-sm"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <button type="submit" className="w-full sm:w-auto bg-white text-[#1f2a37] px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg whitespace-nowrap">
                {submitted ? 'You are in! 🎉' : 'Join Waitlist'}
              </button>
            </form>
            <p className="mt-8 text-xs text-slate-400 uppercase tracking-widest relative z-10">© 2026 Wireshops — Simple. Local. Trusted. 🇰🇪</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;