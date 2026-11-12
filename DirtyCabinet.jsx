import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Search, Mail, ArrowUpRight, CheckCircle2, MessageSquare, ShieldCheck, X,
  ThumbsUp, Eye, Clock, Thermometer, Package, FileCheck2, Plus, Star,
  Globe2, Building2, Ship, Factory, ChevronRight, Lock, FileText, Filter,
} from "lucide-react";

/* ============================================================
   DIRTY CABINET — B2B intelligence magazine + lead platform
   Palette: parchment #F7F5F0 · charcoal #1A1A1A · rule #E5E2DC
            dossier red #9B2C1F (used sparingly: tags, stamps)
   Type:    Bodoni Moda (masthead/headlines) · Instrument Sans (body)
            IBM Plex Mono (data, labels, file numbers)
   ============================================================ */

const FONT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Instrument+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
.f-display{font-family:'Bodoni Moda',Didot,'Times New Roman',Georgia,serif}
.f-sans{font-family:'Instrument Sans',ui-sans-serif,system-ui,-apple-system,'Segoe UI',sans-serif}
.f-mono{font-family:'IBM Plex Mono',ui-monospace,SFMono-Regular,Menlo,monospace}
.balance{text-wrap:balance}
.grain::after{content:"";position:absolute;inset:0;pointer-events:none;opacity:.42;mix-blend-mode:multiply;
background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{scrollbar-width:none}
@keyframes dcIn{from{opacity:.0;transform:translateY(8px)}to{opacity:1;transform:none}}
.dc-in{animation:dcIn .28s ease-out both}
@media (prefers-reduced-motion:reduce){.dc-in{animation:none}*{transition:none!important}}
`;

const CATS = {
  BRANDS: { label: "Brands", sub: "Underdog Spotlight & Formulation Teardowns", icon: Factory },
  TRENDS: { label: "Trends", sub: "Market Data & Regulatory Shifts", icon: Globe2 },
  JOURNAL: { label: "Consumer Review Journal", sub: "Field Reviews & Buyer Feedback", icon: MessageSquare },
};

/* ---------- Monochrome "photo" plates (no external images needed) ---------- */
const MOTIFS = {
  containers:
    "repeating-linear-gradient(90deg,#2a2a2a 0 22px,#3d3d3d 22px 24px,#1f1f1f 24px 46px,#4a4a4a 46px 48px),linear-gradient(180deg,#bdbab3 0%,#6f6c66 38%,#1b1b1b 100%)",
  lab:
    "radial-gradient(circle at 30% 40%,#e8e5df 0 9%,transparent 10%),radial-gradient(circle at 62% 55%,#d2cfc8 0 14%,transparent 15%),radial-gradient(circle at 80% 30%,#9d9a94 0 6%,transparent 7%),linear-gradient(160deg,#5b5953,#141414)",
  desert:
    "linear-gradient(180deg,#e9e6df 0%,#c9c5bd 46%,#3a3835 47%,#7a766f 60%,#222 100%)",
  grid:
    "repeating-linear-gradient(0deg,transparent 0 31px,#ffffff22 31px 32px),repeating-linear-gradient(90deg,transparent 0 31px,#ffffff22 31px 32px),linear-gradient(135deg,#3b3b3b,#0f0f0f)",
  tubes:
    "repeating-linear-gradient(100deg,#151515 0 30px,#cfcbc4 30px 34px,#6e6b66 34px 70px,#e7e4dd 70px 72px),linear-gradient(#000,#000)",
  clinic:
    "linear-gradient(90deg,transparent 0 48%,#1a1a1a 48% 52%,transparent 52%),linear-gradient(180deg,#f0eee9 0%,#a8a59e 60%,#3b3a37 100%)",
  crates:
    "repeating-linear-gradient(45deg,#2b2b2b 0 14px,#3a3a3a 14px 28px),radial-gradient(ellipse at 50% 120%,#000 30%,transparent 70%)",
  sun:
    "radial-gradient(circle at 70% 28%,#fbfaf7 0 12%,#d9d5cd 13% 20%,transparent 21%),linear-gradient(180deg,#bab6ae 0%,#57544f 70%,#141414 100%)",
};

function Plate({ motif = "grid", caption, className = "", children }) {
  return (
    <div
      className={`grain relative overflow-hidden bg-[#1A1A1A] ${className}`}
      style={{ backgroundImage: MOTIFS[motif], filter: "grayscale(1) contrast(1.15)" }}
      role="img"
      aria-label={caption || "Editorial photograph placeholder"}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,.55)_100%)]" />
      {children}
      {caption && (
        <span className="f-mono absolute bottom-2 left-3 z-10 text-[10px] uppercase tracking-[.14em] text-white/70">
          {caption}
        </span>
      )}
    </div>
  );
}

/* ---------- Placeholder editorial data ---------- */
const HERO = {
  cat: "TRENDS",
  kicker: "Cover Story · Regulatory Shifts",
  title: "The Anatomy of a Middle East Customs Rejection: What Regulators Won't Tell You",
  author: "Hana Seo",
  role: "Trade Desk Editor",
  read: "14 min read",
  file: "FILE NO. DC-047-01",
  excerpt:
    "A pallet of Korean barrier creams sat 19 days at a Gulf port before it was turned back. The paperwork was complete. The product was safe. The problem was a single line of Arabic on the outer carton. We traced the rejection from the exporter's desk to the inspection bay, and mapped the five failure points that brands keep repeating.",
  stats: [
    { k: "19", v: "days held at port" },
    { k: "5", v: "repeat failure points" },
    { k: "1", v: "missing carton line" },
  ],
};

