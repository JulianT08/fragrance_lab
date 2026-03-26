import { useState, useEffect } from "react";

const FRAGRANCES = [
  { name: "Prada Paradigm", gender: "masculine", topNotes: ["Herbs & Spices"], middleNotes: ["Woody"], baseNotes: ["Sandalwood"], price: "$98.00", rating: 4.5, reviews: 1247 },
  { name: "Prada Paradoxe", gender: "feminine", topNotes: ["Citrus"], middleNotes: ["Floral"], baseNotes: ["Vanilla"], price: "$112.00", rating: 4.6, reviews: 2083 },
  { name: "Creed Aventus", gender: "masculine", topNotes: ["Fruits"], middleNotes: ["Fresh"], baseNotes: ["Sandalwood"], price: "$325.00", rating: 4.8, reviews: 5612 },
  { name: "Acqua di Giò", gender: "masculine", topNotes: ["Citrus"], middleNotes: ["Fresh"], baseNotes: ["Sandalwood"], price: "$90.00", rating: 4.7, reviews: 8934 },
  { name: "YSL MYSLF", gender: "masculine", topNotes: ["Fresh"], middleNotes: ["Bourbon"], baseNotes: ["Clean"], price: "$105.00", rating: 4.4, reviews: 967 },
  { name: "Polo Earth", gender: "masculine", topNotes: ["Herbs & Spices"], middleNotes: ["Woody"], baseNotes: ["Sandalwood"], price: "$78.00", rating: 4.3, reviews: 743 },
  { name: "Maison Margiela Replica", gender: "unisex", topNotes: ["Fruits"], middleNotes: ["Floral"], baseNotes: ["Clean"], price: "$135.00", rating: 4.5, reviews: 3201 },
];

function findMatches(gender, top, mid, base) {
  const pool = FRAGRANCES.filter((f) => gender === "unisex" ? true : f.gender === gender || f.gender === "unisex");
  const scored = pool.map((f) => {
    let score = 0;
    if (top && f.topNotes.includes(top)) score++;
    if (mid && f.middleNotes.includes(mid)) score++;
    if (base && f.baseNotes.includes(base)) score++;
    return { ...f, score };
  });
  scored.sort((a, b) => b.score - a.score || b.rating - a.rating);
  const best = scored[0];
  if (!best || best.score === 0) return { results: [], type: "none" };
  if (best.score >= 2) return { results: scored.filter((s) => s.score >= 2).slice(0, 2), type: "strong" };
  return { results: [best], type: "partial" };
}

/* Amazon logo image */
function AmazonLogo() {
  return <img src="amazon_transparent.png" alt="Amazon" width="90" height="28" />;
}

/* Inline SVG perfume bottle — wider rectangular shape */
function BottleSVG({ accent = "#232F3E", glow = false }) {
  return (
    <svg viewBox="0 0 200 320" style={{ width: "100%", maxWidth: 180, height: "auto", filter: glow ? `drop-shadow(0 4px 20px ${accent}33)` : "none", transition: "filter 0.6s ease" }}>
      {/* Cap top */}
      <rect x="75" y="4" width="50" height="14" rx="4" fill={accent} opacity="0.45"/>
      {/* Cap body */}
      <rect x="70" y="18" width="60" height="22" rx="3" fill="#C0C0C0" opacity="0.7"/>
      <rect x="70" y="18" width="60" height="22" rx="3" fill={accent} opacity="0.15"/>
      {/* Neck */}
      <rect x="85" y="40" width="30" height="30" rx="2" fill="none" stroke="#C0C0C0" strokeWidth="1.2" opacity="0.6"/>
      <rect x="85" y="40" width="30" height="30" rx="2" fill={accent} opacity="0.04"/>
      {/* Body — wider rectangle with rounded corners */}
      <rect x="32" y="70" width="136" height="220" rx="10" fill="none" stroke="#C0C0C0" strokeWidth="1.5" opacity="0.6"/>
      <rect x="32" y="70" width="136" height="220" rx="10" fill={accent} opacity="0.04"/>
      {/* Liquid fill */}
      <rect x="34" y="140" width="132" height="148" rx="9" fill={accent} opacity="0.08">
        {glow && <animate attributeName="opacity" values="0.06;0.14;0.06" dur="3.5s" repeatCount="indefinite"/>}
      </rect>
      {/* Glass highlight */}
      <rect x="42" y="78" width="18" height="160" rx="9" fill="#fff" opacity="0.18"/>
      {/* Label area */}
      <rect x="60" y="180" width="80" height="60" rx="4" fill="#fff" opacity="0.45"/>
      <text x="100" y="206" textAnchor="middle" fontSize="8" fontFamily="Georgia,serif" fill={accent} opacity="0.6" fontWeight="600">FRAGRANCE</text>
      <text x="100" y="218" textAnchor="middle" fontSize="6.5" fontFamily="Georgia,serif" fill={accent} opacity="0.45">LAB</text>
      <line x1="72" y1="225" x2="128" y2="225" stroke={accent} strokeWidth="0.4" opacity="0.3"/>
      <text x="100" y="234" textAnchor="middle" fontSize="5.5" fontFamily="Arial,sans-serif" fill={accent} opacity="0.35">L'ORÉAL</text>
      {/* Reflection */}
      <ellipse cx="100" cy="294" rx="50" ry="4" fill={accent} opacity="0.03"/>
    </svg>
  );
}

