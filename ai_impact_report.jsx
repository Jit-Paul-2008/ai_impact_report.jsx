
import { useState } from "react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ComposedChart, ReferenceLine
} from "recharts";

// ─── DATA ────────────────────────────────────────────────────────────────────

const aiAdoptionData = [
  { year: "2020", orgAdoption: 50, genAI: 0, marketSize: 58 },
  { year: "2021", orgAdoption: 56, genAI: 0, marketSize: 93.5 },
  { year: "2022", orgAdoption: 52, genAI: 5,  marketSize: 136 },
  { year: "2023", orgAdoption: 55, genAI: 33, marketSize: 241.8 },
  { year: "2024", orgAdoption: 78, genAI: 71, marketSize: 294 },
  { year: "2025", orgAdoption: 80, genAI: 78, marketSize: 390.91 },
];

const layoffsData = [
  { year: "2020", layoffs: 10, aiLinked: 0, note: "Pandemic-era hiring surge" },
  { year: "2021", layoffs: 15, aiLinked: 0, note: "Peak hiring" },
  { year: "2022", layoffs: 165, aiLinked: 12, note: "Market correction begins" },
  { year: "2023", layoffs: 264, aiLinked: 45, note: "Peak layoffs; 65% of all cuts since 2022" },
  { year: "2024", layoffs: 150, aiLinked: 60, note: "AI cited more explicitly" },
  { year: "2025", layoffs: 246, aiLinked: 110, note: "AI-first restructuring dominant" },
];

const revenueData = [
  { year: "2021", msftCloud: 60, googleCloud: 19.2, awsCloud: 62.2 },
  { year: "2022", msftCloud: 75, googleCloud: 26.3, awsCloud: 80.1 },
  { year: "2023", msftCloud: 87.9, googleCloud: 33.1, awsCloud: 90.8 },
  { year: "2024", msftCloud: 105.4, googleCloud: 43.2, awsCloud: 107 },
  { year: "2025", msftCloud: 135, googleCloud: 66.1, awsCloud: 130 },
];

const trustData = [
  { year: "2020", trust: 54, optimism: 48, jobFear: 35, dataTrust: 20 },
  { year: "2021", trust: 56, optimism: 50, jobFear: 38, dataTrust: 22 },
  { year: "2022", trust: 58, optimism: 52, jobFear: 40, dataTrust: 24 },
  { year: "2023", trust: 52, optimism: 53, jobFear: 55, dataTrust: 26 },
  { year: "2024", trust: 46, optimism: 55, jobFear: 59, dataTrust: 29 },
  { year: "2025", trust: 47, optimism: 57, jobFear: 57, dataTrust: 33 },
];

const projectionData = [
  { year: "2026", marketSize: 540, layoffs: 210, adoption: 84, trust: 50, cloudRev: 200 },
  { year: "2027", marketSize: 820, layoffs: 180, adoption: 87, trust: 53, cloudRev: 260 },
  { year: "2028", marketSize: 1100, layoffs: 150, adoption: 90, trust: 57, cloudRev: 340 },
  { year: "2029", marketSize: 1450, layoffs: 120, adoption: 92, trust: 61, cloudRev: 430 },
  { year: "2030", marketSize: 1850, layoffs: 100, adoption: 95, trust: 65, cloudRev: 540 },
];

// ─── STYLES ──────────────────────────────────────────────────────────────────

const COLORS = {
  accent: "#00D4FF",
  gold: "#FFB800",
  red: "#FF4D6D",
  green: "#39D98A",
  purple: "#A78BFA",
  muted: "#8892A4",
  bg: "#0A0E1A",
  card: "#111827",
  border: "#1E2A3A",
  text: "#E2E8F0",
};

const CustomTooltip = ({ active, payload, label, suffix = "" }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "#1a2235", border: `1px solid ${COLORS.border}`,
        borderRadius: 10, padding: "12px 16px", fontSize: 13
      }}>
        <p style={{ color: COLORS.accent, fontWeight: 700, marginBottom: 6 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color, margin: "2px 0" }}>
            {p.name}: <strong>{typeof p.value === "number" ? p.value.toLocaleString() : p.value}{suffix}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── SECTION COMPONENTS ──────────────────────────────────────────────────────

