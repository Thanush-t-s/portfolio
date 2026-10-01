import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import {
  Server, User, ExternalLink, Code,
  Shield, Cloud, GitBranch, Terminal, ChevronRight,
  MapPin, ArrowUpRight
} from 'lucide-react';

// ── Typewriter ───────────────────────────────────────────────────────────────

function Typewriter({ texts = ['Developer Portfolio', 'Backend Architect', 'System Designer'], speed = 90, deleteSpeed = 45, pauseTime = 2000 }) {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIndex % texts.length];
    let timer;
    if (!isDeleting) {
      if (displayText.length < current.length) {
        timer = setTimeout(() => setDisplayText(current.slice(0, displayText.length + 1)), speed);
      } else {
        timer = setTimeout(() => setIsDeleting(true), pauseTime);
      }
    } else {
      if (displayText.length > 0) {
        timer = setTimeout(() => setDisplayText(current.slice(0, displayText.length - 1)), deleteSpeed);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(false);
          setTextIndex(i => i + 1);
        }, 150); // slight pause before typing next word
      }
    }
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, textIndex, texts, speed, deleteSpeed, pauseTime]);

  return (
    <span className="inline-flex items-center">
      <span>{displayText}</span>
      <span className="animate-blink text-cyan-400 font-bold ml-0.5">|</span>
    </span>
  );
}

// ── Page Wrapper (handles route transition) ──────────────────────────────────

function PageWrapper({ children }) {
  const location = useLocation();
  return (
    <div key={location.pathname} className="animate-page w-full flex justify-center px-8">
      {children}
    </div>
  );
}

// ── Dynamic Background ───────────────────────────────────────────────────────

function DynamicBackground() {
  const location = useLocation();
  const path = location.pathname;
  
  let bgImg = '/minecraft-bg.jpg';
  if (path === '/about') bgImg = '/bg-about.jpg';
  else if (path === '/skills') bgImg = '/bg-skills.jpg';
  else if (path === '/projects') bgImg = '/bg-projects.jpg';

  return (
    <img
      key={bgImg}
      src={bgImg}
      className="absolute inset-0 w-full h-full object-cover object-center z-0 pointer-events-none brightness-105 contrast-105 saturate-110 animate-bg-fade"
      alt=""
    />
  );
}

// ── Ambient Particles ────────────────────────────────────────────────────────