/* Small bottle icon for result cards */
function SmallBottle({ accent }) {
  return (
    <svg viewBox="0 0 40 64" width="36" height="56">
      <rect x="15" y="1" width="10" height="5" rx="1.5" fill="#bbb"/>
      <rect x="13" y="6" width="14" height="4" rx="1" fill="#ccc"/>
      <rect x="17" y="10" width="6" height="6" rx="1" fill="none" stroke="#ccc" strokeWidth="0.6"/>
      <rect x="6" y="16" width="28" height="44" rx="4" fill="none" stroke="#ccc" strokeWidth="1"/>
      <rect x="6" y="16" width="28" height="44" rx="4" fill={accent} opacity="0.08"/>
      <rect x="7" y="32" width="26" height="27" rx="3" fill={accent} opacity="0.1"/>
    </svg>
  );
}

function Stars({ rating, reviews }) {
  const pct = (rating / 5) * 100;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ position: "relative", width: 80, height: 16 }}>
        <span style={{ color: "#ddd", fontSize: 15, letterSpacing: 2 }}>★★★★★</span>
        <span style={{ position: "absolute", left: 0, top: 0, overflow: "hidden", width: `${pct}%`, color: "#FF9900", fontSize: 15, letterSpacing: 2, whiteSpace: "nowrap" }}>★★★★★</span>
      </div>
      <span style={{ fontSize: 12, color: "#007185" }}>{reviews?.toLocaleString()}</span>
    </div>
  );
}