function SectionCard({ title, badge, children }) {
  return (
    <div style={{
      background: COLORS.card, borderRadius: 16,
      border: `1px solid ${COLORS.border}`, padding: "32px",
      marginBottom: 32
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <span style={{
          background: "rgba(0,212,255,0.15)", color: COLORS.accent,
          fontSize: 11, fontWeight: 700, letterSpacing: 2,
          padding: "4px 10px", borderRadius: 20, textTransform: "uppercase"
        }}>{badge}</span>
        <h2 style={{ color: COLORS.text, fontSize: 20, fontWeight: 700, margin: 0 }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function StatBox({ label, value, sub, color }) {
  return (
    <div style={{
      background: "#0d1626", borderRadius: 12, padding: "20px 24px",
      border: `1px solid ${COLORS.border}`, flex: 1, minWidth: 160
    }}>
      <p style={{ color: COLORS.muted, fontSize: 11, fontWeight: 600, letterSpacing: 1.5, margin: "0 0 8px", textTransform: "uppercase" }}>{label}</p>
      <p style={{ color: color || COLORS.accent, fontSize: 28, fontWeight: 800, margin: "0 0 4px", lineHeight: 1 }}>{value}</p>
      <p style={{ color: COLORS.muted, fontSize: 12, margin: 0 }}>{sub}</p>
    </div>
  );
}

function InsightBullet({ text }) {
  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
      <span style={{ color: COLORS.accent, marginTop: 2, fontSize: 16, lineHeight: 1 }}>›</span>
      <p style={{ color: "#94a3b8", fontSize: 13.5, lineHeight: 1.65, margin: 0 }}>{text}</p>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function AIReport() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "adoption", label: "AI Usage" },
    { id: "layoffs", label: "Layoffs" },
    { id: "revenue", label: "Revenue" },
    { id: "trust", label: "Satisfaction" },
    { id: "projection", label: "2026–2030" },
  ];

  return (
    <div style={{
      background: COLORS.bg, minHeight: "100vh", fontFamily: "'Georgia', serif",
      color: COLORS.text, padding: "0 0 60px"
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0d1626 0%, #111827 60%, #0a1520 100%)",
        borderBottom: `1px solid ${COLORS.border}`, padding: "48px 40px 36px"
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ color: COLORS.accent, fontSize: 11, letterSpacing: 3, fontWeight: 700, margin: "0 0 12px", textTransform: "uppercase", fontFamily: "monospace" }}>
            Senior Data Analyst Report · March 2026
          </p>
          <h1 style={{ fontSize: 38, fontWeight: 900, margin: "0 0 14px", lineHeight: 1.15, letterSpacing: -1 }}>
            The AI Economy:<br />
            <span style={{ color: COLORS.accent }}>A Connected Analysis</span>
          </h1>
          <p style={{ color: "#64748b", fontSize: 15, margin: "0 0 28px", maxWidth: 640 }}>
            Adoption · Workforce Disruption · Revenue Impact · Public Trust · Projections through 2030
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
              { label: "Sources", val: "McKinsey · Stanford AI Index · IBM · KPMG · Layoffs.fyi · TrueUp · Grand View Research · SEC Filings · Crunchbase" }
            ].map((s, i) => (
              <span key={i} style={{
                background: "rgba(255,184,0,0.1)", border: "1px solid rgba(255,184,0,0.2)",
                color: "#94a3b8", fontSize: 11.5, padding: "4px 12px", borderRadius: 20
              }}>
                <span style={{ color: COLORS.gold }}>📊 </span>{s.label}: {s.val}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{
        background: "#0d1626", borderBottom: `1px solid ${COLORS.border}`,
        position: "sticky", top: 0, zIndex: 100
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 4, padding: "0 40px", overflowX: "auto" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              background: activeTab === t.id ? "rgba(0,212,255,0.15)" : "transparent",
              border: "none", borderBottom: activeTab === t.id ? `2px solid ${COLORS.accent}` : "2px solid transparent",
              color: activeTab === t.id ? COLORS.accent : COLORS.muted,
              padding: "14px 18px", cursor: "pointer", fontSize: 13, fontWeight: 600,
              whiteSpace: "nowrap", transition: "all 0.2s"
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: "40px auto 0", padding: "0 40px" }}>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 32 }}>
              <StatBox label="Global AI Market (2025)" value="$391B" sub="Up from $58B in 2020 · GVR" color={COLORS.accent} />
              <StatBox label="Org AI Adoption (2024)" value="78%" sub="Stanford AI Index 2025" color={COLORS.green} />
              <StatBox label="Tech Layoffs (2023)" value="264K" sub="Peak year · Layoffs.fyi" color={COLORS.red} />
              <StatBox label="AI Trust Gap (2025)" value="46%" sub="Trust AI, despite 66% using it · KPMG" color={COLORS.gold} />
            </div>

            <SectionCard title="Executive Summary" badge="Analysis">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <div>
                  <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.8, margin: "0 0 16px" }}>
                    Between 2020 and 2026, Artificial Intelligence underwent a transformation from a peripheral technology to the defining force of the modern economy. The global AI market grew from approximately <strong style={{ color: COLORS.accent }}>$58 billion in 2020</strong> to <strong style={{ color: COLORS.accent }}>$391 billion by 2025</strong> — a roughly <strong style={{ color: COLORS.accent }}>6.7× expansion in five years</strong>.
                  </p>
                  <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.8, margin: 0 }}>
                    ChatGPT's launch in November 2022 marked a civilizational inflection point. GenAI adoption by enterprises went from near-zero in 2022 to <strong style={{ color: COLORS.accent }}>71% by 2024</strong> (McKinsey). Big Tech cloud revenues have been supercharged, with Microsoft's AI business alone exceeding a <strong style={{ color: COLORS.accent }}>$13B annual run rate</strong> growing at 175% YoY.
                  </p>
                </div>
                <div>
                  <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.8, margin: "0 0 16px" }}>
                    However, the human cost has been severe. Since 2022, over <strong style={{ color: COLORS.red }}>666,000 tech employees</strong> have been laid off across ~3,500 companies, with AI cited increasingly as a direct driver — especially in 2025, where AI-first restructuring became the dominant rationale.
                  </p>
                  <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.8, margin: 0 }}>
                    The deepest paradox: <strong style={{ color: COLORS.gold }}>66% of people use AI regularly, yet only 46% trust it</strong> (KPMG/University of Melbourne, 2025). Public trust has actually declined since pre-ChatGPT levels, even as commercial deployment accelerates — creating a societal fault line that will define the 2026–2030 period.
                  </p>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Timeline of AI's Rise (2020–2026)" badge="Context">
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {[
                  { year: "2020", color: COLORS.muted, title: "Foundations & Pandemic Acceleration", desc: "AI adoption plateaus at ~50% of large organizations. Global market at $58B. COVID-19 accelerates digital transformation. Companies over-hire." },
                  { year: "2021", color: "#60a5fa", title: "Peak Investment & GPT-3 Era", desc: "Global private AI investment peaks at $93.5B. Adoption hits 56%. Big Tech begins massive R&D push. ChatGPT 's ancestor GPT-3 amazes developers." },
                  { year: "2022", color: COLORS.gold, title: "The Inflection: ChatGPT Arrives", desc: "November: ChatGPT launches. 37 countries pass AI laws. Private investment dips 26.7% to $91.9B. Market correction triggers 165K tech layoffs. GenAI enters consciousness." },
                  { year: "2023", color: COLORS.red, title: "The Layoff Wave & AI Gold Rush", desc: "264,000 tech workers laid off — peak since 2020. ChatGPT hits 100M users in 2 months (fastest ever). Enterprise AI jumps to 55%. Microsoft, Google invest billions in AI." },
                  { year: "2024", color: COLORS.green, title: "Mainstream Deployment", desc: "AI adoption surges to 78% (Stanford). GenAI used by 71% of organizations. Microsoft AI revenue surpasses $13B ARR. Google Cloud grows 48% YoY. 150K tech layoffs, AI now explicitly cited." },
                  { year: "2025", color: COLORS.accent, title: "AI-First Restructuring", desc: "AI market hits $391B. 246K tech layoffs, AI-first roles eliminate entire departments. Public trust falls to 46% despite 66% regular usage. Big Tech caps ex ≥ $380B combined for AI." },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 20, paddingBottom: 24, position: "relative" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 56 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: "50%",
                        background: `${item.color}22`, border: `2px solid ${item.color}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 10, fontWeight: 800, color: item.color, flexShrink: 0
                      }}>{item.year}</div>
                      {i < 5 && <div style={{ width: 2, flex: 1, background: COLORS.border, marginTop: 4 }} />}
                    </div>
                    <div style={{ paddingTop: 10, paddingBottom: 8 }}>
                      <p style={{ color: item.color, fontWeight: 700, fontSize: 14, margin: "0 0 6px" }}>{item.title}</p>
                      <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        )}

        {/* AI USAGE */}
        {activeTab === "adoption" && (
          <div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 32 }}>
              <StatBox label="Org Adoption (2024)" value="78%" sub="Stanford AI Index — up from 50% in 2020" color={COLORS.green} />
              <StatBox label="GenAI Adoption (2024)" value="71%" sub="McKinsey — up from 0% in 2021" color={COLORS.accent} />
              <StatBox label="AI Market (2025)" value="$391B" sub="Grand View Research" color={COLORS.gold} />
              <StatBox label="GenAI ROI" value="3.7×" sub="For every $1 invested · Multiple surveys" color={COLORS.purple} />
            </div>

            <SectionCard title="AI Adoption Rate (% of Organizations)" badge="Section 1 · AI Usage">
              <ResponsiveContainer width="100%" height={320}>
                <ComposedChart data={aiAdoptionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                  <XAxis dataKey="year" tick={{ fill: COLORS.muted, fontSize: 12 }} />
                  <YAxis tick={{ fill: COLORS.muted, fontSize: 12 }} unit="%" />
                  <Tooltip content={<CustomTooltip suffix="%" />} />
                  <Legend />
                  <Bar dataKey="orgAdoption" name="Any AI Adoption (%)" fill={COLORS.green} radius={[4, 4, 0, 0]} opacity={0.85} />
                  <Line dataKey="genAI" name="GenAI Specifically (%)" stroke={COLORS.accent} strokeWidth={2.5} dot={{ r: 4 }} type="monotone" />
                </ComposedChart>
              </ResponsiveContainer>
              <p style={{ color: COLORS.muted, fontSize: 11, marginTop: 8, textAlign: "right" }}>
                Sources: McKinsey State of AI 2020–2025 · Stanford AI Index 2025 · IBM Global AI Adoption Index 2023
              </p>
            </SectionCard>

            <SectionCard title="Global AI Market Size (USD Billion)" badge="Section 1 · Market Size">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={aiAdoptionData}>
                  <defs>
                    <linearGradient id="marketGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.accent} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={COLORS.accent} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                  <XAxis dataKey="year" tick={{ fill: COLORS.muted, fontSize: 12 }} />
                  <YAxis tick={{ fill: COLORS.muted, fontSize: 12 }} unit="B" />
                  <Tooltip content={<CustomTooltip suffix="B" />} />
                  <Area dataKey="marketSize" name="AI Market Size ($B)" stroke={COLORS.accent} fill="url(#marketGrad)" strokeWidth={2.5} dot={{ r: 4, fill: COLORS.accent }} />
                </AreaChart>
              </ResponsiveContainer>
              <p style={{ color: COLORS.muted, fontSize: 11, marginTop: 8, textAlign: "right" }}>
                Sources: Grand View Research · Fortune Business Insights · Statista · SEC Filings
              </p>
            </SectionCard>

            <SectionCard title="Key Adoption Insights" badge="Analysis">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div>
                  <InsightBullet text="ChatGPT reached 100 million users in January 2023 — the fastest adoption of any consumer internet application in history. (Source: multiple reports)" />
                  <InsightBullet text="By 2024, 78% of organizations report using AI in at least one business function, up from just 50% in 2020. (Stanford AI Index 2025)" />
                  <InsightBullet text="AI adoption grew fastest in China (+27 percentage points YoY in 2024), while North America leads overall at 82%. (McKinsey 2025)" />
                </div>
                <div>
                  <InsightBullet text="The ratio of experimental-to-production AI models dropped from 16:1 in early 2023 to 5:1 by March 2024, signaling real enterprise maturity. (Databricks)" />
                  <InsightBullet text="Companies now use AI in an average of 3 different functions, versus just 1–2 in early 2023. (McKinsey State of AI 2025)" />
                  <InsightBullet text="US Census Bureau data shows AI adoption among US firms doubled from 3.7% (fall 2023) to 9.7% (August 2025) at the firm-level measurement. (Anthropic Economic Index)" />
                </div>
              </div>
            </SectionCard>
          </div>
        )}

        {/* LAYOFFS */}
        {activeTab === "layoffs" && (
          <div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 32 }}>
              <StatBox label="Total Since 2022" value="666K+" sub="~3,500 companies · Layoffs.fyi" color={COLORS.red} />
              <StatBox label="Worst Year (2023)" value="264K" sub="65% of all cuts since 2022" color={COLORS.red} />
              <StatBox label="2025 Layoffs" value="246K" sub="AI-first restructuring dominant · TrueUp" color="#f97316" />
              <StatBox label="By 2030 (Forecast)" value="41%" sub="Employers plan workforce reduction via AI · WEF" color={COLORS.gold} />
            </div>

            <SectionCard title="Tech Sector Layoffs (Thousands of Workers)" badge="Section 2 · Layoffs">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={layoffsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                  <XAxis dataKey="year" tick={{ fill: COLORS.muted, fontSize: 12 }} />
                  <YAxis tick={{ fill: COLORS.muted, fontSize: 12 }} unit="K" />
                  <Tooltip content={<CustomTooltip suffix="K" />} />
                  <Legend />
                  <Bar dataKey="layoffs" name="Total Tech Layoffs (K)" fill={COLORS.red} radius={[4, 4, 0, 0]} opacity={0.8} />
                  <Bar dataKey="aiLinked" name="AI-Linked Layoffs (K, est.)" fill={COLORS.gold} radius={[4, 4, 0, 0]} opacity={0.85} />
                </BarChart>
              </ResponsiveContainer>
              <p style={{ color: COLORS.muted, fontSize: 11, marginTop: 8, textAlign: "right" }}>
                Sources: Crunchbase Tech Layoffs Tracker · Layoffs.fyi · TrueUp · TechCrunch 2025 List · RationalFX 2026 Report
              </p>
            </SectionCard>

            <SectionCard title="Notable AI-Driven Layoff Events (Selected)" badge="Case Studies">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { co: "Salesforce", n: "4,000", year: "2024–25", reason: "AI replaced customer support roles; CEO Benioff explicitly cited AI." },
                  { co: "Dropbox", n: "528", year: "Oct 2024", reason: "Refocused on AI-powered search; CEO cited building 'flatter team'." },
                  { co: "Klarna", n: "700", year: "2024", reason: "Replaced with AI chatbot. Irony: quality declined; rehiring started." },
                  { co: "Paycom", n: "500+", year: "Oct 2025", reason: "Payroll automation via AI; staff told roles were replaced by AI systems." },
                  { co: "Fiverr", n: "~250 (30%)", year: "Sep 2025", reason: "Repositioned as 'AI-first' company; tasks migrated to AI tools." },
                  { co: "Intel", n: "~34,000", year: "2025", reason: "Headcount reduction from 109K to 75K; AI infrastructure reorientation." },
                  { co: "HP", n: "6,000", year: "Nov 2025", reason: "AI-driven productivity integration across divisions." },
                  { co: "Citigroup", n: "~20,000 (target)", year: "2026 plan", reason: "AI-enabled middle-office automation; CFO confirmed plan." },
                ].map((item, i) => (
                  <div key={i} style={{
                    background: "#0d1626", borderRadius: 10, padding: "14px 16px",
                    border: `1px solid ${COLORS.border}`
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ color: COLORS.text, fontWeight: 700, fontSize: 14 }}>{item.co}</span>
                      <span style={{ color: COLORS.red, fontWeight: 700, fontSize: 13 }}>{item.n} jobs</span>
                    </div>
                    <p style={{ color: COLORS.muted, fontSize: 11.5, margin: "0 0 4px" }}>{item.year}</p>
                    <p style={{ color: "#94a3b8", fontSize: 12.5, margin: 0, lineHeight: 1.6 }}>{item.reason}</p>
                  </div>
                ))}
              </div>
              <p style={{ color: COLORS.muted, fontSize: 11, marginTop: 12, textAlign: "right" }}>
                Sources: TechCrunch · Programs.com AI Layoffs Tracker · CNBC · Network World · HBR · Computer Weekly
              </p>
            </SectionCard>

            <SectionCard title="Layoff Context: Not All AI's Fault" badge="Nuance">
              <InsightBullet text="The 2022–2023 layoff surge was primarily driven by pandemic-era overhiring correction. Bay Area companies added 74,700 tech jobs in 2020–22, then cut 80,200 in 2023–24. (Medium / Burning Glass Institute)" />
              <InsightBullet text="AI's impact on employment is real but nuanced: 'AI-exposed' workers saw unemployment rise 0.30 pts from 2022–2025, vs 0.94 pts for least-exposed workers. (Economic Innovation Group / Census Bureau)" />
              <InsightBullet text="A 'talent remix' is underway: companies are eliminating entry-level roles while senior-level hiring remains stable. Software developer employment is still projected to grow 17.9% from 2023 to 2033. (BLS)" />
              <InsightBullet text="The Klarna effect: Klarna replaced 700 reps with AI, then rehired humans after customer satisfaction fell. Amazon's AI-marketed Just Walk Out relied on 1,000 remote workers in India. (Forrester / HRExecutive)" />
            </SectionCard>
          </div>
        )}

        {/* REVENUE */}
        {activeTab === "revenue" && (
          <div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 32 }}>
              <StatBox label="Microsoft AI ARR (Jan 2025)" value="$13B" sub="Growing 175% YoY · SEC Filing" color={COLORS.accent} />
              <StatBox label="Google Cloud Q4 2025" value="+48%" sub="YoY growth · Gemini impact · CNN" color={COLORS.green} />
              <StatBox label="Azure AI Contribution" value="16 pts" sub="Of Azure's 33% YoY growth · Campaign US" color={COLORS.purple} />
              <StatBox label="Finance sector AI ROI" value="+20%+" sub="Revenue growth for 34% of finance firms · Survey" color={COLORS.gold} />
            </div>

            <SectionCard title="Big Tech Cloud Revenue ($B) — AI-Fueled Growth" badge="Section 3 · Revenue">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                  <XAxis dataKey="year" tick={{ fill: COLORS.muted, fontSize: 12 }} />
                  <YAxis tick={{ fill: COLORS.muted, fontSize: 12 }} unit="B" />
                  <Tooltip content={<CustomTooltip suffix="B" />} />
                  <Legend />
                  <Bar dataKey="msftCloud" name="Microsoft Cloud ($B)" fill={COLORS.accent} radius={[4, 4, 0, 0]} opacity={0.85} />
                  <Bar dataKey="googleCloud" name="Google Cloud ($B)" fill={COLORS.green} radius={[4, 4, 0, 0]} opacity={0.85} />
                  <Bar dataKey="awsCloud" name="AWS ($B)" fill={COLORS.gold} radius={[4, 4, 0, 0]} opacity={0.85} />
                </BarChart>
              </ResponsiveContainer>
              <p style={{ color: COLORS.muted, fontSize: 11, marginTop: 8, textAlign: "right" }}>
                Sources: SEC Filings (Microsoft, Alphabet, Amazon) · CNBC Earnings Coverage · Campaign US · CFO Dive
              </p>
            </SectionCard>

            <SectionCard title="Revenue Impact by Sector (2024–2025)" badge="Sector Analysis">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                {[
                  { sector: "Financial Services", color: COLORS.gold, stats: ["34% of firms saw >20% revenue boost from AI", "51% saw >10% revenue growth", "GenAI fintech market: $0.85B (2022) → $9.48B by 2032 at 28.1% CAGR", "JP Morgan, Goldman deploying AI in trading & compliance"] },
                  { sector: "Healthcare", color: COLORS.green, stats: ["AI healthcare market: $15.4B, growing at 37.5% CAGR (2023–2030)", "Diagnostic AI reducing errors; operational efficiency gains", "Drug discovery timelines compressed by AI pipelines", "Telemedicine + AI hybrid models generating new revenue streams"] },
                  { sector: "Retail & E-Commerce", color: COLORS.purple, stats: ["Retailers saw 15% higher conversion rates using AI chatbots (Black Friday)", "AI retail market expected to reach $45.74B by 2032 at 18.45% CAGR", "Amazon integrates AI across logistics, search, and Alexa ecosystem", "Personalization engines directly linked to basket size increases"] },
                  { sector: "Cloud & Tech", color: COLORS.accent, stats: ["Microsoft AI ARR: $13B, growing 175% YoY (Jan 2025)", "Azure AI now contributes 16 of 33 percentage points of Azure growth", "Google Cloud Q4 2025: $17.7B, up 48% YoY", "AWS: $33B in Q3 2025, +20% YoY"] },
                  { sector: "Manufacturing", color: "#f97316", stats: ["AI expected to add $3.78 trillion to manufacturing by 2035", "77% of manufacturers have implemented AI (up from 70% in 2023)", "Supply chain and predictive maintenance driving biggest ROI", "Market: $1.4B in 2020 → $14.3B projected by 2027 (33.2% CAGR)"] },
                  { sector: "Telecom", color: "#a78bfa", stats: ["Global AI in telecom: $1.45B (2022), growing at 18.2% CAGR through 2030", "52% of telecom firms deployed AI-powered chatbots", "AI-RAN Alliance launched Feb 2024 to merge AI with cellular infrastructure", "Customer analytics (28% of revenue) is the leading AI application"] },
                ].map((item, i) => (
                  <div key={i} style={{
                    background: "#0d1626", borderRadius: 12, padding: 18,
                    border: `1px solid ${COLORS.border}`
                  }}>
                    <p style={{ color: item.color, fontWeight: 700, fontSize: 13, margin: "0 0 12px", borderBottom: `1px solid ${item.color}30`, paddingBottom: 8 }}>{item.sector}</p>
                    {item.stats.map((s, j) => (
                      <p key={j} style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.6, margin: "0 0 6px" }}>· {s}</p>
                    ))}
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Key Revenue Insights" badge="Analysis">
              <InsightBullet text="McKinsey 2025: 39% of respondents attribute any EBIT improvement to AI. Of those who see qualitative gains, nearly half report improved customer satisfaction and competitive differentiation." />
              <InsightBullet text="Companies getting a 3.7× ROI for every dollar invested in GenAI and related technologies (multiple surveys compiled by Coherent Solutions, 2025)." />
              <InsightBullet text="Microsoft's revenue grew 18% YoY to $77.7B in Q3 FY2025, with AI being the named primary driver alongside cloud. Azure AI reaccelerated from 35% to 39% YoY growth. (SEC Filing)" />
              <InsightBullet text="Goldman Sachs projects AI to boost global GDP by 15% over the next decade. JP Morgan estimates a more conservative 8–9%. (Multiple analyst reports)" />
            </SectionCard>
          </div>
        )}

        {/* TRUST */}
        {activeTab === "trust" && (
          <div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 32 }}>
              <StatBox label="AI Trust (Global, 2025)" value="46%" sub="Despite 66% regular usage · KPMG/UoM" color={COLORS.red} />
              <StatBox label="Job Loss Fear (2024)" value="59%" sub="Declined to 57% by 2025 · Attest" color={COLORS.gold} />
              <StatBox label="Data Trust Growth" value="29→33%" sub="2024 to 2025 · Attest Consumer Report" color={COLORS.green} />
              <StatBox label="Want Human Oversight" value="82%" sub="In AI critical decisions · KPMG GenAI Survey 2024" color={COLORS.purple} />
            </div>

            <SectionCard title="Customer Trust vs. AI Optimism vs. Job Fear (2020–2025)" badge="Section 4 · Customer Satisfaction">
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={trustData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                  <XAxis dataKey="year" tick={{ fill: COLORS.muted, fontSize: 12 }} />
                  <YAxis tick={{ fill: COLORS.muted, fontSize: 12 }} unit="%" domain={[0, 80]} />
                  <Tooltip content={<CustomTooltip suffix="%" />} />
                  <Legend />
                  <Line dataKey="trust" name="Willing to Trust AI (%)" stroke={COLORS.accent} strokeWidth={2.5} dot={{ r: 4 }} type="monotone" />
                  <Line dataKey="optimism" name="AI Optimism (%)" stroke={COLORS.green} strokeWidth={2.5} dot={{ r: 4 }} type="monotone" />
                  <Line dataKey="jobFear" name="Fear Job Loss to AI (%)" stroke={COLORS.red} strokeWidth={2.5} dot={{ r: 4 }} strokeDasharray="5 3" type="monotone" />
                  <Line dataKey="dataTrust" name="Trust AI Data Use (%)" stroke={COLORS.gold} strokeWidth={2} dot={{ r: 3 }} type="monotone" />
                </LineChart>
              </ResponsiveContainer>
              <p style={{ color: COLORS.muted, fontSize: 11, marginTop: 8, textAlign: "right" }}>
                Sources: KPMG/University of Melbourne Global AI Trust Study 2025 (48,340 respondents, 47 countries) · Attest Consumer AI Adoption Report 2025 · PwC Voice of Consumer 2024
              </p>
            </SectionCard>

            <SectionCard title="The Trust Paradox" badge="Key Finding">
              <div style={{
                background: "linear-gradient(135deg, rgba(255,75,75,0.1), rgba(0,212,255,0.05))",
                border: "1px solid rgba(255,75,75,0.25)", borderRadius: 12, padding: 24, marginBottom: 24
              }}>
                <p style={{ color: COLORS.red, fontWeight: 800, fontSize: 16, margin: "0 0 8px" }}>⚠ The Core Tension</p>
                <p style={{ color: "#e2e8f0", fontSize: 14, lineHeight: 1.75, margin: 0 }}>
                  According to the most comprehensive global trust study to date — conducted by the University of Melbourne and KPMG across <strong>48,340 people in 47 countries (Nov 2024 – Jan 2025)</strong> — <strong style={{ color: COLORS.red }}>66% of people use AI intentionally and regularly, yet only 46% are willing to trust it.</strong> Crucially, public trust has <em>declined</em> since before ChatGPT launched in 2022. The more people use AI, the less they trust the companies deploying it.
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div>
                  <p style={{ color: COLORS.gold, fontWeight: 700, fontSize: 13, margin: "0 0 12px" }}>What Consumers Demand</p>
                  <InsightBullet text="82% demand human oversight in AI decision-making processes, especially for critical decisions. (KPMG GenAI Consumer Trust Survey 2024)" />
                  <InsightBullet text="81% want data privacy through robust anonymization and 81% want clear AI-content disclosures (watermarks). (KPMG 2024)" />
                  <InsightBullet text="80% want ethical frameworks publicly established before AI is deployed. (KPMG 2024)" />
                </div>
                <div>
                  <p style={{ color: COLORS.green, fontWeight: 700, fontSize: 13, margin: "0 0 12px" }}>Trust Is Slowly Recovering</p>
                  <InsightBullet text="Data trust in AI companies grew from 29% (2024) to 33% (2025). Trust in AI-provided information grew from 40% to 43%. (Attest 2025)" />
                  <InsightBullet text="Younger consumers (18–30) trust AI companies at 37% vs. 27% for 50+ year olds — future trajectory is more favorable. (Attest 2025)" />
                  <InsightBullet text="50% of consumers now trust AI for product recommendations — a figure expected to climb with familiarity. (PwC Voice of Consumer 2024)" />
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Sector-Level Customer Response" badge="Industry View">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                {[
                  { label: "McKinsey 2025", color: COLORS.green, val: "Nearly half of AI-adopting organizations report improved customer satisfaction as a measured outcome." },
                  { label: "Salesforce Research 2024", color: COLORS.red, val: "Consumer trust in companies is at a record low overall — AI is raising the stakes further, not lowering them." },
                  { label: "Retail (Attest 2025)", color: COLORS.purple, val: "31% believe AI will provide better customer experience (+4 pts YoY), and 29% expect better personalization." },
                  { label: "Deloitte Retail 2025", color: COLORS.gold, val: "AI chatbots drove 15% higher conversion rates during Black Friday 2024 — direct ROI from customer satisfaction tools." },
                  { label: "Unilever (PwC 2024)", color: COLORS.accent, val: "'I am amazed at the receptivity to AI from Jan 2023 to today.' Senior VP notes AI is increasingly seen as an amplifier, not a threat, by consumers." },
                  { label: "Job Loss Concern", color: "#f97316", val: "57% of consumers still fear job losses from AI (down from 59% in 2024). Concern declining but still majority sentiment." },
                ].map((item, i) => (
                  <div key={i} style={{
                    background: "#0d1626", borderRadius: 10, padding: 16,
                    border: `1px solid ${COLORS.border}`
                  }}>
                    <p style={{ color: item.color, fontWeight: 700, fontSize: 12, margin: "0 0 8px" }}>{item.label}</p>
                    <p style={{ color: "#94a3b8", fontSize: 12.5, lineHeight: 1.65, margin: 0 }}>{item.val}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        )}

        {/* PROJECTIONS */}
        {activeTab === "projection" && (
          <div>
            <div style={{
              background: "linear-gradient(135deg, rgba(0,212,255,0.08), rgba(167,139,250,0.08))",
              border: `1px solid rgba(0,212,255,0.2)`, borderRadius: 16,
              padding: 24, marginBottom: 32
            }}>
              <p style={{ color: COLORS.accent, fontWeight: 700, fontSize: 13, margin: "0 0 8px" }}>
                📌 Analyst Note on Projections
              </p>
              <p style={{ color: "#94a3b8", fontSize: 13.5, lineHeight: 1.75, margin: 0 }}>
                Projections below are grounded in trajectories from McKinsey, Grand View Research, Statista, Fortune Business Insights, Goldman Sachs, World Economic Forum, and ABI Research. Market size projections use a 27.7% CAGR (Statista) as the conservative anchor. Trust recovery assumes regulatory maturation (EU AI Act in force, US AI policy momentum). Layoff projections assume AI productivity gains partially offset by new AI-adjacent hiring. All figures should be treated as directionally informed estimates, not certainties.
              </p>
            </div>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 32 }}>
              <StatBox label="AI Market by 2030" value="$827B+" sub="Statista · 27.7% CAGR · Conservative" color={COLORS.accent} />
              <StatBox label="Org AI Adoption (2030)" value="95%+" sub="Near-universal adoption projected" color={COLORS.green} />
              <StatBox label="GDP Contribution by 2030" value="$15.7T" sub="Added to global economy · PwC" color={COLORS.gold} />
              <StatBox label="Public AI Trust (2030)" value="~65%" sub="If regulation matures · Analyst estimate" color={COLORS.purple} />
            </div>

            <SectionCard title="AI Market Size Projection (2026–2030)" badge="Section 5 · Projections">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={projectionData}>
                  <defs>
                    <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.purple} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={COLORS.purple} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                  <XAxis dataKey="year" tick={{ fill: COLORS.muted, fontSize: 12 }} />
                  <YAxis tick={{ fill: COLORS.muted, fontSize: 12 }} unit="B" />
                  <Tooltip content={<CustomTooltip suffix="B" />} />
                  <Area dataKey="marketSize" name="Projected AI Market ($B)" stroke={COLORS.purple} fill="url(#projGrad)" strokeWidth={2.5} dot={{ r: 4, fill: COLORS.purple }} />
                </AreaChart>
              </ResponsiveContainer>
              <p style={{ color: COLORS.muted, fontSize: 11, marginTop: 8, textAlign: "right" }}>
                Sources: Statista (27.7% CAGR) · Grand View Research · Fortune Business Insights · ABI Research
              </p>
            </SectionCard>

            <SectionCard title="Adoption, Trust & Layoff Projections (2026–2030)" badge="Multi-Metric Outlook">
              <ResponsiveContainer width="100%" height={320}>
                <ComposedChart data={projectionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                  <XAxis dataKey="year" tick={{ fill: COLORS.muted, fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fill: COLORS.muted, fontSize: 12 }} unit="%" />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: COLORS.muted, fontSize: 12 }} unit="K" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" dataKey="adoption" name="AI Adoption (%)" stroke={COLORS.green} strokeWidth={2.5} dot={{ r: 4 }} type="monotone" />
                  <Line yAxisId="left" dataKey="trust" name="Public AI Trust (%)" stroke={COLORS.accent} strokeWidth={2.5} dot={{ r: 4 }} type="monotone" />
                  <Bar yAxisId="right" dataKey="layoffs" name="Est. Tech Layoffs (K)" fill={COLORS.red} radius={[4, 4, 0, 0]} opacity={0.6} />
                </ComposedChart>
              </ResponsiveContainer>
            </SectionCard>

            <SectionCard title="Projected Scenarios by Theme (2026–2030)" badge="Thematic Outlook">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {[
                  {
                    theme: "AI Usage & Adoption",
                    color: COLORS.green,
                    icon: "📈",
                    points: [
                      "2026: ~84% organizational adoption. Agentic AI (multi-step, autonomous AI) becomes standard enterprise tooling.",
                      "2027–28: Near-universal adoption (90%+) in knowledge work. Physical AI (robotics) begins meaningful expansion.",
                      "2029–30: ~95% of organizations use AI. AI models shift from tools to colleagues — 'digital coworkers' normalized.",
                      "GenAI adoption expected to grow at 34.5% CAGR through 2030. (ABI Research)"
                    ]
                  },
                  {
                    theme: "Workforce & Layoffs",
                    color: COLORS.red,
                    icon: "🏭",
                    points: [
                      "41% of employers globally plan workforce reduction via AI automation by 2030. (WEF Future of Jobs 2025)",
                      "Layoffs will shift from tech to traditional industries: finance, logistics, healthcare admin.",
                      "New AI roles will absorb some displacement: AI trainers, prompt engineers, AI auditors, AI policy leads.",
                      "Entry-level disruption is structural. Burning Glass Institute: share of jobs requiring ≤3 yrs experience dropped from 43% to 28% in software dev (2018–2024)."
                    ]
                  },
                  {
                    theme: "Revenue & Market",
                    color: COLORS.gold,
                    icon: "💰",
                    points: [
                      "AI market projected: $540B (2026) → $820B (2027) → $1.1T (2028) → $1.85T (2030) at 27.7% CAGR.",
                      "Microsoft targeting $25B in AI revenue by end of FY26. Google Cloud set to cross $80B+ by 2027.",
                      "Generative AI segment alone expected to grow 887% from 2024 to 2030 to reach ~$320B+.",
                      "Goldman Sachs: AI to add 15% to global GDP over the next decade, equivalent to $7–8 trillion annually."
                    ]
                  },
                  {
                    theme: "Customer Trust & Satisfaction",
                    color: COLORS.accent,
                    icon: "🤝",
                    points: [
                      "Trust will improve IF regulation matures: EU AI Act (in force), US federal AI policy, and global standards.",
                      "By 2028: expect trust to cross 55% if companies publish 'Trusted AI Progress Reports' as KPMG recommends.",
                      "By 2030: trust could reach 65% with normalized XAI (Explainable AI) — market reaching $21B by 2030.",
                      "Gen Z — the most AI-fluent generation — will become the dominant workforce and consumer base by 2028, shifting sentiment favorably."
                    ]
                  }
                ].map((item, i) => (
                  <div key={i} style={{
                    background: "#0d1626", borderRadius: 14, padding: 22,
                    border: `1px solid ${item.color}33`
                  }}>
                    <p style={{ color: item.color, fontWeight: 800, fontSize: 15, margin: "0 0 14px" }}>
                      {item.icon} {item.theme}
                    </p>
                    {item.points.map((p, j) => (
                      <div key={j} style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "flex-start" }}>
                        <span style={{ color: item.color, fontSize: 14, marginTop: 2 }}>›</span>
                        <p style={{ color: "#94a3b8", fontSize: 12.5, lineHeight: 1.65, margin: 0 }}>{p}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Analyst's Closing Assessment" badge="Conclusion">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
                <div>
                  <p style={{ color: COLORS.gold, fontWeight: 700, fontSize: 13, margin: "0 0 12px" }}>The Bull Case (Base Scenario)</p>
                  <p style={{ color: "#94a3b8", fontSize: 13.5, lineHeight: 1.8, margin: 0 }}>
                    AI continues compounding at 25–30% annually. Regulatory clarity (especially the EU AI Act and US Executive AI Orders) stabilizes public trust. New job categories absorb displaced workers faster than feared. Companies that deploy AI responsibly — with human oversight, transparency, and reskilling programs — emerge as dominant players. By 2030, AI is the primary driver of every major economy's productivity growth.
                  </p>
                </div>
                <div>
                  <p style={{ color: COLORS.red, fontWeight: 700, fontSize: 13, margin: "0 0 12px" }}>The Risk Case</p>
                  <p style={{ color: "#94a3b8", fontSize: 13.5, lineHeight: 1.8, margin: 0 }}>
                    Trust continues to erode. Entry-level job destruction outpaces new role creation. Regulatory fragmentation creates compliance moats that favor incumbents. AI productivity gains flow primarily to capital, not labor, widening inequality. Countries with strong AI ecosystems (US, China) pull further ahead, creating geopolitical AI nationalism. The "AI-washing" phenomenon — companies citing AI for layoffs that are economically motivated — damages the technology's reputation. Public backlash leads to restrictive policy overcorrection.
                  </p>
                </div>
              </div>
            </SectionCard>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 40px 0", borderTop: `1px solid ${COLORS.border}`, marginTop: 32 }}>
        <p style={{ color: "#374151", fontSize: 11.5, lineHeight: 1.8, margin: 0 }}>
          <strong style={{ color: COLORS.muted }}>Data Sources:</strong> McKinsey State of AI (2020–2025) · Stanford AI Index 2025 · IBM Global AI Adoption Index 2023 · KPMG/University of Melbourne AI Trust Study 2025 (48,340 respondents, 47 countries) · KPMG GenAI Consumer Trust Survey 2024 · Attest Consumer Adoption of AI 2025 · PwC Voice of Consumer 2024 · Salesforce State of the AI Connected Customer 2024 · Grand View Research AI Market 2025 · Fortune Business Insights AI Market · ABI Research AI Software Market · Statista AI Market Size 2024–2031 · Crunchbase Tech Layoffs Tracker · Layoffs.fyi · TrueUp Layoffs Tracker · TechCrunch 2025 Tech Layoffs List · Programs.com AI Layoffs Tracker · RationalFX 2026 Tech Layoffs Report · Network World 2025 · Computer Weekly · CNBC Earnings · SEC Filings (Microsoft, Alphabet) · Databricks State of AI Enterprise · US Census Bureau Business Trends & Outlook Survey · Anthropic Economic Index (September 2025) · World Economic Forum Future of Jobs 2025 · Goldman Sachs AI GDP Report · Burning Glass Institute · Economic Innovation Group · HRExecutive / Forrester 2025.
        </p>
      </div>
    </div>
  );
}