const ARTICLES = [
  { id: 1, cat: "BRANDS", tag: "Underdog Spotlight", motif: "lab", plate: "Jeju · R&D bench",
    title: "The Jeju Lab That Out-Formulated a Conglomerate",
    snippet: "Eleven chemists, one volcanic-water licence, and a ceramide ratio the big houses are now quietly reverse-engineering.",
    author: "Min-jae Kwon", read: 9, views: 18420 },
  { id: 2, cat: "BRANDS", tag: "Formulation Teardown", motif: "tubes", plate: "Riyadh · Bonded warehouse",
    title: "Teardown: Why One Cica Cream Survived a 48°C Warehouse Summer",
    snippet: "Emulsifier choice, headspace, and an aluminium-laminate tube. We break down the spec sheet line by line.",
    author: "Dr. Yuna Park", read: 12, views: 22105 },
  { id: 3, cat: "BRANDS", tag: "OEM / ODM", motif: "crates", plate: "Gyeonggi · Filling line 4",
    title: "Private Label, Public Problems: Inside a Gyeonggi OEM Floor",
    snippet: "Minimum order quantities, shared moulds and batch-record gaps. What overseas buyers should audit before they sign.",
    author: "Daniel Cho", read: 8, views: 9310 },
  { id: 4, cat: "TRENDS", tag: "Regulatory", motif: "desert", plate: "Gulf corridor · Inbound",
    title: "Halal Claims on Cosmetics: The Questions GCC Importers Ask First",
    snippet: "Certification body, ingredient origin, and alcohol content declarations. A buyer-side checklist from three distributors.",
    author: "Hana Seo", read: 10, views: 15880 },
  { id: 5, cat: "TRENDS", tag: "US Market", motif: "containers", plate: "Long Beach · Terminal yard",
    title: "MoCRA in Practice: What US Importers Are Actually Requesting",
    snippet: "Facility registration, product listing and adverse-event contacts. The documents that now arrive before the purchase order.",
    author: "Grace Lim", read: 11, views: 20412 },
  { id: 6, cat: "TRENDS", tag: "Healthcare BD", motif: "clinic", plate: "Seongnam · Delegation visit",
    title: "Field Report: Yugnecare's Two Days of Korean Health-Tech",
    snippet: "Yugnecare's leadership spent 21-22 September in Seoul with K&S UNCLES, from PIXELRO's vision-health headquarters to a Seongnam senior-care centre. What the delegation came to see.",
    author: "K&S UNCLES · BD Desk", read: 7, views: 12764 },
  { id: 7, cat: "JOURNAL", tag: "Field Log", motif: "sun", plate: "Dubai · Rooftop test",
    title: "Field Log: 30 Days of Korean Sunscreen in a Dubai Summer",
    snippet: "Six SPF50+ formulas, one rooftop, daily texture notes. Which ones separated, which ones pilled, which ones held.",
    author: "Buyer Panel · UAE", read: 6, views: 31002 },
  { id: 8, cat: "JOURNAL", tag: "Packaging", motif: "crates", plate: "Jeddah · Receiving dock",
    title: "Buyer Panel: Packaging That Cracked Before It Cleared Customs",
    snippet: "Pump heads, airless bottles and shrink-wrap. Twelve importers photograph what arrived damaged and why.",
    author: "Buyer Panel · KSA", read: 5, views: 8843 },
  { id: 9, cat: "JOURNAL", tag: "Clinic Buyers", motif: "grid", plate: "Los Angeles · Med-spa",
    title: "Verified Clinic Buyers Rate Post-Procedure Recovery Kits",
    snippet: "Dermatology clinics in the US and Gulf score Korean recovery kits on tolerance, labeling and reorder reliability.",
    author: "Buyer Panel · US", read: 7, views: 10556 },
];

const SEED_REVIEWS = [
  { id: "r1", product: "Centella Barrier Cream 50ml", brand: "Mossline Lab", reviewer: "Omar A.", role: "Pharmacy Chain Buyer",
    region: "Riyadh, KSA", verified: true, rating: 5, focus: "Climate", date: "2026-10-28",
    scores: { climate: 5, packaging: 4, compliance: 5 },
    body: "Held texture after 6 weeks in a non-AC storeroom (peaked at 46°C). No separation. Arabic back label was correct on the first shipment, which is rare.",
    votes: 142 },
  { id: "r2", product: "Airless Vitamin C Serum 30ml", brand: "Hanbit Derma", reviewer: "Sarah K.", role: "Distributor, Beauty Retail",
    region: "Dubai, UAE", verified: true, rating: 3, focus: "Packaging", date: "2026-10-21",
    scores: { climate: 3, packaging: 2, compliance: 4 },
    body: "Formula is good. The airless pump failed on roughly 1 in 40 units after sea freight. Supplier replaced them, but we now ask for drop-test data upfront.",
    votes: 97 },
  { id: "r3", product: "SPF50+ Daily Fluid", brand: "Sorae Skin", reviewer: "Jason M.", role: "Amazon Seller, Skincare",
    region: "Texas, USA", verified: true, rating: 4, focus: "Compliance", date: "2026-10-14",
    scores: { climate: 4, packaging: 5, compliance: 3 },
    body: "Great consumer feedback, but the US version needed an OTC drug facts panel. Budget an extra 8 weeks if your brand partner hasn't done US sunscreen before.",
    votes: 88 },
  { id: "r4", product: "Post-Laser Recovery Mask (10 pack)", brand: "Cliniq Seoul", reviewer: "Dr. Leila H.", role: "Dermatology Clinic Owner",
    region: "Doha, Qatar", verified: true, rating: 5, focus: "Efficacy", date: "2026-10-03",
    scores: { climate: 4, packaging: 5, compliance: 5 },
    body: "Patients tolerate it well right after procedures. Ingredient list was shared in English and Arabic before ordering, which made our internal review fast.",
    votes: 64 },
  { id: "r5", product: "Snail Mucin Essence 100ml", brand: "Gomgom", reviewer: "Anonymous", role: "Community member",
    region: "Toronto, Canada", verified: false, rating: 4, focus: "Efficacy", date: "2026-09-29",
    scores: { climate: 4, packaging: 4, compliance: 4 },
    body: "Bought retail, not wholesale. Consistent batch to batch over three bottles. Cap is flimsy for travel.",
    votes: 21 },
  { id: "r6", product: "Mugwort Clay Mask 120g", brand: "Seonbi Botanics", reviewer: "Priya N.", role: "Spa Group Procurement",
    region: "Mumbai, India", verified: true, rating: 2, focus: "Climate", date: "2026-09-18",
    scores: { climate: 2, packaging: 3, compliance: 4 },
    body: "Dried out in the jar during monsoon-season transit. Humidity got past the inner seal. Brand is reformulating the liner.",
    votes: 45 },
];

const FREE_MAIL = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "naver.com", "icloud.com", "daum.net"];
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const isFreeMail = (v) => FREE_MAIL.includes(v.trim().split("@")[1]?.toLowerCase());
const fmt = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`);
// shortcut: 서버 없이 방문자 메일 앱으로 보냄, 메일 앱이 없거나 내용이 아주 길면 안 열림. 문의가 늘면 폼 서비스로
const mailDesk = (subject, lines) => {
  window.location.href = `mailto:unclescoslab@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
};

/* ---------- Small UI atoms ---------- */
function Tag({ children, tone = "red" }) {
  const t = tone === "red" ? "text-[#9B2C1F] border-[#9B2C1F]/40" : "text-[#1A1A1A] border-[#1A1A1A]/30";
  return <span className={`f-mono inline-block border px-1.5 py-0.5 text-[10px] uppercase tracking-[.14em] ${t}`}>{children}</span>;
}

function Field({ label, id, children, hint }) {
  return (
    <label htmlFor={id} className="block">
      <span className="f-mono mb-1.5 block text-[10px] uppercase tracking-[.16em] text-[#1A1A1A]/60">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-[#9B2C1F]">{hint}</span>}
    </label>
  );
}
const inputCls =
  "w-full border border-[#D9D5CC] bg-white px-3 py-2.5 text-[15px] text-[#1A1A1A] outline-none transition placeholder:text-[#1A1A1A]/35 focus:border-[#1A1A1A] focus:ring-1 focus:ring-[#1A1A1A]";

function Stars({ value, onChange, size = 14 }) {
  return (
    <div className="flex gap-0.5" role={onChange ? "radiogroup" : undefined} aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n} type="button" disabled={!onChange}
          onClick={() => onChange && onChange(n)}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          className={onChange ? "cursor-pointer p-0.5 focus-visible:outline focus-visible:outline-1" : "cursor-default"}
        >
          <Star size={size} strokeWidth={1.5} className={n <= value ? "fill-[#1A1A1A] text-[#1A1A1A]" : "text-[#1A1A1A]/25"} />
        </button>
      ))}
    </div>
  );
}