export default function FragranceLab() {
  const [gender, setGender] = useState(null);
  const [topNote, setTopNote] = useState(null);
  const [midNote, setMidNote] = useState(null);
  const [baseNote, setBaseNote] = useState(null);
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [animIn, setAnimIn] = useState(false);
  useEffect(() => { setAnimIn(true); }, []);

  const topOptions = ["Citrus", "Herbs & Spices", "Fruits", "Floral", "Fresh"];
  const midOptions = ["Floral", "Spices", "Woody", "Bourbon", "Fresh"];
  const baseOptions = ["Vanilla", "Sandalwood", "Clean"];

  const accentMap = { masculine: "#232F3E", feminine: "#9B1B5A", unisex: "#3A6B35" };
  const accent = gender ? accentMap[gender] : "#232F3E";
  const allSelected = gender && topNote && midNote && baseNote;

  function handleFind() {
    if (!allSelected) return;
    setResults(findMatches(gender, topNote, midNote, baseNote));
    setShowResults(true);
  }
  function handleReset() {
    setGender(null); setTopNote(null); setMidNote(null); setBaseNote(null);
    setResults(null); setShowResults(false);
  }

  const Pill = ({ label, selected, onClick, color, icon }) => (
    <button onClick={onClick} style={{
      padding: "9px 16px", borderRadius: 22,
      border: selected ? `2px solid ${color || accent}` : "1.5px solid #D5D9D9",
      background: selected ? `${color || accent}14` : "#fff",
      color: selected ? color || accent : "#0F1111",
      fontFamily: "'Amazon Ember', Arial, sans-serif", fontSize: 13,
      fontWeight: selected ? 600 : 400, cursor: "pointer",
      transition: "all 0.25s cubic-bezier(.4,0,.2,1)", whiteSpace: "nowrap",
      display: "flex", alignItems: "center", gap: 6,
      boxShadow: selected ? `0 2px 8px ${color || accent}22` : "none",
      transform: selected ? "scale(1.04)" : "scale(1)",
    }}>
      {icon && <span style={{ fontSize: 15 }}>{icon}</span>}
      {label}
    </button>
  );

  const SectionLabel = ({ step, label, sub }) => (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
        <span style={{
          width: 24, height: 24, borderRadius: "50%", background: accent,
          color: "#fff", fontSize: 12, fontWeight: 700, display: "flex",
          alignItems: "center", justifyContent: "center", transition: "background 0.3s",
        }}>{step}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#0F1111" }}>{label}</span>
      </div>
      {sub && <span style={{ fontSize: 12, color: "#565959", marginLeft: 32, fontStyle: "italic" }}>{sub}</span>}
    </div>
  );

  const ResultCard = ({ frag }) => (
    <div style={{
      border: "1px solid #D5D9D9", borderRadius: 10, padding: 18, background: "#fff", marginBottom: 14,
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    }}>
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        <div style={{
          width: 72, height: 72, borderRadius: 10,
          background: `linear-gradient(135deg, ${accent}08, ${accent}14)`,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          border: `1px solid ${accent}12`,
        }}>
          <SmallBottle accent={accent} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#0F1111", marginBottom: 3 }}>{frag.name}</div>
          <Stars rating={frag.rating} reviews={frag.reviews} />
          <div style={{ fontSize: 12, color: "#565959", marginTop: 5, display: "flex", gap: 6, flexWrap: "wrap" }}>
            {[...frag.topNotes, ...frag.middleNotes, ...frag.baseNotes].map((n,i) => (
              <span key={i} style={{ background: "#f0f0f0", padding: "2px 8px", borderRadius: 10, fontSize: 11 }}>{n}</span>
            ))}
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#0F1111", marginTop: 8 }}>{frag.price}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap", alignItems: "center" }}>
            <button style={{
              padding: "8px 22px", borderRadius: 22, border: "none",
              background: "linear-gradient(to bottom, #FFD814, #F0C14B)", color: "#0F1111",
              fontWeight: 600, fontSize: 13, cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
            }}>Add to Cart</button>
            <button style={{
              padding: "8px 22px", borderRadius: 22, border: "1px solid #D5D9D9",
              background: "#fff", color: "#0F1111", fontSize: 13, cursor: "pointer",
            }}>See Details</button>
            <span style={{
              padding: "3px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600, color: "#fff",
              background: frag.score === 3 ? "#067D62" : frag.score === 2 ? "#FF9900" : "#888",
            }}>
              {frag.score === 3 ? "✓ Perfect Match" : frag.score === 2 ? "Strong Match" : "Partial Match"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh", background: "#EAEDED",
      fontFamily: "'Amazon Ember', Arial, sans-serif",
      opacity: animIn ? 1 : 0, transition: "opacity 0.6s ease",
    }}>
      {/* Nav */}
      <div style={{ background: "#131921", padding: "8px 24px", display: "flex", alignItems: "center", gap: 16 }}>
        <AmazonLogo />
        <div style={{ flex: 1 }} />
        <span style={{ color: "#ccc", fontSize: 12 }}>Beauty</span>
        <span style={{ color: "#555", fontSize: 12, margin: "0 2px" }}>›</span>
        <span style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>Fragrance Lab</span>
      </div>

      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${accent}0C 0%, #fff 60%)`, padding: "20px 0 0 0", transition: "background 0.6s" }}>
        <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 20px" }}>
          <span style={{ fontSize: 10, color: "#565959", textTransform: "uppercase", letterSpacing: 2, fontWeight: 700 }}>Powered by L'Oréal</span>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#0F1111", margin: "4px 0 2px 0", letterSpacing: -0.5 }}>Fragrance Lab</h1>
          <p style={{ fontSize: 14, color: "#565959", margin: "0 0 20px 0", lineHeight: 1.6 }}>Build your scent profile and discover the perfect fragrance — curated just for you.</p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 20px 40px" }}>
        <div style={{ display: "flex", gap: 28, alignItems: "flex-start", flexWrap: "wrap" }}>

          {/* Left: Bottle */}
          <div style={{ flex: "0 0 240px", display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 0" }}>
            <div style={{
              width: 220, height: 300, borderRadius: 16,
              background: `linear-gradient(180deg, #fff 0%, ${accent}06 100%)`,
              border: `1px solid ${accent}10`,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.6s ease",
              boxShadow: allSelected ? `0 8px 32px ${accent}18` : "0 2px 12px rgba(0,0,0,0.04)",
            }}>
              <BottleSVG accent={accent} glow={!!allSelected} />
            </div>
            <div style={{
              marginTop: 14, fontSize: 11, color: accent, textTransform: "uppercase",
              letterSpacing: 2, fontWeight: 700, opacity: 0.6, textAlign: "center",
            }}>
              {gender || "Your Scent"}
            </div>

            {(topNote || midNote || baseNote) && (
              <div style={{
                marginTop: 14, padding: "12px 16px", borderRadius: 10,
                background: "#fff", border: `1px solid ${accent}15`, width: "100%",
                boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
              }}>
                <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: accent, fontWeight: 700, marginBottom: 8 }}>Your Notes</div>
                {topNote && <div style={{ fontSize: 12, color: "#565959", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: "#888", fontSize: 11 }}>Top:</span> <span style={{ color: "#0F1111", fontWeight: 500 }}>{topNote}</span>
                </div>}
                {midNote && <div style={{ fontSize: 12, color: "#565959", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: "#888", fontSize: 11 }}>Mid:</span> <span style={{ color: "#0F1111", fontWeight: 500 }}>{midNote}</span>
                </div>}
                {baseNote && <div style={{ fontSize: 12, color: "#565959", display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: "#888", fontSize: 11 }}>Base:</span> <span style={{ color: "#0F1111", fontWeight: 500 }}>{baseNote}</span>
                </div>}
              </div>
            )}
          </div>

          {/* Right: Quiz / Results */}
          <div style={{ flex: 1, minWidth: 300 }}>
            {!showResults ? (
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #D5D9D9", padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <SectionLabel step="1" label="Fragrance Identity" sub="How do you want your scent to feel?" />
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 26 }}>
                  {[["Masculine","♂"], ["Feminine","♀"], ["Unisex","⚥"]].map(([g, icon]) => (
                    <Pill key={g} label={g} icon={icon} selected={gender === g.toLowerCase()} onClick={() => setGender(g.toLowerCase())} color={accentMap[g.toLowerCase()]} />
                  ))}
                </div>
                <div style={{ borderBottom: "1px solid #E7E7E7", margin: "0 0 22px 0" }} />

                <SectionLabel step="2" label="Top Notes" sub="The first impression — what hits in the opening 15 min" />
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 26 }}>
                  {topOptions.map((n) => <Pill key={n} label={n} selected={topNote === n} onClick={() => setTopNote(n)} />)}
                </div>

                <SectionLabel step="3" label="Middle Notes" sub="The heart — the character that defines the fragrance" />
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 26 }}>
                  {midOptions.map((n) => <Pill key={n} label={n} selected={midNote === n} onClick={() => setMidNote(n)} />)}
                </div>

                <SectionLabel step="4" label="Base Notes" sub="The lasting foundation — what lingers for hours" />
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 30 }}>
                  {baseOptions.map((n) => <Pill key={n} label={n} selected={baseNote === n} onClick={() => setBaseNote(n)} />)}
                </div>

                <button onClick={handleFind} disabled={!allSelected} style={{
                  width: "100%", padding: "13px 0", borderRadius: 24, border: "none",
                  background: allSelected ? "linear-gradient(to bottom, #F7DFA5, #F0C14B)" : "#E7E7E7",
                  color: allSelected ? "#111" : "#999", fontSize: 15, fontWeight: 700,
                  cursor: allSelected ? "pointer" : "not-allowed",
                  boxShadow: allSelected ? "0 3px 10px rgba(240,193,75,0.35)" : "none",
                  transition: "all 0.3s ease", letterSpacing: 0.3,
                }}>
                  Find Me a Fragrance
                </button>
                {!allSelected && <p style={{ fontSize: 12, color: "#888", textAlign: "center", marginTop: 10 }}>Complete all four steps to unlock your match</p>}
              </div>
            ) : (
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #D5D9D9", padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                  <h2 style={{ fontSize: 19, fontWeight: 700, color: "#0F1111", margin: 0 }}>
                    {results.type === "none" ? "No Matches Found" : "Your Fragrance Match"}
                  </h2>
                  <button onClick={handleReset} style={{ padding: "6px 18px", borderRadius: 18, border: "1px solid #D5D9D9", background: "#fff", color: "#0F1111", fontSize: 12, cursor: "pointer" }}>
                    Start Over
                  </button>
                </div>
                {results.type === "none" ? (
                  <div style={{ textAlign: "center", padding: "44px 20px", background: "#FFF8E1", borderRadius: 10, border: "1px solid #FFE0B2" }}>
                    <p style={{ fontSize: 16, fontWeight: 600, color: "#0F1111", margin: "0 0 6px 0" }}>Alter Criteria</p>
                    <p style={{ fontSize: 13, color: "#565959", margin: "0 0 18px 0" }}>No fragrance matched your combination. Try adjusting your notes.</p>
                    <button onClick={handleReset} style={{ padding: "10px 32px", borderRadius: 22, border: "none", background: "linear-gradient(to bottom, #F7DFA5, #F0C14B)", color: "#111", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Try Again</button>
                  </div>
                ) : (
                  <>
                    <p style={{ fontSize: 13, color: "#565959", margin: "0 0 18px 0" }}>
                      {results.type === "strong"
                        ? `We found ${results.results.length === 1 ? "a strong match" : "strong matches"} for your scent profile.`
                        : "Here's the closest match based on your preferences."}
                    </p>
                    {results.results.map((f, i) => <ResultCard key={i} frag={f} />)}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        <div style={{ marginTop: 36, paddingTop: 14, borderTop: "1px solid #DDD", textAlign: "center" }}>
          <span style={{ fontSize: 11, color: "#999" }}>Fragrance Lab by L'Oréal — An Amazon Interactive Experience</span>
        </div>
      </div>
    </div>
  );
}