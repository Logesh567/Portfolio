import { useState, useEffect, useRef } from "react";
import "./App.css";

// ── THEMES ─────────────────────────────────────────────────────────────────
const THEMES = {
  light: { label:"Light", bg:"#F8F9FC", bgCard:"#FFFFFF", bgNav:"rgba(248,249,252,0.93)", border:"#E5E9F0", borderStrong:"#CBD5E1", text:"#0F172A", textSub:"#475569", textMuted:"#94A3B8", accent:"#2563EB", accentLight:"#EFF6FF", accentMid:"#BFDBFE", barBg:"#E2E8F0", shadow:"0 1px 4px rgba(0,0,0,0.07),0 8px 24px rgba(0,0,0,0.05)", shadowHover:"0 4px 24px rgba(37,99,235,0.14)", inputBg:"#F1F5F9" },
  navy:  { label:"Navy",  bg:"#080E1F", bgCard:"#0E1729", bgNav:"rgba(8,14,31,0.93)",     border:"#1A2742", borderStrong:"#243556", text:"#E8EDF8", textSub:"#8FA4C8", textMuted:"#3E5278", accent:"#3B82F6", accentLight:"#172240", accentMid:"#1D3461", barBg:"#1A2742", shadow:"0 1px 4px rgba(0,0,0,0.4),0 8px 24px rgba(0,0,0,0.3)",  shadowHover:"0 4px 24px rgba(59,130,246,0.2)",  inputBg:"#0E1729" },
};

const SKILLS = [
  { name:"HTML & CSS", level:90 },
  { name:"Python",     level:85 },
  { name:"JavaScript", level:80 },
  { name:"MySQL",      level:75 },
  { name:"React",      level:72 },
  { name:"Node.js",    level:68 },
];

const PROJECTS = [
  { title:"Student Result Portal",    desc:"A full-stack web app to manage and display student results with admin login, CRUD operations, and MySQL backend.", tags:["Python","HTML/CSS","MySQL"], icon:"🎓", year:"2024" },
  { title:"Inventory Manager",        desc:"Desktop-style inventory tracking system with search, filters, and real-time stock updates built during internship.", tags:["JavaScript","MySQL","CSS"],  icon:"📦", year:"2025" },
  { title:"Personal Portfolio",       desc:"This very portfolio — designed and built from scratch using React with theme switching and responsive layout.",    tags:["React","CSS","JavaScript"],  icon:"💼", year:"2025" },
  { title:"Library Management System",desc:"A Python-based CLI tool to manage book records, borrower details, and due-date tracking with a MySQL database.",   tags:["Python","MySQL"],            icon:"📚", year:"2023" },
];

const EDUCATION = [
  { school:"D B Jain College",           degree:"B.Sc Computer Science",        year:"2022–2025", badge:"Graduate" },
  { school:"Manuelmony Matric. School",  degree:"Higher Secondary Certificate", year:"2020–2022", badge:"76%"      },
  { school:"Manuelmony Matric. School",  degree:"Secondary School Certificate", year:"2019–2020", badge:"70%"      },
];

const STRENGTHS = [
  { icon:"◈", label:"Analytical",    desc:"Structured, logical problem-solving approach." },
  { icon:"◉", label:"Quick Learner", desc:"Rapidly adopts new tech with genuine curiosity." },
  { icon:"◎", label:"Team Player",   desc:"Clear communicator, thrives in teams." },
];

const NAV = ["home","about","projects","skills","contact"];

// ── HELPERS ────────────────────────────────────────────────────────────────
function useVisible(threshold = 0.15) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
}

function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mobile;
}

// ── LOGO — simple PNG image ────────────────────────────────────────────────
function LMLogo() {
  return (
    <img
      src={process.env.PUBLIC_URL + "/lm-logo.png"}
      alt="LM Logo"
      style={{ width:48, height:48, display:"block", borderRadius:10 }}
    />
  );
}

