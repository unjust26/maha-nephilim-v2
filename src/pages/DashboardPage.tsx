import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";

const SCAN_TYPES = [
  { id: "port", label: "Port Scan", icon: "🔍", placeholder: "e.g. 192.168.1.1 or scanme.nmap.org" },
  { id: "osint", label: "OSINT Lookup", icon: "🌐", placeholder: "e.g. email@example.com or domain.com" },
  { id: "vuln", label: "Vuln Scan", icon: "🛡️", placeholder: "e.g. https://target.com" },
  { id: "ssl", label: "SSL Check", icon: "🔐", placeholder: "e.g. google.com" },
  { id: "dns", label: "DNS Analyze", icon: "🧬", placeholder: "e.g. example.com" },
  { id: "headers", label: "Header Audit", icon: "📋", placeholder: "e.g. https://target.com" },
];

// Simulated scan results
function generateResults(type: string, target: string): string {
  const results: Record<string, string> = {
    port: `PORT SCAN: ${target}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nPORT    STATE   SERVICE   VERSION\n22/tcp  open    ssh       OpenSSH 8.9\n80/tcp  open    http      nginx/1.22\n443/tcp open    https     nginx/1.22\n3306/tcp closed mysql     -\n8080/tcp open    http-alt  Apache Tomcat\n\n5 ports scanned, 4 open, 1 closed\nOS Detection: Linux 5.x (96% confidence)\nScan completed in 2.4s`,
    osint: `OSINT REPORT: ${target}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n[+] Domain registered: 2019-03-14\n[+] Registrar: GoDaddy LLC\n[+] Name servers: ns1.dns.com, ns2.dns.com\n[+] MX records: 2 found (Google Workspace)\n[+] SPF: v=spf1 include:_spf.google.com ~all\n[+] DMARC: p=reject (properly configured)\n[+] Subdomains found: 8\n    - www, mail, api, dev, staging, cdn, blog, admin\n[+] Technologies: React, Node.js, CloudFlare\n[!] dev.${target} — exposed to public internet`,
    vuln: `VULNERABILITY SCAN: ${target}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n[CRITICAL] CVE-2024-3094 — XZ Utils backdoor\n[HIGH]     Missing X-Frame-Options header\n[HIGH]     TLS 1.0 enabled (POODLE attack vector)\n[MEDIUM]   No Content-Security-Policy\n[MEDIUM]   Server version disclosed in headers\n[LOW]      Cookies without SameSite attribute\n[LOW]      Missing Referrer-Policy header\n[INFO]     HSTS enabled (max-age=31536000)\n\n7 vulnerabilities found (1 critical, 2 high, 2 medium, 2 low)`,
    ssl: `SSL/TLS ANALYSIS: ${target}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nCertificate: Let's Encrypt R3\nValid: 2024-01-15 → 2024-04-14\nKey: RSA 2048-bit\nSignature: SHA256withRSA\n\nProtocols:\n  TLS 1.3  ✅ Supported\n  TLS 1.2  ✅ Supported  \n  TLS 1.1  ❌ Disabled\n  TLS 1.0  ❌ Disabled\n  SSL 3.0  ❌ Disabled\n\nCipher Suites: 4 strong, 0 weak\nHSTS: Enabled (max-age=31536000)\nOverall Grade: A`,
    dns: `DNS ANALYSIS: ${target}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nA Record:     104.21.48.1, 172.67.162.1\nAAAA Record:  2606:4700:3031::6815:3001\nMX Records:   aspmx.l.google.com (pri:1)\nNS Records:   ns1.dns.com, ns2.dns.com\nTXT Records:  SPF, DKIM, site-verification\n\nZone Transfer: DENIED ✅\nDNSSEC: Not configured ⚠️\nRecursion: Disabled ✅\nCAA Records: letsencrypt.org ✅`,
    headers: `HEADER AUDIT: ${target}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n✅ X-Content-Type-Options: nosniff\n✅ X-Frame-Options: DENY\n✅ Strict-Transport-Security: max-age=31536000\n❌ Content-Security-Policy: MISSING\n❌ Permissions-Policy: MISSING\n⚠️ Referrer-Policy: no-referrer-when-downgrade\n✅ X-XSS-Protection: 0 (modern approach)\n⚠️ Server: nginx/1.22.1 (version disclosed)\n\nScore: 6/8 headers configured\nRecommendation: Add CSP and Permissions-Policy`,
  };
  return results[type] || "Scan complete. No results.";
}

