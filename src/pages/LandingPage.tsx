import { useEffect, useRef, useState } from "react";

/* ─── Matrix Rain ─── */
function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = 700;
    };
    resize();
    window.addEventListener("resize", resize);

    const chars = "NEPHILIM01アイウエオカキクケコサシスセソ{}[]<>=/\\|!@#$%^&*";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = new Array(columns).fill(1).map(() => Math.random() * -100);
    let animId: number;

    const draw = () => {
      ctx.fillStyle = "rgba(9, 9, 11, 0.06)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Green gradient — brighter at the head
        const alpha = Math.max(0, 1 - (drops[i] * fontSize) / canvas.height);
        ctx.fillStyle = `rgba(34, 197, 94, ${0.15 + alpha * 0.6})`;
        ctx.font = `${fontSize}px monospace`;
        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 0.5 + Math.random() * 0.3;
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full pointer-events-none opacity-40" style={{ zIndex: 0 }} />;
}

/* ─── Threat Counter ─── */
function ThreatCounter({ end, label, delay }: { end: number; label: string; delay: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      let current = 0;
      const step = Math.max(1, Math.floor(end / 40));
      const interval = setInterval(() => {
        current += step;
        if (current >= end) {
          current = end;
          clearInterval(interval);
        }
        setCount(current);
      }, 30);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [end, delay]);

  return (
    <div className="text-center">
      <div className="text-3xl font-bold font-mono text-green-400">{count.toLocaleString()}{end >= 100 ? "+" : ""}</div>
      <div className="text-xs text-zinc-500 mt-1">{label}</div>
    </div>
  );
}