function Modal({ open, onClose, children, label, wide }) {
  useEffect(() => {
    if (!open) return;
    const k = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = prev; };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label={label}>
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-[#1A1A1A]/60 backdrop-blur-[2px]" />
      <div className={`dc-in relative max-h-[92vh] w-full overflow-y-auto border border-[#1A1A1A] bg-[#F7F5F0] shadow-[0_30px_80px_-20px_rgba(0,0,0,.5)] ${wide ? "sm:max-w-2xl" : "sm:max-w-lg"}`}>
        <button onClick={onClose} aria-label="Close dialog" className="absolute right-3 top-3 z-10 p-2 text-[#1A1A1A] hover:bg-[#1A1A1A]/5">
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}

/* ============================================================ */
export default function DirtyCabinet() {
  const [filter, setFilter] = useState("ALL");
  const [inquireOpen, setInquireOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const gridRef = useRef(null);
  const journalRef = useRef(null);
  const leadRef = useRef(null);

  const today = useMemo(
    () => new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }),
    []
  );

  const toastTimer = useRef(null);
  const flash = (msg) => { setToast(msg); window.clearTimeout(toastTimer.current); toastTimer.current = window.setTimeout(() => setToast(null), 2600); };
  const goTo = (ref) => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const pickCategory = (c) => {
    setFilter(c);
    if (c === "JOURNAL") goTo(journalRef); else goTo(gridRef);
  };

  return (
    <div className="f-sans min-h-screen bg-[#F7F5F0] text-[#1A1A1A] antialiased">
      <style>{FONT_CSS}</style>

      {/* ---------------- Utility bar ---------------- */}
      <div className="border-b border-[#E5E2DC]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 sm:px-6">
          <div className="f-mono flex items-center gap-3 text-[10px] uppercase tracking-[.16em] text-[#1A1A1A]/60">
            <span className="hidden sm:inline">{today}</span>
            <span className="hidden h-3 w-px bg-[#E5E2DC] sm:inline-block" />
            <span>Issue No. 047</span>
            <span className="hidden md:inline">· Seoul / Dubai / Los Angeles</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <button onClick={() => goTo(leadRef)} className="hover:underline underline-offset-4">Subscribe</button>
            <button onClick={() => flash("Member log-in opens with the next issue.")} className="hover:underline underline-offset-4">Log In</button>
          </div>
        </div>
      </div>

      {/* ---------------- Masthead ---------------- */}
      <header className="border-b border-[#1A1A1A]">
        <div className="mx-auto max-w-7xl px-4 pb-4 pt-6 text-center sm:px-6 sm:pt-9">
          <p className="f-mono mb-2 text-[10px] uppercase tracking-[.3em] text-[#9B2C1F]">Est. Seoul · Confidential Trade Intelligence</p>
          <h1 className="f-display select-none text-[13vw] font-black leading-[.85] tracking-[-.02em] sm:text-[8.5rem] lg:text-[10.5rem]">
            DIRTY CABINET
          </h1>
          <p className="f-display mt-3 text-base italic text-[#1A1A1A]/75 sm:text-xl">The Unpolished Truth of Global Trade &amp; BD</p>
        </div>
      </header>

      {/* ---------------- Section nav (sticky) ---------------- */}
      <nav className="sticky top-0 z-40 border-b border-[#E5E2DC] bg-[#F7F5F0]/95 backdrop-blur" style={{ top: "env(safe-area-inset-top,0px)" }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <ul className="no-scrollbar flex min-w-0 items-center gap-0 overflow-x-auto">
            {Object.entries(CATS).map(([key, c]) => (
              <li key={key} className="shrink-0">
                <button
                  onClick={() => pickCategory(key)}
                  className={`group flex flex-col items-start border-b-2 px-3 py-3 text-left transition sm:px-4 ${filter === key ? "border-[#1A1A1A]" : "border-transparent hover:border-[#1A1A1A]/30"}`}
                >
                  <span className="text-[12px] font-bold uppercase tracking-[.14em]">{c.label}</span>
                  <span className="hidden text-[11px] text-[#1A1A1A]/50 lg:block">{c.sub}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <button onClick={() => setSearchOpen(true)} aria-label="Search the cabinet" className="flex items-center gap-2 p-2 text-sm hover:bg-[#1A1A1A]/5">
              <Search size={18} /><span className="hidden md:inline">Search</span>
            </button>
            <button
              onClick={() => setInquireOpen(true)}
              className="flex items-center gap-1.5 bg-[#1A1A1A] px-4 py-2.5 text-[12px] font-bold uppercase tracking-[.16em] text-[#F7F5F0] transition hover:bg-[#9B2C1F]"
            >
              Inquire <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* ---------------- Hero cover story ---------------- */}
        <section className="grid gap-0 border-b border-[#E5E2DC] py-8 lg:grid-cols-12 lg:gap-10 lg:py-12">
          <div className="lg:col-span-7">
            <Plate motif="containers" caption="Plate I — Gulf port, inspection bay, 05:40" className="aspect-[4/3] w-full sm:aspect-[16/11]">
              <div className="absolute left-4 top-4 z-10 flex gap-2">
                <span className="f-mono bg-[#F7F5F0] px-2 py-1 text-[10px] uppercase tracking-[.16em]">Cover Story</span>
                <span className="f-mono bg-[#9B2C1F] px-2 py-1 text-[10px] uppercase tracking-[.16em] text-white">Trends</span>
              </div>
              <div className="absolute right-4 top-4 z-10 rotate-[-6deg] border-2 border-white/70 px-3 py-1">
                <span className="f-mono text-[11px] font-medium uppercase tracking-[.2em] text-white/80">Rejected</span>
              </div>
            </Plate>
          </div>
          <div className="flex flex-col justify-center pt-6 lg:col-span-5 lg:pt-0">
            <div className="mb-4 flex items-center gap-3">
              <span className="f-mono text-[10px] uppercase tracking-[.18em] text-[#9B2C1F]">{HERO.kicker}</span>
              <span className="f-mono text-[10px] uppercase tracking-[.18em] text-[#1A1A1A]/40">{HERO.file}</span>
            </div>
            <h2 className="f-display balance text-[2.1rem] font-bold leading-[1.02] tracking-[-.01em] sm:text-5xl">{HERO.title}</h2>
            <p className="mt-5 max-w-[60ch] border-l-2 border-[#1A1A1A] pl-4 text-[15px] leading-relaxed text-[#1A1A1A]/80">{HERO.excerpt}</p>
            <div className="mt-6 grid grid-cols-3 border-y border-[#E5E2DC]">
              {HERO.stats.map((s, i) => (
                <div key={s.v} className={`py-3 ${i ? "border-l border-[#E5E2DC] pl-3" : ""}`}>
                  <div className="f-display text-3xl font-bold tabular-nums">{s.k}</div>
                  <div className="f-mono text-[10px] uppercase tracking-[.12em] text-[#1A1A1A]/55">{s.v}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm">
                <span className="font-semibold">By {HERO.author}</span>
                <span className="text-[#1A1A1A]/55"> · {HERO.role}</span>
                <span className="ml-2 inline-flex items-center gap-1 text-[#1A1A1A]/55"><Clock size={13} /> {HERO.read}</span>
              </div>
              <button onClick={() => flash("Full cover story unlocks for subscribers.")} className="group inline-flex items-center gap-1 text-sm font-bold uppercase tracking-[.12em]">
                Read the file <ArrowUpRight size={16} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </section>

        {/* ---------------- Filterable grid ---------------- */}
        <section ref={gridRef} className="scroll-mt-20 py-10">
          <div className="mb-6 flex flex-col gap-4 border-b border-[#1A1A1A] pb-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="f-mono text-[10px] uppercase tracking-[.2em] text-[#1A1A1A]/50">The Drawers</p>
              <h3 className="f-display text-3xl font-bold sm:text-4xl">Open a Cabinet</h3>
            </div>
            <div className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 md:mx-0 md:px-0" role="tablist" aria-label="Filter stories">
              {[["ALL", "All Cabinets"], ["BRANDS", "Brands"], ["TRENDS", "Trends"], ["JOURNAL", "Review Journal"]].map(([k, l]) => {
                const n = k === "ALL" ? ARTICLES.length : ARTICLES.filter((a) => a.cat === k).length;
                return (
                  <button
                    key={k} role="tab" aria-selected={filter === k} onClick={() => setFilter(k)}
                    className={`shrink-0 border px-3 py-2 text-[12px] font-semibold uppercase tracking-[.1em] transition ${filter === k ? "border-[#1A1A1A] bg-[#1A1A1A] text-[#F7F5F0]" : "border-[#E5E2DC] hover:border-[#1A1A1A]"}`}
                  >
                    {l} <span className="f-mono ml-1 opacity-60">{n}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <ArticleGrid items={filter === "ALL" ? ARTICLES : ARTICLES.filter((a) => a.cat === filter)} onOpen={() => flash("Story preview — full text unlocks for subscribers.")} />
        </section>

        {/* ---------------- Lead magnet ---------------- */}
        <div ref={leadRef} className="scroll-mt-20"><LeadMagnet /></div>

        {/* ---------------- Consumer Review Journal ---------------- */}
        <section ref={journalRef} className="scroll-mt-20 py-12">
          <ReviewJournal openForm={() => setReviewOpen(true)} reviewOpen={reviewOpen} closeForm={() => setReviewOpen(false)} flash={flash} />
        </section>
      </main>

      <Footer onInquire={() => setInquireOpen(true)} />

      <InquireModal open={inquireOpen} onClose={() => setInquireOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} onPick={(cat) => { setSearchOpen(false); setTimeout(() => pickCategory(cat), 50); }} />

      {toast && (
        <div className="dc-in fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 bg-[#1A1A1A] px-4 py-2.5 text-sm text-[#F7F5F0] shadow-lg" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}

/* ---------------- Article grid ---------------- */
function ArticleGrid({ items, onOpen }) {
  const [lead, ...rest] = items;
  if (!lead) return null;
  return (
    <div className="grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
      {/* Lead card spans two columns on large screens */}
      <article key={lead.id} className="dc-in group cursor-pointer md:col-span-2 lg:row-span-2" onClick={onOpen}>
        <Plate motif={lead.motif} caption={lead.plate} className="aspect-[16/10] w-full transition duration-500 group-hover:contrast-125" />
        <CardMeta a={lead} big />
      </article>
      {rest.map((a) => (
        <article key={a.id} className="dc-in group cursor-pointer" onClick={onOpen}>
          <Plate motif={a.motif} caption={a.plate} className="aspect-[4/3] w-full" />
          <CardMeta a={a} />
        </article>
      ))}
    </div>
  );
}

function CardMeta({ a, big }) {
  return (
    <div className="pt-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Tag>{CATS[a.cat].label === "Consumer Review Journal" ? "Journal" : CATS[a.cat].label}</Tag>
          <span className="f-mono text-[10px] uppercase tracking-[.14em] text-[#1A1A1A]/55">{a.tag}</span>
        </div>
        <span className="f-mono flex items-center gap-1 text-[11px] tabular-nums text-[#1A1A1A]/55"><Eye size={12} /> {fmt(a.views)}</span>
      </div>
      <h4 className={`f-display balance font-bold leading-[1.08] group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4 ${big ? "text-3xl sm:text-4xl" : "text-[1.4rem]"}`}>
        {a.title}
      </h4>
      <p className={`mt-2 leading-relaxed text-[#1A1A1A]/70 ${big ? "max-w-[62ch] text-base" : "text-[14px]"}`}>{a.snippet}</p>
      <p className="mt-3 text-xs text-[#1A1A1A]/55">{a.author} · {a.read} min</p>
    </div>
  );
}

/* ---------------- Lead magnet ---------------- */
function LeadMagnet() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle"); // idle | error | done
  const [msg, setMsg] = useState("");
  const submit = (e) => {
    e.preventDefault();
    if (!isEmail(email)) { setState("error"); setMsg("Enter a full email address, like name@company.com."); return; }
    if (isFreeMail(email)) { setState("error"); setMsg("Use your company address so we can send the B2B edition."); return; }
    mailDesk("PDF request: MENA & US K-Beauty Compliance Checklist", [`Please send the checklist to: ${email}`]);
    setState("done");
  };
  return (
    <section className="relative my-4 overflow-hidden border border-[#1A1A1A] bg-[#1A1A1A] text-[#F7F5F0]">
      <div className="grid items-center gap-8 p-6 sm:p-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="mb-3 flex items-center gap-2">
            <Lock size={14} className="text-[#E3A79B]" />
            <span className="f-mono text-[10px] uppercase tracking-[.2em] text-[#E3A79B]">Free PDF · 24 pages · Updated Nov 2026</span>
          </div>
          <h3 className="f-display balance text-3xl font-bold leading-tight sm:text-[2.6rem]">
            Unlock the Unredacted Playbook: <span className="italic font-normal">MENA &amp; US K-Beauty Compliance Checklist</span>
          </h3>
          <ul className="mt-5 grid gap-2 text-sm text-[#F7F5F0]/75 sm:grid-cols-2">
            {["Carton & label line-check for GCC ports", "US facility & product listing worksheet", "Halal and alcohol declaration templates", "Climate-stress packaging spec sheet"].map((t) => (
              <li key={t} className="flex items-start gap-2"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#F7F5F0]/50" />{t}</li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-5">
          {state === "done" ? (
            <div className="dc-in border border-[#F7F5F0]/25 p-5">
              <CheckCircle2 className="mb-2" />
              <p className="f-display text-2xl font-bold">One step left.</p>
              <p className="mt-1 text-sm text-[#F7F5F0]/70">Your mail app opened a request from <span className="font-semibold text-[#F7F5F0]">{email}</span>. Press send and we will reply with the PDF. No mail app? Write to unclescoslab@gmail.com.</p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <label htmlFor="lead-email" className="f-mono mb-2 block text-[10px] uppercase tracking-[.18em] text-[#F7F5F0]/60">Business email</label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1A1A1A]/40" />
                  <input
                    id="lead-email" type="email" value={email} placeholder="name@company.com"
                    onChange={(e) => { setEmail(e.target.value); setState("idle"); }}
                    className="w-full bg-[#F7F5F0] py-3 pl-9 pr-3 text-[15px] text-[#1A1A1A] outline-none focus:ring-2 focus:ring-[#E3A79B]"
                  />
                </div>
                <button className="bg-[#9B2C1F] px-5 py-3 text-[12px] font-bold uppercase tracking-[.16em] transition hover:bg-[#B5382A]">Send the PDF</button>
              </div>
              <p className={`mt-2 text-xs ${state === "error" ? "text-[#E3A79B]" : "text-[#F7F5F0]/50"}`}>
                {state === "error" ? msg : "One email with the PDF, then the weekly brief. Unsubscribe in one click."}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Consumer Review Journal ---------------- */
function ScoreBar({ icon: Icon, label, v }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={13} className="shrink-0 text-[#1A1A1A]/55" />
      <span className="f-mono w-[78px] shrink-0 text-[10px] uppercase tracking-[.1em] text-[#1A1A1A]/60">{label}</span>
      <div className="flex flex-1 gap-[3px]">
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n} className={`h-1.5 flex-1 ${n <= v ? (v <= 2 ? "bg-[#9B2C1F]" : "bg-[#1A1A1A]") : "bg-[#E5E2DC]"}`} />
        ))}
      </div>
      <span className="f-mono w-6 text-right text-[11px] tabular-nums">{v}/5</span>
    </div>
  );
}

function ReviewJournal({ openForm, reviewOpen, closeForm, flash }) {
  const [reviews, setReviews] = useState(SEED_REVIEWS);
  const [voted, setVoted] = useState({});
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [focus, setFocus] = useState("All");
  const [sort, setSort] = useState("top");

  const toggleVote = (id) => {
    const on = !voted[id];
    setVoted((v) => ({ ...v, [id]: on }));
    setReviews((rs) => rs.map((r) => (r.id === id ? { ...r, votes: r.votes + (on ? 1 : -1) } : r)));
  };

  const shown = useMemo(() => {
    let r = reviews.filter((x) => (!verifiedOnly || x.verified) && (focus === "All" || x.focus === focus));
    r = [...r].sort((a, b) => (sort === "top" ? b.votes - a.votes : b.date.localeCompare(a.date)));
    return r;
  }, [reviews, verifiedOnly, focus, sort]);

  const addReview = (r) => {
    setReviews((rs) => [r, ...rs]);
    setSort("new");
    closeForm();
    flash("Review added. Press send in your mail app so our desk can verify it.");
  };

  const verifiedCount = reviews.filter((r) => r.verified).length;
  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <>
      <div className="mb-8 grid gap-6 border-b border-[#1A1A1A] pb-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="f-mono text-[10px] uppercase tracking-[.2em] text-[#9B2C1F]">Section III · Interactive</p>
          <h3 className="f-display text-4xl font-bold leading-none sm:text-5xl">Consumer Review Journal</h3>
          <p className="mt-3 max-w-[58ch] text-[15px] leading-relaxed text-[#1A1A1A]/70">
            Teardowns from verified B2B buyers and the community: how products hold up in extreme heat, how packaging survives freight, and where compliance trips up. Sample entries shown during the preview.
          </p>
        </div>
        <div className="grid grid-cols-3 self-end border border-[#E5E2DC] bg-white/50 lg:col-span-5">
          {[[reviews.length, "Reviews filed"], [verifiedCount, "Verified buyers"], [avg, "Avg. rating"]].map(([k, v], i) => (
            <div key={v} className={`p-4 ${i ? "border-l border-[#E5E2DC]" : ""}`}>
              <div className="f-display text-3xl font-bold tabular-nums">{k}</div>
              <div className="f-mono text-[10px] uppercase tracking-[.12em] text-[#1A1A1A]/55">{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <button
          onClick={() => setVerifiedOnly((v) => !v)} aria-pressed={verifiedOnly}
          className={`flex items-center gap-2 border px-3 py-2 text-[12px] font-semibold uppercase tracking-[.08em] transition ${verifiedOnly ? "border-[#1A1A1A] bg-[#1A1A1A] text-[#F7F5F0]" : "border-[#D9D5CC] hover:border-[#1A1A1A]"}`}
        >
          <ShieldCheck size={15} /> Verified buyers only
        </button>
        <div className="flex items-center gap-1 border border-[#D9D5CC] p-1">
          <Filter size={13} className="mx-1 text-[#1A1A1A]/50" />
          {["All", "Climate", "Packaging", "Compliance", "Efficacy"].map((f) => (
            <button key={f} onClick={() => setFocus(f)} className={`px-2 py-1 text-[12px] font-medium transition ${focus === f ? "bg-[#1A1A1A] text-[#F7F5F0]" : "hover:bg-[#1A1A1A]/5"}`}>{f}</button>
          ))}
        </div>
        <label htmlFor="sort" className="sr-only">Sort reviews</label>
        <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)} className="border border-[#D9D5CC] bg-transparent px-2 py-2 text-[12px] font-medium outline-none focus:border-[#1A1A1A]">
          <option value="top">Most useful</option>
          <option value="new">Newest</option>
        </select>
        <button onClick={openForm} className="ml-auto flex items-center gap-1.5 bg-[#1A1A1A] px-4 py-2.5 text-[12px] font-bold uppercase tracking-[.14em] text-[#F7F5F0] hover:bg-[#9B2C1F]">
          <Plus size={15} /> File a review
        </button>
      </div>

      {/* Review cards */}
      <div className="grid gap-px border border-[#E5E2DC] bg-[#E5E2DC] md:grid-cols-2 xl:grid-cols-3">
        {shown.map((r) => (
          <article key={r.id} className="dc-in flex flex-col bg-[#F7F5F0] p-5">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="f-mono text-[10px] uppercase tracking-[.14em] text-[#1A1A1A]/50">{r.brand}</p>
                <h4 className="f-display text-xl font-bold leading-tight">{r.product}</h4>
              </div>
              <Tag tone={r.focus === "Compliance" ? "red" : "ink"}>{r.focus}</Tag>
            </div>
            <div className="mb-3 flex items-center gap-2">
              <Stars value={r.rating} />
              <span className="f-mono text-[11px] text-[#1A1A1A]/50">{r.date}</span>
            </div>
            <p className="mb-4 flex-1 text-[14px] leading-relaxed text-[#1A1A1A]/80">“{r.body}”</p>
            <div className="mb-4 space-y-1.5 border-y border-[#E5E2DC] py-3">
              <ScoreBar icon={Thermometer} label="Climate" v={r.scores.climate} />
              <ScoreBar icon={Package} label="Packaging" v={r.scores.packaging} />
              <ScoreBar icon={FileCheck2} label="Compliance" v={r.scores.compliance} />
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 text-xs">
                <p className="flex items-center gap-1 font-semibold">
                  {r.reviewer}
                  {r.verified ? (
                    <span className="inline-flex items-center gap-0.5 text-[#1F6B45]"><ShieldCheck size={13} /> Verified</span>
                  ) : r.pending ? (
                    <span className="text-[#1A1A1A]/50">· Pending check</span>
                  ) : null}
                </p>
                <p className="truncate text-[#1A1A1A]/55">{r.role} · {r.region}</p>
              </div>
              <button
                onClick={() => toggleVote(r.id)} aria-pressed={!!voted[r.id]} aria-label="Mark as useful"
                className={`f-mono flex shrink-0 items-center gap-1.5 border px-2.5 py-1.5 text-[12px] tabular-nums transition ${voted[r.id] ? "border-[#1A1A1A] bg-[#1A1A1A] text-[#F7F5F0]" : "border-[#D9D5CC] hover:border-[#1A1A1A]"}`}
              >
                <ThumbsUp size={13} /> {r.votes}
              </button>
            </div>
          </article>
        ))}
        {shown.length === 0 && (
          <div className="col-span-full bg-[#F7F5F0] p-10 text-center text-sm text-[#1A1A1A]/60">
            No reviews match these filters yet. Clear a filter or file the first one.
          </div>
        )}
      </div>

      <ReviewModal open={reviewOpen} onClose={closeForm} onSubmit={addReview} />
    </>
  );
}

function ReviewModal({ open, onClose, onSubmit }) {
  const blank = { product: "", brand: "", reviewer: "", role: "", region: "", focus: "Climate", rating: 0, body: "", b2b: true,
    climate: 3, packaging: 3, compliance: 3 };
  const [f, setF] = useState(blank);
  const [err, setErr] = useState({});
  useEffect(() => { if (open) { setF(blank); setErr({}); } }, [open]); // eslint-disable-line
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e?.target ? (e.target.type === "checkbox" ? e.target.checked : e.target.value) : e }));

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!f.product.trim()) er.product = "Add the product name.";
    if (!f.rating) er.rating = "Choose a rating from 1 to 5.";
    if (f.body.trim().length < 20) er.body = "Write at least 20 characters so buyers can learn from it.";
    setErr(er);
    if (Object.keys(er).length) return;
    mailDesk(`Review: ${f.product}`, [
      `Product: ${f.product}`, `Brand: ${f.brand}`, `Name: ${f.reviewer}`, `Role: ${f.role}`, `Region: ${f.region}`,
      `Focus: ${f.focus}`, `Rating: ${f.rating}/5`, `Climate/Packaging/Compliance: ${f.climate}/${f.packaging}/${f.compliance}`,
      `B2B purchase: ${f.b2b ? "yes" : "no"}`, "", f.body,
    ]);
    onSubmit({
      id: `u${Date.now()}`, product: f.product, brand: f.brand || "Unlisted brand", reviewer: f.reviewer || "Anonymous",
      role: f.role || (f.b2b ? "B2B buyer" : "Community member"), region: f.region || "Undisclosed",
      verified: false, pending: f.b2b, rating: f.rating, focus: f.focus, date: new Date().toISOString().slice(0, 10),
      scores: { climate: +f.climate, packaging: +f.packaging, compliance: +f.compliance }, body: f.body, votes: 0,
    });
  };

  return (
    <Modal open={open} onClose={onClose} label="File a review" wide>
      <form onSubmit={submit} className="p-6 sm:p-8" noValidate>
        <p className="f-mono text-[10px] uppercase tracking-[.2em] text-[#9B2C1F]">Consumer Review Journal</p>
        <h3 className="f-display mb-6 text-3xl font-bold">File a review</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Product *" id="rv-product" hint={err.product}><input id="rv-product" className={inputCls} value={f.product} onChange={set("product")} placeholder="e.g. Centella Barrier Cream 50ml" /></Field>
          <Field label="Brand" id="rv-brand"><input id="rv-brand" className={inputCls} value={f.brand} onChange={set("brand")} placeholder="Brand or manufacturer" /></Field>
          <Field label="Your name" id="rv-name"><input id="rv-name" className={inputCls} value={f.reviewer} onChange={set("reviewer")} placeholder="Leave blank to post anonymously" /></Field>
          <Field label="Role / Company type" id="rv-role"><input id="rv-role" className={inputCls} value={f.role} onChange={set("role")} placeholder="e.g. Pharmacy buyer" /></Field>
          <Field label="Region" id="rv-region"><input id="rv-region" className={inputCls} value={f.region} onChange={set("region")} placeholder="City, Country" /></Field>
          <Field label="Main focus" id="rv-focus">
            <select id="rv-focus" className={inputCls} value={f.focus} onChange={set("focus")}>
              {["Climate", "Packaging", "Compliance", "Efficacy"].map((o) => <option key={o}>{o}</option>)}
            </select>
          </Field>
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <span className="f-mono mb-1.5 block text-[10px] uppercase tracking-[.16em] text-[#1A1A1A]/60">Overall rating *</span>
            <Stars value={f.rating} onChange={set("rating")} size={22} />
            {err.rating && <span className="mt-1 block text-xs text-[#9B2C1F]">{err.rating}</span>}
          </div>
          <div className="space-y-2">
            {[["climate", "Climate endurance"], ["packaging", "Packaging"], ["compliance", "Compliance docs"]].map(([k, l]) => (
              <label key={k} htmlFor={`rv-${k}`} className="flex items-center gap-3 text-xs">
                <span className="w-32 shrink-0">{l}</span>
                <input id={`rv-${k}`} type="range" min="1" max="5" value={f[k]} onChange={set(k)} className="flex-1 accent-[#1A1A1A]" />
                <span className="f-mono w-6 tabular-nums">{f[k]}/5</span>
              </label>
            ))}
          </div>
        </div>
        <div className="mt-5">
          <Field label="Your field notes *" id="rv-body" hint={err.body}>
            <textarea id="rv-body" rows={4} className={inputCls} value={f.body} onChange={set("body")} placeholder="What happened in storage, transit, at customs, or with end customers?" />
          </Field>
        </div>
        <label htmlFor="rv-b2b" className="mt-4 flex cursor-pointer items-start gap-2 text-sm">
          <input id="rv-b2b" type="checkbox" checked={f.b2b} onChange={set("b2b")} className="mt-1 accent-[#1A1A1A]" />
          <span>I bought this through a B2B channel. <span className="text-[#1A1A1A]/55">We'll ask for an invoice to add the Verified badge.</span></span>
        </label>
        <div className="mt-6 flex flex-col-reverse gap-2 border-t border-[#E5E2DC] pt-5 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm font-semibold hover:bg-[#1A1A1A]/5">Cancel</button>
          <button className="flex items-center justify-center gap-2 bg-[#1A1A1A] px-5 py-2.5 text-[12px] font-bold uppercase tracking-[.14em] text-[#F7F5F0] hover:bg-[#9B2C1F]">
            <MessageSquare size={15} /> Post review
          </button>
        </div>
      </form>
    </Modal>
  );
}

/* ---------------- Inquire modal (two-track) ---------------- */
const TRACKS = {
  buyer: {
    icon: Ship, title: "Overseas buyer / trader", line: "I am an overseas buyer or trader looking for Korean products",
    regionLabel: "Your market", regions: ["GCC (KSA, UAE, Qatar…)", "North America", "Europe", "Southeast Asia", "Latin America", "Other"],
    budgetLabel: "Opening order budget", budgets: ["Under $10k", "$10k – $50k", "$50k – $250k", "$250k+"],
    extraLabel: "Product interest", extras: ["Skincare", "Sun care", "Clinic / medical aesthetics", "Health screening packages", "Haircare", "Private label"],
  },
  brand: {
    icon: Building2, title: "Brand / manufacturer", line: "I am a brand or manufacturer looking for global BD",
    regionLabel: "Target region", regions: ["GCC / Middle East", "United States", "Europe", "Southeast Asia", "Japan", "Multiple regions"],
    budgetLabel: "Annual BD budget", budgets: ["Under ₩50M", "₩50M – ₩200M", "₩200M – ₩1B", "₩1B+"],
    extraLabel: "Help needed with", extras: ["Buyer introductions", "Regulatory & labeling", "Distributor vetting", "Trade show strategy", "Market-entry research"],
  },
};

function InquireModal({ open, onClose }) {
  const [track, setTrack] = useState(null);
  const [f, setF] = useState({ name: "", email: "", company: "", region: "", budget: "", extras: [], note: "" });
  const [err, setErr] = useState({});
  const [done, setDone] = useState(null);

  useEffect(() => {
    if (open) { setTrack(null); setDone(null); setErr({}); setF({ name: "", email: "", company: "", region: "", budget: "", extras: [], note: "" }); }
  }, [open]);

  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
  const toggleExtra = (x) => setF((s) => ({ ...s, extras: s.extras.includes(x) ? s.extras.filter((y) => y !== x) : [...s.extras, x] }));
  const T = track && TRACKS[track];

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!f.name.trim()) er.name = "Add your name.";
    if (!isEmail(f.email)) er.email = "Enter a valid business email.";
    else if (isFreeMail(f.email)) er.email = "Use your company domain so our desk can verify you.";
    if (!f.company.trim()) er.company = "Add your company name.";
    if (!f.region) er.region = "Choose a region.";
    if (!f.budget) er.budget = "Choose a budget range.";
    setErr(er);
    if (Object.keys(er).length) return;
    mailDesk(`Inquiry (${track}): ${f.company}`, [
      `Name: ${f.name}`, `Email: ${f.email}`, `Company: ${f.company}`, `Region: ${f.region}`,
      `Budget: ${f.budget}`, `Interests: ${f.extras.join(", ")}`, `Note: ${f.note}`,
    ]);
    setDone(`DC-${track === "buyer" ? "B" : "M"}-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  return (
    <Modal open={open} onClose={onClose} label="Inquire" wide>
      {done ? (
        <div className="dc-in p-8 text-center sm:p-12">
          <CheckCircle2 size={40} className="mx-auto mb-4" strokeWidth={1.5} />
          <p className="f-mono text-[10px] uppercase tracking-[.2em] text-[#1A1A1A]/50">Inquiry filed · {done}</p>
          <h3 className="f-display mt-2 text-3xl font-bold">Press send in your mail app.</h3>
          <p className="mx-auto mt-3 max-w-[44ch] text-[15px] text-[#1A1A1A]/70">
            Thanks, {f.name.split(" ")[0]}. A {track === "buyer" ? "sourcing" : "BD"} editor will reply to <span className="font-semibold text-[#1A1A1A]">{f.email}</span> within two business days (KST) once your email arrives. No mail app? Write to unclescoslab@gmail.com.
          </p>
          <button onClick={onClose} className="mt-8 bg-[#1A1A1A] px-6 py-3 text-[12px] font-bold uppercase tracking-[.16em] text-[#F7F5F0] hover:bg-[#9B2C1F]">Back to the magazine</button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="p-6 sm:p-8">
          <p className="f-mono text-[10px] uppercase tracking-[.2em] text-[#9B2C1F]">Work with us</p>
          <h3 className="f-display text-3xl font-bold leading-tight sm:text-4xl">Open a file with the Cabinet</h3>
          <p className="mt-2 text-sm text-[#1A1A1A]/65">Tell us which side of the deal you're on. We match buyers and brands by hand.</p>

          <fieldset className="mt-6 grid gap-2 sm:grid-cols-2">
            <legend className="sr-only">Who are you?</legend>
            {Object.entries(TRACKS).map(([k, t]) => {
              const Icon = t.icon; const on = track === k;
              return (
                <button
                  type="button" key={k} onClick={() => { setTrack(k); setF((s) => ({ ...s, region: "", budget: "", extras: [] })); }} aria-pressed={on}
                  className={`flex items-start gap-3 border p-4 text-left transition ${on ? "border-[#1A1A1A] bg-[#1A1A1A] text-[#F7F5F0]" : "border-[#D9D5CC] bg-white hover:border-[#1A1A1A]"}`}
                >
                  <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border ${on ? "border-[#F7F5F0]" : "border-[#1A1A1A]/40"}`}>
                    {on && <span className="h-2 w-2 bg-[#F7F5F0]" />}
                  </span>
                  <span>
                    <span className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[.1em]"><Icon size={14} /> {t.title}</span>
                    <span className={`mt-1 block text-[13px] leading-snug ${on ? "text-[#F7F5F0]/75" : "text-[#1A1A1A]/60"}`}>{t.line}</span>
                  </span>
                </button>
              );
            })}
          </fieldset>

          {T ? (
            <div key={track} className="dc-in mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Full name *" id="iq-name" hint={err.name}><input id="iq-name" className={inputCls} value={f.name} onChange={set("name")} placeholder="Jane Doe" /></Field>
              <Field label="Business email *" id="iq-email" hint={err.email}><input id="iq-email" type="email" className={inputCls} value={f.email} onChange={set("email")} placeholder="jane@company.com" /></Field>
              <Field label="Company *" id="iq-company" hint={err.company}><input id="iq-company" className={inputCls} value={f.company} onChange={set("company")} placeholder={track === "buyer" ? "Distributor / retailer name" : "Brand or factory name"} /></Field>
              <Field label={`${T.regionLabel} *`} id="iq-region" hint={err.region}>
                <select id="iq-region" className={inputCls} value={f.region} onChange={set("region")}>
                  <option value="">Select…</option>{T.regions.map((r) => <option key={r}>{r}</option>)}
                </select>
              </Field>
              <div className="sm:col-span-2">
                <span className="f-mono mb-1.5 block text-[10px] uppercase tracking-[.16em] text-[#1A1A1A]/60">{T.budgetLabel} *</span>
                <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
                  {T.budgets.map((b) => (
                    <button type="button" key={b} onClick={() => setF((s) => ({ ...s, budget: b }))} aria-pressed={f.budget === b}
                      className={`border px-2 py-2 text-[13px] font-medium tabular-nums transition ${f.budget === b ? "border-[#1A1A1A] bg-[#1A1A1A] text-[#F7F5F0]" : "border-[#D9D5CC] bg-white hover:border-[#1A1A1A]"}`}>{b}</button>
                  ))}
                </div>
                {err.budget && <span className="mt-1 block text-xs text-[#9B2C1F]">{err.budget}</span>}
              </div>
              <div className="sm:col-span-2">
                <span className="f-mono mb-1.5 block text-[10px] uppercase tracking-[.16em] text-[#1A1A1A]/60">{T.extraLabel}</span>
                <div className="flex flex-wrap gap-1.5">
                  {T.extras.map((x) => (
                    <button type="button" key={x} onClick={() => toggleExtra(x)} aria-pressed={f.extras.includes(x)}
                      className={`border px-2.5 py-1.5 text-[12px] transition ${f.extras.includes(x) ? "border-[#1A1A1A] bg-[#1A1A1A] text-[#F7F5F0]" : "border-[#D9D5CC] hover:border-[#1A1A1A]"}`}>
                      {f.extras.includes(x) && "✓ "}{x}
                    </button>
                  ))}
                </div>
              </div>
              <div className="sm:col-span-2">
                <Field label="Anything we should know?" id="iq-note">
                  <textarea id="iq-note" rows={3} className={inputCls} value={f.note} onChange={set("note")} placeholder={track === "buyer" ? "Target SKUs, certifications you need, timeline…" : "Current export markets, hero products, past distributor experience…"} />
                </Field>
              </div>
              <div className="flex flex-col gap-3 border-t border-[#E5E2DC] pt-5 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-center gap-1.5 text-xs text-[#1A1A1A]/55"><ShieldCheck size={14} /> Your details are shared only with the editor handling your file.</p>
                <button className="flex items-center justify-center gap-2 bg-[#1A1A1A] px-6 py-3 text-[12px] font-bold uppercase tracking-[.16em] text-[#F7F5F0] hover:bg-[#9B2C1F]">
                  Submit inquiry <ArrowUpRight size={15} />
                </button>
              </div>
            </div>
          ) : (
            <p className="f-mono mt-6 border border-dashed border-[#D9D5CC] p-4 text-center text-[11px] uppercase tracking-[.14em] text-[#1A1A1A]/45">
              Choose a track above to open the form
            </p>
          )}
        </form>
      )}
    </Modal>
  );
}

/* ---------------- Search overlay ---------------- */
function SearchOverlay({ open, onClose, onPick }) {
  const [q, setQ] = useState("");
  const ref = useRef(null);
  useEffect(() => { if (open) { setQ(""); setTimeout(() => ref.current?.focus(), 30); } }, [open]);
  const pool = useMemo(() => [
    ...ARTICLES.map((a) => ({ cat: a.cat, title: a.title, meta: `${CATS[a.cat].label} · ${a.tag}` })),
    ...SEED_REVIEWS.map((r) => ({ cat: "JOURNAL", title: `${r.product} — ${r.brand}`, meta: `Review · ${r.region}` })),
  ], []);
  const hits = q.trim().length < 2 ? [] : pool.filter((p) => (p.title + p.meta).toLowerCase().includes(q.toLowerCase()));
  const suggestions = ["MoCRA", "Halal", "sunscreen", "packaging", "OEM", "Yugnecare"];

  return (
    <Modal open={open} onClose={onClose} label="Search" wide>
      <div className="p-6 sm:p-8">
        <label htmlFor="dc-search" className="f-mono text-[10px] uppercase tracking-[.2em] text-[#1A1A1A]/50">Search the Cabinet</label>
        <div className="mt-2 flex items-center gap-3 border-b-2 border-[#1A1A1A] pb-2">
          <Search size={22} />
          <input id="dc-search" ref={ref} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Brands, regulations, regions…"
            className="f-display w-full bg-transparent text-2xl outline-none placeholder:text-[#1A1A1A]/30 sm:text-3xl" />
        </div>
        {q.trim().length < 2 ? (
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="f-mono text-[10px] uppercase tracking-[.16em] text-[#1A1A1A]/50">Try:</span>
            {suggestions.map((s) => <button key={s} onClick={() => setQ(s)} className="border border-[#D9D5CC] px-2 py-1 text-xs hover:border-[#1A1A1A]">{s}</button>)}
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-[#E5E2DC]">
            {hits.length === 0 && <li className="py-6 text-sm text-[#1A1A1A]/60">No files match “{q}”. Try a country, regulation, or product type.</li>}
            {hits.map((h, i) => (
              <li key={i}>
                <button onClick={() => onPick(h.cat)} className="group flex w-full items-center justify-between gap-3 py-3 text-left">
                  <span className="min-w-0">
                    <span className="f-mono block text-[10px] uppercase tracking-[.14em] text-[#9B2C1F]">{h.meta}</span>
                    <span className="f-display block text-lg font-bold leading-snug group-hover:underline">{h.title}</span>
                  </span>
                  <ChevronRight size={18} className="shrink-0 text-[#1A1A1A]/40" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
}

/* ---------------- Footer ---------------- */
function Footer({ onInquire }) {
  return (
    <footer className="mt-6 border-t border-[#1A1A1A] bg-[#1A1A1A] text-[#F7F5F0]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="f-display text-4xl font-black leading-none">DIRTY CABINET</p>
          <p className="f-display mt-2 italic text-[#F7F5F0]/60">The Unpolished Truth of Global Trade &amp; BD</p>
          <button onClick={onInquire} className="mt-6 inline-flex items-center gap-2 border border-[#F7F5F0]/40 px-4 py-2.5 text-[12px] font-bold uppercase tracking-[.16em] hover:bg-[#F7F5F0] hover:text-[#1A1A1A]">
            Inquire <ArrowUpRight size={14} />
          </button>
        </div>
        {[["Cabinets", ["Brands", "Trends", "Consumer Review Journal"]], ["Desks", ["Seoul", "Dubai", "Los Angeles"]], ["Company", ["About", "Editorial standards", "Advertise", "Privacy"]]].map(([h, items]) => (
          <div key={h} className="md:col-span-2">
            <p className="f-mono mb-3 text-[10px] uppercase tracking-[.2em] text-[#F7F5F0]/50">{h}</p>
            <ul className="space-y-1.5 text-sm text-[#F7F5F0]/80">{items.map((i) => <li key={i}>{i}</li>)}</ul>
          </div>
        ))}
        <div className="flex items-end md:col-span-1"><FileText size={20} className="text-[#F7F5F0]/30" /></div>
      </div>
      <div className="f-mono border-t border-[#F7F5F0]/10 px-4 py-4 text-center text-[10px] uppercase tracking-[.16em] text-[#F7F5F0]/40">
        © 2026 Dirty Cabinet · A K&S UNCLES publication · Prototype with placeholder content · Not legal or regulatory advice
      </div>
    </footer>
  );
}