export function DashboardPage() {
  const scans = useQuery(api.scans.list);
  const threats = useQuery(api.threats.list);
  const createScan = useMutation(api.scans.create);
  const seedThreats = useMutation(api.threats.seed);
  const [scanType, setScanType] = useState("port");
  const [target, setTarget] = useState("");
  const [scanning, setScanning] = useState(false);
  const [tab, setTab] = useState<"scanner" | "threats" | "history">("scanner");

  useEffect(() => {
    seedThreats();
  }, [seedThreats]);

  const handleScan = async () => {
    if (!target.trim()) return;
    setScanning(true);
    // Simulate scan delay
    await new Promise((r) => setTimeout(r, 1500 + Math.random() * 2000));
    const results = generateResults(scanType, target);
    await createScan({
      type: scanType,
      target: target.trim(),
      results,
      status: "complete",
    });
    setScanning(false);
    setTarget("");
  };

  const sevColors: Record<string, string> = {
    critical: "text-red-400 bg-red-500/10 border-red-500/20",
    high: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    low: "text-green-400 bg-green-500/10 border-green-500/20",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-mono flex items-center gap-2">
            <span className="text-green-500">🛡️</span> NEPHILIM v2
          </h1>
          <p className="text-muted-foreground text-sm font-mono">Cybersecurity Command Center</p>
        </div>
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          {(["scanner", "threats", "history"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                tab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {tab === "scanner" && (
        <div className="space-y-4">
          {/* Scan Type Selector */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {SCAN_TYPES.map((s) => (
              <button
                key={s.id}
                onClick={() => setScanType(s.id)}
                className={`rounded-lg border p-3 text-left transition-all ${
                  scanType === s.id
                    ? "border-green-500/40 bg-green-500/5"
                    : "border-border hover:border-green-500/20"
                }`}
              >
                <span className="text-lg">{s.icon}</span>
                <div className="text-xs font-mono mt-1">{s.label}</div>
              </button>
            ))}
          </div>

          {/* Target Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleScan()}
              placeholder={SCAN_TYPES.find((s) => s.id === scanType)?.placeholder}
              className="flex-1 rounded-lg border bg-background px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-500/40"
            />
            <Button
              onClick={handleScan}
              disabled={!target.trim() || scanning}
              className="bg-green-600 hover:bg-green-700 text-white font-mono px-6"
            >
              {scanning ? "SCANNING..." : "$ SCAN"}
            </Button>
          </div>

          {/* Latest Result */}
          {scans && scans.length > 0 && (
            <div className="rounded-xl border bg-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-muted-foreground">
                  Latest: {SCAN_TYPES.find((s) => s.id === scans[0].type)?.label} → {scans[0].target}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 font-mono">
                  ● COMPLETE
                </span>
              </div>
              <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap bg-muted/50 rounded-lg p-4 overflow-auto max-h-80">
                {scans[0].results}
              </pre>
            </div>
          )}
        </div>
      )}

      {tab === "threats" && (
        <div className="space-y-2">
          <div className="grid grid-cols-4 gap-3 mb-4">
            {["critical", "high", "medium", "low"].map((sev) => {
              const count = threats?.filter((t: any) => t.severity === sev).length || 0;
              return (
                <div key={sev} className={`rounded-lg border p-3 ${sevColors[sev]}`}>
                  <div className="text-2xl font-bold font-mono">{count}</div>
                  <div className="text-xs uppercase">{sev}</div>
                </div>
              );
            })}
          </div>
          {threats?.map((t: any) => (
            <div key={t._id} className="rounded-lg border bg-card p-3 flex items-start gap-3">
              <span className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full border font-mono font-bold ${sevColors[t.severity]}`}>
                {t.severity.toUpperCase()}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm">{t.description}</p>
                <p className="text-xs text-muted-foreground font-mono mt-1">
                  Source: {t.source} · {new Date(t.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "history" && (
        <div className="space-y-2">
          {scans && scans.length === 0 && (
            <div className="text-center text-muted-foreground py-12 font-mono text-sm">
              No scans yet. Run your first scan from the Scanner tab.
            </div>
          )}
          {scans?.map((s: any) => (
            <div key={s._id} className="rounded-lg border bg-card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span>{SCAN_TYPES.find((t) => t.id === s.type)?.icon}</span>
                  <span className="font-mono text-sm font-medium">{s.type.toUpperCase()}</span>
                  <span className="text-muted-foreground text-xs">→ {s.target}</span>
                </div>
                <span className="text-xs text-muted-foreground font-mono">
                  {new Date(s.createdAt).toLocaleString()}
                </span>
              </div>
              <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap bg-muted/50 rounded-lg p-3 overflow-auto max-h-40">
                {s.results}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