function SkillBar({ name, level, delay, t }) {
  const [ref, vis] = useVisible(0.4);
  return (
    <div ref={ref} style={{ marginBottom:22 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
        <span style={{ fontSize:13, fontWeight:500, color:t.textSub }}>{name}</span>
        <span style={{ fontSize:12, fontWeight:600, color:t.accent, fontFamily:"'DM Mono',monospace" }}>{vis ? level : 0}%</span>
      </div>
      <div style={{ height:5, background:t.barBg, borderRadius:99, overflow:"hidden" }}>
        <div style={{ height:"100%", borderRadius:99, background:`linear-gradient(90deg,${t.accent},${t.accent}99)`, width:vis?`${level}%`:"0%", transition:`width 1s cubic-bezier(.4,0,.2,1) ${delay}ms` }}/>
      </div>
    </div>
  );
}

// ── MAIN ───────────────────────────────────────────────────────────────────
export default function Portfolio() {
  const [theme,    setTheme]    = useState("light");
  const [section,  setSection]  = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [form,     setForm]     = useState({ name:"", email:"", subject:"", message:"" });
  const [errors,   setErrors]   = useState({});
  const [sent,     setSent]     = useState(false);
  const [sending,  setSending]  = useState(false);
  const t = THEMES[theme];
  const isMobile = useIsMobile();

  useEffect(() => {
    const fn = () => {
      for (let i = NAV.length - 1; i >= 0; i--) {
        const el = document.getElementById(NAV[i]);
        if (el && window.scrollY >= el.offsetTop - 130) { setSection(NAV[i]); break; }
      }
    };
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { if (!isMobile) setMenuOpen(false); }, [isMobile]);

  const go = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });
    setSection(id);
    setMenuOpen(false);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = "Name is required.";
    if (!form.email.trim())   e.email   = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.subject.trim()) e.subject = "Subject is required.";
    if (!form.message.trim()) e.message = "Message is required.";
    else if (form.message.trim().length < 20) e.message = "Message must be at least 20 characters.";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setSending(true);
    try {
      await fetch("https://api.web3forms.com/submit", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ access_key:"9b9dfe11-966d-4d7c-a37c-317badf69445", name:form.name, email:form.email, subject:form.subject, message:form.message }),
      });
      setSending(false); setSent(true);
      setForm({ name:"", email:"", subject:"", message:"" });
    } catch {
      setSending(false);
      setErrors({ message:"Something went wrong. Please try again." });
    }
  };

  const field = (key, label, type="text", rows=null) => {
    const hasErr = !!errors[key];
    const base = { width:"100%", background:t.inputBg, border:`1.5px solid ${hasErr?"#EF4444":t.border}`, borderRadius:10, padding:rows?"12px 14px":"11px 14px", fontSize:14, color:t.text, fontFamily:"'Plus Jakarta Sans',sans-serif", outline:"none", resize:rows?"vertical":"none", transition:"border 0.2s", boxSizing:"border-box" };
    return (
      <div style={{ marginBottom:18 }}>
        <label style={{ fontSize:12, fontWeight:600, color:t.textSub, display:"block", marginBottom:6 }}>{label}</label>
        {rows
          ? <textarea rows={rows} value={form[key]} onChange={e=>{ setForm(f=>({...f,[key]:e.target.value})); setErrors(er=>({...er,[key]:""})); }} style={base} placeholder={`Enter your ${label.toLowerCase()}…`}/>
          : <input type={type} value={form[key]} onChange={e=>{ setForm(f=>({...f,[key]:e.target.value})); setErrors(er=>({...er,[key]:""})); }} style={base} placeholder={`Enter your ${label.toLowerCase()}…`}/>
        }
        {hasErr && <div style={{ fontSize:11, color:"#EF4444", marginTop:4 }}>⚠ {errors[key]}</div>}
      </div>
    );
  };

  const px = isMobile ? "20px" : "48px";
  const sectionPad = isMobile ? "72px 20px" : "100px 48px";
  const RESUME = process.env.PUBLIC_URL + "/Logesh_Resume.pdf";

  return (
    <div style={{ background:t.bg, minHeight:"100vh", color:t.text, fontFamily:"'Plus Jakarta Sans',sans-serif", transition:"background .3s,color .3s" }}>
      <style>{`
        ::-webkit-scrollbar-thumb { background: ${t.accent}; border-radius: 4px; }
        .nav-btn:hover             { color: ${t.accent} !important; }
        .proj-card:hover           { transform: translateY(-5px) !important; box-shadow: ${t.shadowHover} !important; border-color: ${t.accent}44 !important; }
        .resume-btn:hover          { background: ${t.accent} !important; color: #fff !important; }
        .mob-nav-btn:hover         { background: ${t.accentLight} !important; color: ${t.accent} !important; }
        .hire-btn:hover            { opacity: 0.85 !important; transform: translateY(-1px) !important; }
        input:focus, textarea:focus { border-color: ${t.accent} !important; box-shadow: 0 0 0 3px ${t.accent}22; }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:200, background:t.bgNav, backdropFilter:"blur(18px)", borderBottom:`1px solid ${t.border}`, transition:"background .3s" }}>
        <div style={{ height:64, display:"flex", justifyContent:"space-between", alignItems:"center", padding:`0 ${px}` }}>

          <LMLogo/>

          {!isMobile && (
            <div style={{ display:"flex", gap:4 }}>
              {NAV.map(l=>(
                <button key={l} className="nav-btn" onClick={()=>go(l)} style={{ background:section===l?t.accentLight:"transparent", border:"none", cursor:"pointer", padding:"7px 16px", borderRadius:8, fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:13, fontWeight:500, color:section===l?t.accent:t.textSub, textTransform:"capitalize", transition:"all .2s" }}>{l}</button>
              ))}
            </div>
          )}

          {!isMobile && (
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              {Object.entries(THEMES).map(([key])=>(
                <button key={key} className="theme-dot" onClick={()=>setTheme(key)} style={{ width:18, height:18, borderRadius:"50%", border:`2px solid ${theme===key?t.accent:"transparent"}`, cursor:"pointer", padding:2, background:"transparent", outline:"none", transition:"all .2s" }}>
                  <span style={{ display:"block", width:10, height:10, borderRadius:"50%", background:key==="light"?"#F8F9FC":"#080E1F", border:`1px solid ${key==="light"?"#CBD5E1":"rgba(255,255,255,.15)"}` }}/>
                </button>
              ))}
              <a href={RESUME} download="Logesh_Resume.pdf" className="resume-btn" style={{ marginLeft:6, padding:"7px 18px", borderRadius:8, background:"transparent", color:t.accent, border:`1.5px solid ${t.accent}`, fontSize:13, fontWeight:600, textDecoration:"none", transition:"all .2s", display:"flex", alignItems:"center", gap:6 }}>↓ Resume</a>
              {/* HIRE ME — scrolls to contact */}
              <button className="hire-btn" onClick={()=>go("contact")} style={{ padding:"7px 18px", borderRadius:8, background:t.accent, color:"#fff", fontSize:13, fontWeight:600, border:"none", cursor:"pointer", transition:"all .2s" }}>Hire Me</button>
            </div>
          )}

          {isMobile && (
            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
              {Object.entries(THEMES).map(([key])=>(
                <button key={key} onClick={()=>setTheme(key)} style={{ width:16, height:16, borderRadius:"50%", border:`2px solid ${theme===key?t.accent:"transparent"}`, cursor:"pointer", padding:2, background:"transparent", outline:"none" }}>
                  <span style={{ display:"block", width:8, height:8, borderRadius:"50%", background:key==="light"?"#F8F9FC":"#080E1F", border:`1px solid ${key==="light"?"#CBD5E1":"rgba(255,255,255,.15)"}` }}/>
                </button>
              ))}
              <button onClick={()=>setMenuOpen(o=>!o)} style={{ background:"transparent", border:`1px solid ${t.border}`, borderRadius:8, padding:"6px 10px", cursor:"pointer", display:"flex", flexDirection:"column", gap:4 }}>
                <span style={{ display:"block", width:18, height:2, background:t.text, borderRadius:2, transition:"all .2s", transform:menuOpen?"rotate(45deg) translate(4px,4px)":"none" }}/>
                <span style={{ display:"block", width:18, height:2, background:t.text, borderRadius:2, transition:"all .2s", opacity:menuOpen?0:1 }}/>
                <span style={{ display:"block", width:18, height:2, background:t.text, borderRadius:2, transition:"all .2s", transform:menuOpen?"rotate(-45deg) translate(4px,-4px)":"none" }}/>
              </button>
            </div>
          )}
        </div>

        {isMobile && menuOpen && (
          <div style={{ background:t.bgNav, backdropFilter:"blur(18px)", borderTop:`1px solid ${t.border}`, padding:"12px 20px 20px", animation:"slideDown .2s ease" }}>
            {NAV.map(l=>(
              <button key={l} className="mob-nav-btn" onClick={()=>go(l)} style={{ display:"block", width:"100%", textAlign:"left", background:"transparent", border:"none", cursor:"pointer", padding:"12px 16px", borderRadius:8, fontSize:15, fontWeight:500, color:section===l?t.accent:t.textSub, textTransform:"capitalize", transition:"all .2s", marginBottom:4 }}>{l}</button>
            ))}
            <div style={{ borderTop:`1px solid ${t.border}`, marginTop:8, paddingTop:12, display:"flex", gap:10 }}>
              <a href={RESUME} download="Logesh_Resume.pdf" style={{ flex:1, textAlign:"center", padding:"10px", borderRadius:8, background:"transparent", color:t.accent, border:`1.5px solid ${t.accent}`, fontSize:13, fontWeight:600, textDecoration:"none" }}>↓ Resume</a>
              <button onClick={()=>go("contact")} style={{ flex:1, textAlign:"center", padding:"10px", borderRadius:8, background:t.accent, color:"#fff", fontSize:13, fontWeight:600, border:"none", cursor:"pointer" }}>Hire Me</button>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section id="home" style={{ minHeight:"100vh", display:"flex", alignItems:"center", padding:isMobile?"100px 20px 60px":"100px 48px 60px", animation:"fadeUp .8s ease both" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", width:"100%" }}>
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 300px", gap:isMobile?40:60, alignItems:"center" }}>
            <div>
              <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:t.accentLight, border:`1px solid ${t.accentMid}`, borderRadius:99, padding:"5px 16px", marginBottom:28 }}>
                <span style={{ width:7, height:7, borderRadius:"50%", background:"#22C55E", display:"inline-block", animation:"dot 2s infinite" }}/>
                <span style={{ fontSize:12, fontWeight:600, color:t.accent }}>Open to opportunities · Chennai</span>
              </div>
              <h1 style={{ fontSize:isMobile?"clamp(40px,11vw,56px)":"clamp(44px,6vw,78px)", fontWeight:800, letterSpacing:-2.5, lineHeight:1.05, marginBottom:16, color:t.text }}>
                Hi, I'm<br/><span style={{ color:t.accent }}>Logesh M</span>
              </h1>
              <h2 style={{ fontSize:isMobile?16:20, fontWeight:400, color:t.textSub, marginBottom:20, letterSpacing:-.3 }}>Software Developer · B.Sc Computer Science</h2>
              <p style={{ fontSize:14, lineHeight:1.85, color:t.textMuted, maxWidth:520, marginBottom:36, fontWeight:400 }}>
                A passionate CS graduate from D B Jain College, currently building real-world software at Bspark Software Technologies. I craft clean, functional solutions with Python, JavaScript &amp; MySQL.
              </p>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                <button onClick={()=>go("projects")} style={{ background:t.accent, color:"#fff", border:"none", padding:"12px 24px", borderRadius:10, fontSize:14, fontWeight:600, cursor:"pointer" }}>View Projects →</button>
                <button onClick={()=>go("contact")} style={{ background:"transparent", color:t.textSub, border:`1px solid ${t.border}`, padding:"12px 24px", borderRadius:10, fontSize:14, fontWeight:500, cursor:"pointer" }}>Get in Touch</button>
                <a href={RESUME} download="Logesh_Resume.pdf" style={{ background:t.accentLight, color:t.accent, border:`1px solid ${t.accentMid}`, padding:"12px 20px", borderRadius:10, fontSize:14, fontWeight:600, textDecoration:"none", display:"inline-flex", alignItems:"center", gap:6 }}>↓ CV</a>
              </div>
              <div style={{ display:"flex", gap:isMobile?24:40, marginTop:44, paddingTop:32, borderTop:`1px solid ${t.border}` }}>
                {[["B.Sc CS","D B Jain College"],["2025–26","@ BSPARK"],["4+","Tech Skills"]].map(([v,l])=>(
                  <div key={l}>
                    <div style={{ fontSize:isMobile?18:22, fontWeight:800, color:t.text, letterSpacing:-1 }}>{v}</div>
                    <div style={{ fontSize:11, color:t.textMuted, marginTop:2 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {!isMobile && (
              <div style={{ background:t.bgCard, border:`1px solid ${t.border}`, borderRadius:20, padding:28, boxShadow:t.shadow }}>
                <div style={{ width:80, height:80, borderRadius:"50%", background:`linear-gradient(135deg,${t.accent},#60A5FA)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, fontWeight:800, color:"#fff", margin:"0 auto 20px" }}>L</div>
                <div style={{ textAlign:"center", marginBottom:24 }}>
                  <div style={{ fontWeight:700, fontSize:16, color:t.text }}>Logesh M</div>
                  <div style={{ fontSize:12, color:t.textMuted, marginTop:3 }}>Software Developer</div>
                </div>
                <div style={{ borderTop:`1px solid ${t.border}`, paddingTop:20, display:"flex", flexDirection:"column", gap:12 }}>
                  {[["📧","logeshmani567@gmail.com"],["📞","+91 93617 15621"],["📍","Perungudi, Chennai – 96"]].map(([ic,val])=>(
                    <div key={val} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                      <span style={{ fontSize:13 }}>{ic}</span>
                      <span style={{ fontSize:12, color:t.textSub, wordBreak:"break-all" }}>{val}</span>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop:`1px solid ${t.border}`, marginTop:20, paddingTop:16, display:"flex", gap:8 }}>
                  {["Tamil","English"].map(l=>(
                    <span key={l} style={{ background:t.accentLight, color:t.accent, fontSize:11, fontWeight:600, padding:"4px 10px", borderRadius:6 }}>{l}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ padding:sectionPad, borderTop:`1px solid ${t.border}` }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <SectionHeader label="About Me" title="Background & Education" t={t}/>
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:20, marginTop:40 }}>
            <div style={{ background:t.bgCard, border:`1px solid ${t.border}`, borderRadius:16, padding:isMobile?24:32, boxShadow:t.shadow }}>
              <div style={{ fontSize:12, fontWeight:600, color:t.accent, letterSpacing:1, textTransform:"uppercase", marginBottom:14 }}>Profile</div>
              <p style={{ fontSize:14, lineHeight:1.85, color:t.textSub, marginBottom:24 }}>
                A highly motivated Computer Science graduate seeking opportunities to leverage technical skills in software development, problem-solving and data analysis in a dynamic, growth-oriented organization.
              </p>
              {STRENGTHS.map(s=>(
                <div key={s.label} style={{ display:"flex", gap:14, alignItems:"flex-start", padding:"12px 14px", background:t.accentLight, borderRadius:10, marginBottom:10 }}>
                  <span style={{ color:t.accent, fontSize:16, marginTop:1 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:t.text, marginBottom:2 }}>{s.label}</div>
                    <div style={{ fontSize:12, color:t.textMuted }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {/* ── WORK EXPERIENCE (was Intern Experience) ── */}
              <div style={{ background:t.bgCard, border:`1.5px solid ${t.accent}44`, borderRadius:16, padding:isMobile?24:28, boxShadow:t.shadowHover }}>
                <div style={{ fontSize:12, fontWeight:600, color:t.accent, letterSpacing:1, textTransform:"uppercase", marginBottom:16 }}>Work Experience</div>

                {/* Job entry */}
                <div style={{ display:"flex", gap:16, alignItems:"flex-start" }}>
                  {/* Company logo placeholder */}
                  <div style={{ width:44, height:44, borderRadius:10, background:t.accentLight, border:`1px solid ${t.accentMid}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>🏢</div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:6, marginBottom:4 }}>
                      <div style={{ fontSize:15, fontWeight:700, color:t.text }}>Software Developer</div>
                      <span style={{ background:t.accentLight, color:t.accent, fontSize:11, fontWeight:600, padding:"4px 10px", borderRadius:99, border:`1px solid ${t.accentMid}`, whiteSpace:"nowrap" }}>2025 – Present</span>
                    </div>
                    <div style={{ fontSize:13, fontWeight:600, color:t.accent, marginBottom:8 }}>BSPARK Software Technologies</div>
                    <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                      {["Built and maintained web applications using JavaScript and MySQL","Collaborated with the dev team on real-world client projects","Gained hands-on experience in full-stack development workflow"].map((item,i)=>(
                        <div key={i} style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
                          <span style={{ color:t.accent, marginTop:2, fontSize:10 }}>▸</span>
                          <span style={{ fontSize:12, color:t.textSub, lineHeight:1.6 }}>{item}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop:12, display:"flex", gap:8, flexWrap:"wrap" }}>
                      {["JavaScript","MySQL","HTML/CSS","Python"].map(tag=>(
                        <span key={tag} style={{ background:t.bg, color:t.textSub, fontSize:10, fontWeight:600, padding:"3px 8px", borderRadius:5, border:`1px solid ${t.border}` }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Education */}
              <div style={{ background:t.bgCard, border:`1px solid ${t.border}`, borderRadius:16, padding:isMobile?24:28, boxShadow:t.shadow }}>
                <div style={{ fontSize:12, fontWeight:600, color:t.accent, letterSpacing:1, textTransform:"uppercase", marginBottom:18 }}>Education</div>
                {EDUCATION.map((e,i)=>(
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", paddingBottom:i<EDUCATION.length-1?16:0, marginBottom:i<EDUCATION.length-1?16:0, borderBottom:i<EDUCATION.length-1?`1px solid ${t.border}`:"none" }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:600, color:t.text, marginBottom:2 }}>{e.school}</div>
                      <div style={{ fontSize:12, color:t.textMuted }}>{e.degree}</div>
                      <div style={{ fontSize:11, color:t.textMuted, marginTop:2 }}>{e.year}</div>
                    </div>
                    <span style={{ background:t.accentLight, color:t.accent, fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:6, whiteSpace:"nowrap", marginLeft:12 }}>{e.badge}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" style={{ padding:sectionPad, background:t.bgCard, borderTop:`1px solid ${t.border}` }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <SectionHeader label="Projects" title="What I've Built" t={t}/>
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(2,1fr)", gap:16, marginTop:40 }}>
            {PROJECTS.map((p,i)=><ProjectCard key={i} p={p} t={t}/>)}
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" style={{ padding:sectionPad, borderTop:`1px solid ${t.border}` }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <SectionHeader label="Technical Skills" title="Tools & Technologies" t={t}/>
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:isMobile?32:56, marginTop:40 }}>
            <div>
              {SKILLS.map((s,i)=><SkillBar key={s.name} name={s.name} level={s.level} delay={i*100} t={t}/>)}
              <div style={{ marginTop:28 }}>
                <div style={{ fontSize:11, fontWeight:600, color:t.textMuted, letterSpacing:2, textTransform:"uppercase", marginBottom:12 }}>Languages</div>
                <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                  {["Tamil — Fluent","English — Fluent"].map(l=>(
                    <span key={l} style={{ background:t.accentLight, color:t.accent, fontSize:12, fontWeight:600, padding:"6px 14px", borderRadius:8, border:`1px solid ${t.accentMid}` }}>{l}</span>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {[{icon:"🌐",name:"HTML & CSS",desc:"Web structure & styling"},{icon:"🐍",name:"Python",desc:"Scripting & automation"},{icon:"⚡",name:"JavaScript",desc:"Dynamic interfaces"},{icon:"⚛️",name:"React",desc:"UI component library"},{icon:"🟢",name:"Node.js",desc:"Server-side JavaScript"},{icon:"🗄️",name:"MySQL",desc:"Relational databases"}].map(s=>(
                <div key={s.name} style={{ background:t.bg, border:`1px solid ${t.border}`, borderRadius:14, padding:"16px 14px" }}>
                  <div style={{ fontSize:24, marginBottom:8 }}>{s.icon}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:t.text, marginBottom:3 }}>{s.name}</div>
                  <div style={{ fontSize:11, color:t.textMuted }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding:sectionPad, borderTop:`1px solid ${t.border}` }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <SectionHeader label="Contact" title="Let's Work Together" t={t}/>
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:20, marginTop:40 }}>
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div style={{ background:t.bgCard, border:`1px solid ${t.border}`, borderRadius:16, padding:isMobile?24:32, boxShadow:t.shadow }}>
                <p style={{ fontSize:14, lineHeight:1.85, color:t.textSub, marginBottom:24 }}>
                  I'm actively looking for software development roles. Whether you have a project, job offer, or just want to say hi — I'd love to hear from you!
                </p>
                {[["📧","Email","logeshmani567@gmail.com","mailto:logeshmani567@gmail.com"],["📞","Phone","+91 93617 15621","tel:+919361715621"],["📍","Location","Perungudi, Chennai – 96",null]].map(([ic,label,val,href])=>(
                  <div key={label} style={{ display:"flex", gap:14, padding:"12px 14px", background:t.bg, borderRadius:10, border:`1px solid ${t.border}`, alignItems:"center", marginBottom:10 }}>
                    <span style={{ fontSize:18 }}>{ic}</span>
                    <div>
                      <div style={{ fontSize:11, color:t.textMuted, fontWeight:500 }}>{label}</div>
                      {href ? <a href={href} style={{ fontSize:13, color:t.accent, fontWeight:500, textDecoration:"none" }}>{val}</a>
                             : <div style={{ fontSize:13, color:t.textSub }}>{val}</div>}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background:`linear-gradient(135deg,${t.accent},#60A5FA)`, borderRadius:16, padding:24 }}>
                <div style={{ fontSize:12, fontWeight:600, color:"rgba(255,255,255,.7)", letterSpacing:1, textTransform:"uppercase", marginBottom:10 }}>Currently At</div>
                <div style={{ fontSize:isMobile?17:20, fontWeight:800, color:"#fff", marginBottom:4 }}>BSPARK Software Technologies</div>
                <div style={{ fontSize:13, color:"rgba(255,255,255,.75)" }}>Software Developer · 2025 – Present</div>
                <a href={RESUME} download="Logesh_Resume.pdf" style={{ display:"inline-flex", alignItems:"center", gap:8, marginTop:16, background:"rgba(255,255,255,.2)", color:"#fff", padding:"9px 20px", borderRadius:8, fontSize:13, fontWeight:600, textDecoration:"none" }}>↓ Download Resume</a>
              </div>
            </div>

            <div style={{ background:t.bgCard, border:`1px solid ${t.border}`, borderRadius:16, padding:isMobile?24:36, boxShadow:t.shadow }}>
              {sent ? (
                <div style={{ textAlign:"center", padding:"40px 20px" }}>
                  <div style={{ fontSize:52, marginBottom:16 }}>✅</div>
                  <div style={{ fontSize:20, fontWeight:700, color:t.text, marginBottom:8 }}>Message Sent!</div>
                  <div style={{ fontSize:14, color:t.textSub, marginBottom:28 }}>Thanks for reaching out, Logesh will get back to you soon.</div>
                  <button onClick={()=>setSent(false)} style={{ background:t.accentLight, color:t.accent, border:`1px solid ${t.accentMid}`, padding:"10px 24px", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer" }}>Send Another</button>
                </div>
              ) : (
                <>
                  <div style={{ fontSize:15, fontWeight:700, color:t.text, marginBottom:20 }}>Send a Message</div>
                  <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:"0 16px" }}>
                    <div>{field("name","Full Name")}</div>
                    <div>{field("email","Email Address","email")}</div>
                  </div>
                  {field("subject","Subject")}
                  {field("message","Message","text",5)}
                  <button className="submit-btn" onClick={handleSubmit} disabled={sending} style={{ width:"100%", background:t.accent, color:"#fff", border:"none", padding:"13px", borderRadius:10, fontSize:14, fontWeight:700, cursor:sending?"not-allowed":"pointer", transition:"opacity .2s", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                    {sending ? <><span style={{ width:16, height:16, border:"2px solid rgba(255,255,255,.4)", borderTopColor:"#fff", borderRadius:"50%", display:"inline-block", animation:"spin .7s linear infinite" }}/> Sending…</> : "Send Message ✉"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop:`1px solid ${t.border}`, padding:isMobile?"20px":"28px 48px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12, paddingLeft:px, paddingRight:px }}>
        <LMLogo/>
        <div style={{ fontSize:12, color:t.textMuted }}>© 2025 Logesh M · Chennai</div>
        <div style={{ display:"flex", gap:8 }}>
          {Object.entries(THEMES).map(([key,val])=>(
            <button key={key} onClick={()=>setTheme(key)} style={{ padding:"5px 12px", borderRadius:6, border:`1px solid ${theme===key?t.accent:t.border}`, background:theme===key?t.accentLight:"transparent", color:theme===key?t.accent:t.textMuted, fontSize:11, fontWeight:500, cursor:"pointer" }}>{val.label}</button>
          ))}
        </div>
      </footer>
    </div>
  );
}

function SectionHeader({ label, title, t }) {
  return (
    <div>
      <div style={{ fontSize:12, fontWeight:600, color:t.accent, letterSpacing:2, textTransform:"uppercase", marginBottom:10 }}>{label}</div>
      <h2 style={{ fontSize:"clamp(26px,4vw,44px)", fontWeight:800, letterSpacing:-1.5, color:t.text }}>{title}</h2>
    </div>
  );
}

function ProjectCard({ p, t }) {
  const [ref, vis] = useVisible();
  return (
    <div ref={ref} className="proj-card"
      style={{ background:t.bgCard, border:`1px solid ${t.border}`, borderRadius:16, padding:24, cursor:"default", transition:"all .3s", boxShadow:t.shadow, opacity:vis?1:0, transform:vis?"none":"translateY(24px)" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
        <div style={{ width:48, height:48, borderRadius:12, background:t.accentLight, border:`1px solid ${t.accentMid}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{p.icon}</div>
        <span style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:t.textMuted }}>{p.year}</span>
      </div>
      <div style={{ fontSize:16, fontWeight:700, color:t.text, marginBottom:8, letterSpacing:-.3 }}>{p.title}</div>
      <p style={{ fontSize:13, lineHeight:1.75, color:t.textSub, marginBottom:16 }}>{p.desc}</p>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        {p.tags.map(tag=>(
          <span key={tag} style={{ background:t.accentLight, color:t.accent, fontSize:11, fontWeight:600, padding:"4px 10px", borderRadius:6, border:`1px solid ${t.accentMid}` }}>{tag}</span>
        ))}
      </div>
    </div>
  );
}