/* ─── Module Card ─── */
function ModuleCard({ icon, title, desc, status, index }: {
  icon: string; title: string; desc: string; status: string; index: number;
}) {
  const [hover, setHover] = useState(false);
  const colors: Record<string, string> = {
    active: "text-green-400 bg-green-500/10 border-green-500/20",
    beta: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    coming: "text-zinc-500 bg-zinc-500/10 border-zinc-500/20",
  };

  return (
    <div
      className="rounded-xl border border-green-500/10 bg-zinc-900/60 backdrop-blur-xl p-5 transition-all duration-300"
      style={{
        animation: `fadeSlideUp 0.5s ease-out ${index * 0.06}s both`,
        transform: hover ? "translateY(-4px)" : "translateY(0)",
        borderColor: hover ? "rgba(34, 197, 94, 0.25)" : undefined,
        boxShadow: hover ? "0 12px 40px rgba(34, 197, 94, 0.06)" : "none",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${colors[status]}`}>
          {status === "active" ? "● ACTIVE" : status === "beta" ? "◐ BETA" : "○ COMING"}
        </span>
      </div>
      <h3 className="font-semibold text-white mb-1.5 font-mono text-sm">{title}</h3>
      <p className="text-xs text-zinc-400 leading-relaxed">{desc}</p>
    </div>
  );
}

/* ─── Main Landing ─── */
export function LandingPage() {
  const [typedText, setTypedText] = useState("");
  const fullText = "Signal Awareness. Threat Detection. Digital Dominance.";

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i <= fullText.length) {
        setTypedText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 35);
    return () => clearInterval(timer);
  }, []);

  const modules = [
    { icon: "🔍", title: "PORT SCANNER", desc: "Advanced TCP/UDP port scanning with service detection, banner grabbing, and OS fingerprinting. SYN stealth scan support.", status: "active" },
    { icon: "🌐", title: "OSINT ENGINE", desc: "Open-source intelligence gathering — email breach lookup, domain WHOIS, social media enumeration, and dark web monitoring.", status: "active" },
    { icon: "🛡️", title: "VULN SCANNER", desc: "Automated vulnerability assessment against CVE databases. Web app scanning with OWASP Top 10 checks and exploit matching.", status: "active" },
    { icon: "📡", title: "NETWORK MONITOR", desc: "Real-time packet analysis, traffic anomaly detection, ARP spoofing alerts, and bandwidth monitoring with visual graphs.", status: "active" },
    { icon: "🔐", title: "SSL/TLS INSPECTOR", desc: "Certificate chain validation, cipher suite analysis, HSTS check, and protocol downgrade detection across all endpoints.", status: "beta" },
    { icon: "🗺️", title: "SUBDOMAIN ENUM", desc: "Certificate transparency log mining, DNS brute-force, and recursive subdomain discovery with wildcard detection.", status: "active" },
    { icon: "📋", title: "HEADER ANALYZER", desc: "HTTP security header audit — CSP, CORS, X-Frame, HSTS, and cookie flags. Automated remediation suggestions.", status: "active" },
    { icon: "🔑", title: "CREDENTIAL AUDIT", desc: "Password strength analysis, hash identification (MD5/SHA/bcrypt), and leaked credential cross-referencing.", status: "beta" },
    { icon: "🧬", title: "DNS ANALYZER", desc: "Zone transfer testing, DNS rebinding detection, DNSSEC validation, and recursive resolver security assessment.", status: "active" },
    { icon: "📊", title: "THREAT DASHBOARD", desc: "Unified threat intelligence feed with severity scoring, trend analysis, and exportable PDF reports.", status: "active" },
    { icon: "🤖", title: "AI THREAT INTEL", desc: "Machine learning-powered threat classification, predictive attack surface mapping, and automated incident response.", status: "coming" },
    { icon: "⚡", title: "EXPLOIT FRAMEWORK", desc: "Modular exploit toolkit for authorized penetration testing. Metasploit-compatible payloads with safety guardrails.", status: "coming" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-x-hidden">
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes scanLine {
          0% { top: 0; }
          100% { top: 100%; }
        }
      `}</style>

      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-green-500/10">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <span className="text-sm">🛡️</span>
            </div>
            <span className="font-bold font-mono tracking-tight text-green-400">NEPHILIM</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20 font-mono">v2.0</span>
          </div>
          <div className="flex items-center gap-6 text-sm font-mono">
            <a href="#modules" className="text-zinc-400 hover:text-green-400 transition-colors text-xs">MODULES</a>
            <a href="#threat-feed" className="text-zinc-400 hover:text-green-400 transition-colors text-xs">THREATS</a>
            <a href="/login" className="px-4 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs transition-colors font-medium">ACCESS</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[700px] flex items-center justify-center px-6 pt-16 overflow-hidden">
        <MatrixRain />

        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-green-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-emerald-500/5 rounded-full blur-[120px]" />

        <div className="relative z-10 text-center max-w-3xl" style={{ animation: "fadeSlideUp 0.8s ease-out" }}>
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-mono text-green-400">SYSTEM ONLINE • ALL MODULES OPERATIONAL</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-mono tracking-tight leading-[1.08] mb-4">
            <span className="text-green-400">NEPHILIM</span>
            <br />
            <span className="text-white text-3xl md:text-4xl lg:text-5xl">v2.0</span>
          </h1>

          <div className="h-8 mb-6">
            <p className="text-base md:text-lg text-zinc-400 font-mono">
              {typedText}
              <span className="text-green-400" style={{ animation: "blink 0.8s step-end infinite" }}>█</span>
            </p>
          </div>

          <p className="text-sm text-zinc-500 max-w-lg mx-auto mb-8">
            Full-spectrum cybersecurity suite — from reconnaissance to threat mitigation. 
            Built for operators who demand precision. Evolved from the original NEPHILIM Signal Awareness Radar.
          </p>

          <div className="flex items-center justify-center gap-4">
            <a href="/signup" className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-mono text-sm hover:opacity-90 transition-opacity">
              $ INITIALIZE
            </a>
            <a href="#modules" className="px-6 py-3 rounded-xl border border-green-500/20 text-green-400 font-mono text-sm hover:bg-green-500/5 transition-colors">
              &gt; VIEW MODULES
            </a>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-10 mt-12">
            <ThreatCounter end={12} label="Modules" delay={200} />
            <ThreatCounter end={847} label="Threats Logged" delay={400} />
            <ThreatCounter end={156} label="CVEs Tracked" delay={600} />
            <ThreatCounter end={99} label="Uptime %" delay={800} />
          </div>
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="py-16 px-6 border-t border-green-500/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-block text-xs font-mono text-green-400 bg-green-500/10 border border-green-500/20 rounded px-3 py-1 mb-3">
              // SECURITY MODULES
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-mono">
              <span className="text-green-400">12</span> Offensive & Defensive Tools
            </h2>
            <p className="text-sm text-zinc-500 mt-2 font-mono">Each module operates independently or as part of an integrated scan pipeline</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {modules.map((m, i) => (
              <ModuleCard key={m.title} {...m} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Simulated Threat Feed */}
      <section id="threat-feed" className="py-16 px-6 border-t border-green-500/10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block text-xs font-mono text-green-400 bg-green-500/10 border border-green-500/20 rounded px-3 py-1 mb-3">
              // LIVE THREAT FEED
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-mono">Recent Detections</h2>
          </div>

          <div className="space-y-2 font-mono text-xs">
            {[
              { time: "00:14:32", sev: "CRIT", color: "text-red-400 bg-red-500/10", msg: "CVE-2024-3094 detected in xz-utils 5.6.0 — backdoor in liblzma" },
              { time: "00:12:18", sev: "HIGH", color: "text-orange-400 bg-orange-500/10", msg: "Open SSH port 22 with weak ciphers on 192.168.1.105 — brute force risk" },
              { time: "00:09:45", sev: "MED ", color: "text-yellow-400 bg-yellow-500/10", msg: "Missing CSP header on https://target.com — XSS attack surface" },
              { time: "00:07:22", sev: "HIGH", color: "text-orange-400 bg-orange-500/10", msg: "Email found in breach DB (Collection #5) — credential stuffing vector" },
              { time: "00:05:11", sev: "LOW ", color: "text-green-400 bg-green-500/10", msg: "DNS zone transfer allowed on ns1.example.com — info disclosure" },
              { time: "00:03:44", sev: "MED ", color: "text-yellow-400 bg-yellow-500/10", msg: "TLS 1.0 enabled on port 443 — POODLE downgrade attack possible" },
              { time: "00:01:28", sev: "CRIT", color: "text-red-400 bg-red-500/10", msg: "Suspicious outbound C2 traffic to 45.33.32.156:8443 — possible exfil" },
            ].map((t, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/50 border border-green-500/5 hover:border-green-500/15 transition-colors"
                style={{ animation: `fadeSlideUp 0.4s ease-out ${i * 0.06}s both` }}
              >
                <span className="text-zinc-600 shrink-0">[{t.time}]</span>
                <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold ${t.color}`}>{t.sev}</span>
                <span className="text-zinc-300 truncate">{t.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 border-t border-green-500/10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold font-mono mb-3">
            <span className="text-green-400">$</span> Ready to operate?
          </h2>
          <p className="text-sm text-zinc-500 font-mono mb-6">
            Initialize NEPHILIM v2 and gain full-spectrum signal awareness.
            <br />For authorized security professionals only.
          </p>
          <a href="/signup" className="inline-block px-8 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-mono text-sm hover:opacity-90 transition-opacity">
            $ sudo nephilim --init
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-green-500/10 py-8 text-center text-xs text-zinc-600 font-mono">
        <p>NEPHILIM v2.0 · Signal Awareness Radar · Built by <span className="text-green-500">MahaKarya</span> 🇧🇳</p>
        <p className="mt-1 text-zinc-700">For authorized security testing only. Unauthorized use is prohibited.</p>
      </footer>
    </div>
  );
}