function AmbientParticles() {
  // Memoize random calculations to guarantee functional purity during React renders
  const particles = useMemo(() => Array.from({ length: 30 }).map(() => ({
    size: Math.random() * 4 + 1,
    left: Math.random() * 100,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 10
  })), []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden mix-blend-screen opacity-70">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-cyan-400/50 animate-particle-drift shadow-[0_0_8px_rgba(251,191,36,0.6)]"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.left}%`,
            bottom: `-20px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `-${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

// ── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [data, setData] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(`/data/portfolio.json?t=${Date.now()}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoaded(true); });
  }, []);

  if (!loaded) {
    return (
      <div className="h-screen w-screen bg-[#0a0f1a] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
        <p className="text-cyan-400/80 text-xs tracking-[0.3em] uppercase font-semibold">
          Initializing Architecture
        </p>
      </div>
    );
  }

  return (
    <Router>
      <div className="h-screen w-screen overflow-hidden relative flex flex-col font-sans">

        {/* ── Background ── */}
        <DynamicBackground />
        <AmbientParticles />
        {/* gradient: dark on right for card contrast, lighter on left for Steve */}
        <div className="absolute inset-0 bg-gradient-to-l from-black/90 via-black/45 to-black/10 z-0 pointer-events-none" />
        {/* very subtle vignette bottom */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent z-0 pointer-events-none" />

        {/* ── Header / Nav ── */}
        <header className="relative z-20 w-full px-8 py-5 flex items-center justify-between">
          {/* Logo / wordmark */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-cyan-500 flex items-center justify-center shadow-[0_0_14px_rgba(245,158,11,0.6)]">
              <Terminal className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
            </div>
            <span className="text-white font-bold text-sm tracking-wider hidden sm:block">
              {data.home?.name?.split(' ')[0] ?? 'Portfolio'}
            </span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-1">
            {[
              { to: '/',         label: 'Home'     },
              { to: '/about',    label: 'About'    },
              { to: '/skills',   label: 'Skills'   },
              { to: '/projects', label: 'Projects' },
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `relative px-3.5 py-1.5 text-xs font-semibold tracking-[0.12em] uppercase transition-all duration-200 rounded-lg
                   ${isActive
                     ? 'text-white bg-white/10 shadow-inner'
                     : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                   }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* CTA chip */}
          <a
            href="#/about"
            className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold rounded-lg transition shadow-[0_0_16px_rgba(245,158,11,0.35)] hover:shadow-[0_0_24px_rgba(245,158,11,0.5)] tracking-wide"
          >
            Hire Me <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </header>

        {/* ── Main ── */}
        <main className="relative z-10 flex-1 w-full flex items-center overflow-hidden">
          {/* scroll container — HomePage floats right, others center */}
          <div className="w-full h-full max-h-[88vh] overflow-y-auto flex items-start pt-2 pb-10">
            <Routes>
              <Route path="/"         element={<HomeRoute data={data.home} />} />
              <Route path="/about"    element={<AboutRoute data={data.about} name={data.home?.name} contact={data.contact} />} />
              <Route path="/skills"   element={<SkillsRoute skills={data.skills} />} />
              <Route path="/projects" element={<ProjectsRoute projects={data.projects} />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  HOME
// ═══════════════════════════════════════════════════════════════════

const getSocialIconUrl = (platform) => {
  if (platform === 'LinkedIn') {
    return 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linkedin/linkedin-original.svg';
  }
  const map = {
    'GitHub': 'github',
    'LeetCode': 'leetcode'
  };
  return `https://cdn.simpleicons.org/${map[platform] || 'web'}/ffffff`;
};

function HomeRoute({ data }) {
  return (
    <div className="w-full flex justify-end items-center min-h-full px-8 relative">
      
      {/* ── Floating Social Icons ── */}
      <div className="absolute left-6 bottom-10 md:left-14 md:bottom-14 flex flex-col md:flex-row gap-4 z-20 animate-fade-in" style={{ animationDelay: '500ms', animationFillMode: 'both' }}>
        {data?.socials?.map((s, i) => (
          <a 
            key={i} 
            href={s.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 md:w-12 md:h-12 bg-black/20 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-slate-400 hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-500 ease-out hover:scale-110 hover:-translate-y-1 shadow-lg group"
            title={s.platform}
          >
            <img 
              src={getSocialIconUrl(s.platform)} 
              alt={s.platform} 
              className={`w-4 h-4 md:w-5 md:h-5 object-contain transition-all duration-500 ease-out group-hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] ${
                s.platform === 'LinkedIn' 
                  ? 'opacity-70 grayscale brightness-200 group-hover:grayscale-0 group-hover:brightness-100 group-hover:opacity-100' 
                  : 'opacity-60 group-hover:opacity-100'
              }`} 
            />
          </a>
        ))}
      </div>

      <div className="animate-float ml-auto mr-4 md:mr-14 max-w-[24rem] w-full">
        <div className="animate-fade-in w-full bg-black/20 backdrop-blur-2xl border border-cyan-500/25 rounded-2xl p-8 md:p-10 text-white shadow-[0_30px_60px_rgba(0,0,0,0.4)] relative overflow-hidden group hover:border-cyan-500/45 transition-all duration-700 ease-out">

        {/* ambient orb */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-cyan-500/10 blur-[180px] rounded-full pointer-events-none group-hover:bg-cyan-500/18 transition-all duration-700" />
        <div className="absolute -bottom-20 -left-10 w-40 h-40 bg-blue-500/5 blur-[160px] rounded-full pointer-events-none" />

        {/* badge typewriter */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/12 text-cyan-400 text-[10px] font-bold tracking-[0.25em] uppercase mb-6 border border-cyan-500/25 relative z-10 shadow-inner">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-glow-pulse inline-block" />
          <Typewriter texts={data?.roles || ['Computer Science Student', 'Software Developer', 'Tech Enthusiast']} />
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-white leading-tight relative z-10 drop-shadow-sm">
          {data?.headline?.replace('\n', ' ') || 'Computer Science Student'}
        </h1>

        <p className="text-slate-400 text-sm md:text-base mb-6 leading-relaxed font-light relative z-10">
          {data?.tagline}
        </p>

        {/* Focus Tags to replace stats */}
        <div className="flex flex-wrap gap-2 mb-8 relative z-10">
          {['Software Engineering', 'Full-Stack', 'Algorithms'].map((lbl) => (
             <span key={lbl} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[9px] font-semibold text-slate-300 uppercase tracking-widest hover:border-cyan-500/30 transition-colors cursor-default">
               {lbl}
             </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 relative z-10">
          <a
            href="#/projects"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-bold rounded-xl transition-all duration-500 ease-out shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:shadow-[0_0_35px_rgba(245,158,11,0.45)] text-xs tracking-wide hover:-translate-y-1 group/btn"
          >
            {data?.ctaButtons?.[0]?.label || 'Explore Projects'} <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </a>
          <a
            href="#/about"
            className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-medium rounded-xl border border-white/10 hover:border-white/20 transition-all duration-500 ease-out text-xs tracking-wide hover:-translate-y-1"
          >
            {data?.ctaButtons?.[1]?.label || 'Contact Me'}
          </a>
        </div>
      </div>
    </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  ABOUT
// ═══════════════════════════════════════════════════════════════════
function AboutRoute({ data, name, contact }) {
  const [formStatus, setFormStatus] = useState('idle');

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    
    const toEmail = contact?.email || 'ts.thanush@gmail.com';
    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body = encodeURIComponent(`Visitor Name: ${name}\nVisitor Email: ${email}\nContact Number: ${phone}\n\nMessage:\n`);
    
    // Direct Gmail Compose (Bypasses OS mail client issues entirely)
    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${toEmail}&su=${subject}&body=${body}`;
    window.open(gmailLink, '_blank');

    setFormStatus('success');
    setTimeout(() => {
      setFormStatus('idle');
      e.target.reset();
    }, 3000);
  };

  return (
    <PageWrapper>
      <div className="animate-float w-full max-w-6xl my-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 md:gap-6 relative z-10">
          
          {/* Abstract glows behind the grid */}
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-emerald-500/10 blur-[180px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-teal-500/10 blur-[180px] rounded-full pointer-events-none" />

          {/* BOX 1: BIO (Spans 2 cols, 1 row) */}
          <div className="md:col-span-2 md:row-span-1 bg-black/30 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden group hover:border-emerald-500/30 transition-colors duration-700 ease-out">
            {/* Tech grid background */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50 pointer-events-none" />
            
            <div className="relative z-10 h-full flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-bold tracking-[0.2em] uppercase mb-4 border border-emerald-500/20 w-max shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                <User className="w-3 h-3" /> Developer Profile
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold mb-1 tracking-tight text-white leading-tight">
                Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-emerald-500">{name ?? 'Thanush T S'}</span>
              </h2>
              <h3 className="text-lg text-emerald-500/80 font-mono tracking-tight mb-4">Student at BMS Institute of Technology and Management</h3>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed font-light max-w-2xl">
                {data?.summary}
              </p>
            </div>
          </div>

          {/* BOX 2: CONTACT (Spans 1 col, 2 rows) */}
          <div className="md:col-span-1 md:row-span-2 bg-black/30 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-700 flex flex-col justify-between">
            {/* Elegant ambient glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[160px] pointer-events-none rounded-bl-full" />
            
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-[9px] font-bold tracking-widest uppercase mb-6 shadow-inner">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.8)]" /> Live Channel
              </div>
              <h3 className="text-3xl font-light text-white mb-3">Let's <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-emerald-500">Connect</span></h3>
              <p className="text-xs text-slate-400 font-light leading-relaxed max-w-[200px]">Open a secure channel directly to my personal inbox.</p>
            </div>
            
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-5 relative z-10 w-full mt-6">
              
              <div className="space-y-4">
                {/* NAME INPUT */}
                <div className="group/input relative">
                  <div className="absolute inset-0 bg-emerald-500/20 blur-xl opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  <input 
                    type="text" 
                    name="name"
                    placeholder="Your Name" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:bg-white/10 focus:border-emerald-500/50 focus:outline-none transition-all duration-500 relative z-10 shadow-inner"
                    required
                    disabled={formStatus !== 'idle'}
                  />
                </div>

                {/* EMAIL INPUT */}
                <div className="group/input relative">
                  <div className="absolute inset-0 bg-emerald-500/20 blur-xl opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  <input 
                    type="email" 
                    name="email"
                    placeholder="Gmail Address" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:bg-white/10 focus:border-emerald-500/50 focus:outline-none transition-all duration-500 relative z-10 shadow-inner"
                    required
                    disabled={formStatus !== 'idle'}
                  />
                </div>

                {/* PHONE INPUT */}
                <div className="group/input relative">
                  <div className="absolute inset-0 bg-emerald-500/20 blur-xl opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  <input 
                    type="tel" 
                    name="phone"
                    placeholder="Contact Number" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:bg-white/10 focus:border-emerald-500/50 focus:outline-none transition-all duration-500 relative z-10 shadow-inner"
                    required
                    disabled={formStatus !== 'idle'}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={formStatus !== 'idle'}
                className={`mt-4 flex items-center justify-center gap-2 w-full py-3.5 rounded-xl transition-all duration-700 ease-out group/btn cursor-pointer font-bold tracking-wide text-xs uppercase ${
                  formStatus === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' :
                  formStatus === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/50' :
                  'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_35px_rgba(16,185,129,0.5)] disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1'
                }`}
              >
                {formStatus === 'idle' && (
                  <>
                    Open in Gmail
                    <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </>
                )}
                {formStatus === 'submitting' && (
                  <>
                    Connecting...
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  </>
                )}
                {formStatus === 'success' && (
                  "Ready to Send!"
                )}
              </button>
            </form>
          </div>

          {/* BOX 3: QUICK FACTS (Spans 1 col, 1 row) */}
          <div className="md:col-span-1 md:row-span-1 bg-black/30 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col justify-center group hover:border-emerald-500/30 transition-colors duration-700 ease-out">
            <h3 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" /> Telemetry Data
            </h3>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Location', value: contact?.location || 'India', icon: MapPin },
                { label: 'Stack', value: 'Java 21 · Spring Boot', icon: Terminal },
                { label: 'Availability', value: 'Remote / Hybrid', icon: GitBranch },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors">
                  <item.icon className="w-4 h-4 text-emerald-500" />
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider">{item.label}</span>
                    <span className="text-xs text-slate-200 font-medium">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BOX 4: CORE EXPERTISE (Spans 1 col, 1 row) */}
          <div className="md:col-span-1 md:row-span-1 bg-black/30 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col justify-center group hover:border-emerald-500/30 transition-colors duration-700 ease-out">
            <h3 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5" /> Core Competencies
            </h3>
            <div className="flex flex-col gap-2.5">
              {data?.highlights?.map((h, i) => (
                <div key={i} className="flex items-center gap-3 group/item">
                  <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover/item:bg-emerald-500/20 group-hover/item:border-emerald-500/40 transition-all shadow-inner">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                  </div>
                  <span className="text-[11px] md:text-xs text-slate-300 font-medium leading-snug">{h}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  SKILLS
// ═══════════════════════════════════════════════════════════════════

const getIconUrl = (name) => {
  const map = {
    'Python': 'python/python-original.svg',
    'JavaScript': 'javascript/javascript-original.svg',
    'TypeScript': 'typescript/typescript-original.svg',
    'Java': 'java/java-original.svg',
    'C++': 'cplusplus/cplusplus-original.svg',
    'C': 'c/c-original.svg',
    'Go': 'go/go-original.svg',
    'Rust': 'rust/rust-original.svg',
    'Django': 'django/django-plain.svg',
    'Flask': 'flask/flask-original.svg',
    'FastAPI': 'fastapi/fastapi-original.svg',
    'Spring Boot': 'spring/spring-original.svg',
    'React': 'react/react-original.svg',
    'Node.js': 'nodejs/nodejs-original.svg',
    'Tailwind': 'tailwindcss/tailwindcss-original.svg',
    'PostgreSQL': 'postgresql/postgresql-original.svg',
    'MySQL': 'mysql/mysql-original.svg',
    'MongoDB': 'mongodb/mongodb-original.svg',
    'Redis': 'redis/redis-original.svg',
    'Docker': 'docker/docker-original.svg',
    'AWS': 'amazonwebservices/amazonwebservices-original-wordmark.svg',
    'Linux': 'linux/linux-original.svg',
    'Git': 'git/git-original.svg',
    'GitHub': 'github/github-original.svg',
    'VS Code': 'vscode/vscode-original.svg',
    'Postman': 'postman/postman-original.svg',
    'Pandas': 'pandas/pandas-original.svg',
    'NumPy': 'numpy/numpy-original.svg',
    'TensorFlow': 'tensorflow/tensorflow-original.svg',
    'PyTorch': 'pytorch/pytorch-original.svg',
  };
  const path = map[name] || 'html5/html5-original.svg';
  return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${path}`;
};

function SkillsRoute({ skills }) {
  const flatSkills = Array.isArray(skills) && typeof skills[0] === 'string' ? skills : [];

  // Group into an inverted pyramid: 8, 7, 6, 5, 4
  const rowCounts = [8, 7, 6, 5, 4];
  const rows = [];
  let startIndex = 0;
  
  for (let count of rowCounts) {
    if (startIndex < flatSkills.length) {
      rows.push(flatSkills.slice(startIndex, startIndex + count));
      startIndex += count;
    }
  }

  return (
    <PageWrapper>
      <div className="w-full flex flex-col items-center justify-center min-h-[80vh] py-4">
        <div className="flex flex-col items-center justify-center gap-3 md:gap-4 relative z-10">
          {rows.map((row, ri) => (
            <div key={ri} className="flex justify-center gap-3 md:gap-4">
              {row.map((skill, si) => (
                <div 
                  key={si}
                  className="w-[72px] h-[80px] md:w-[96px] md:h-[104px] bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-violet-500/50 hover:bg-white/10 transition-all duration-500 ease-out hover:-translate-y-1 hover:scale-110 group cursor-default shadow-[0_4px_20px_rgba(0,0,0,0.5)] animate-fade-in"
                  style={{ animationFillMode: 'both', animationDelay: `${(ri * 8 + si) * 40}ms` }}
                >
                  <img 
                    src={getIconUrl(skill)} 
                    alt={skill} 
                    className="w-7 h-7 md:w-9 md:h-9 object-contain opacity-60 group-hover:opacity-100 transition-all duration-500 ease-out filter grayscale brightness-200 group-hover:grayscale-0 group-hover:brightness-100 group-hover:drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]"
                  />
                  <span className="text-[8px] md:text-[10px] font-medium text-slate-400 group-hover:text-violet-300 transition-colors duration-500 ease-out text-center px-1">
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  PROJECTS
// ═══════════════════════════════════════════════════════════════════

const PROJECT_ICONS = [Server, Cloud, Shield, GitBranch];

function ProjectsRoute({ projects }) {
  return (
    <PageWrapper>
      <div className="animate-float w-full max-w-5xl bg-black/20 backdrop-blur-3xl border border-white/5 rounded-3xl p-8 md:p-12 text-white shadow-[0_40px_80px_rgba(0,0,0,0.5)] my-auto relative overflow-hidden">
        
        {/* Abstract background glows */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-500/10 blur-[160px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-orange-500/10 blur-[160px] rounded-full pointer-events-none" />

        <div className="flex items-center gap-4 mb-10 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <Server className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight drop-shadow-md">Architecture Portfolio</h2>
            <p className="text-amber-500/70 text-[11px] font-mono uppercase tracking-widest mt-1">Production-Grade Distributed Systems</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {projects?.map((p, i) => {
            const Icon = PROJECT_ICONS[i % PROJECT_ICONS.length];
            return (
              <div 
                key={p.id} 
                className="group relative bg-black/20 hover:bg-black/30 p-7 rounded-2xl border border-white/10 hover:border-amber-500/40 transition-all duration-700 ease-out overflow-hidden hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-fade-in flex flex-col"
                style={{ animationFillMode: 'both', animationDelay: `${i * 150 + 200}ms` }}
              >
                {/* Neon Top Border */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" />

                <div className="flex justify-between items-start mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500/10 group-hover:border-amber-500/30 transition-all duration-700 ease-out shadow-inner">
                    <Icon className="w-7 h-7 text-slate-300 group-hover:text-amber-400 transition-colors duration-700 ease-out" />
                  </div>
                  <div className="flex gap-2">
                    {p.githubUrl && (
                      <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-amber-500/20 hover:border-amber-500/50 hover:text-amber-400 hover:scale-110 transition-all group/btn shadow-md">
                        <Code className="w-4 h-4 text-slate-400 group-hover/btn:text-amber-400" />
                      </a>
                    )}
                    {p.demoUrl && (
                      <a href={p.demoUrl} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-amber-500/20 hover:border-amber-500/50 hover:text-amber-400 hover:scale-110 transition-all group/btn shadow-md">
                        <ExternalLink className="w-4 h-4 text-slate-400 group-hover/btn:text-amber-400" />
                      </a>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-100 tracking-wide group-hover:text-amber-400 transition-colors mb-3">
                  {p.title}
                </h3>
                
                <p className="text-slate-400 text-xs leading-relaxed mb-6 flex-1">
                  {p.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-auto">
                  {p.techStack?.map(t => {
                    // Match simple brand names for our CDN fetch
                    const cleanName = t.replace(' 21', '').replace(' 3', '').replace('Cloud Gateway', '').trim();
                    return (
                      <span key={t} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-black/20 border border-white/10 rounded-lg text-[10px] font-medium text-slate-300 group-hover:border-amber-500/30 transition-colors">
                        <img 
                          src={getIconUrl(cleanName)} 
                          alt={cleanName} 
                          className="w-3 h-3 object-contain opacity-70 group-hover:opacity-100 grayscale group-hover:grayscale-0 transition-all duration-500 ease-out"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        {t}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PageWrapper>
  );
}


