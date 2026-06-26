// ============================================================
//  MAAC GHAZIABAD — Tweaks panel app
//  ------------------------------------------------------------
//  A small React app that renders the in-design Tweaks panel and
//  applies the chosen options to the (plain HTML) page by setting
//  CSS variables / classes on the document. It only changes how the
//  page LOOKS — all content stays in index.html.
//
//  Color combinations are derived from the MAAC logo identity:
//  red + black + white. Each palette is [primary, gradientEnd, deep].
// ============================================================

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": ["#ff2e2e", "#ff5a1a", "#d40f2a"],
  "tone": "midnight",
  "corners": "rounded",
  "displayFont": "Anton",
  "animations": true,
  "tickerSpeed": 30,
  "heroBanner": "https://www.maacindia.com/images/home/young-learners-with-laptop.jpg"
}/*EDITMODE-END*/;

// Logo-derived color combinations (all red-forward, per MAAC brand)
const PALETTES = [
  ["#ff2e2e", "#ff5a1a", "#d40f2a"], // MAAC Red (red → orange)
  ["#ED1C24", "#ff4d3d", "#b5121a"], // Signature Red (classic logo red)
  ["#ff1e56", "#ff7a1a", "#d4083f"], // Crimson Heat
  ["#ff3b30", "#ff2d7e", "#cc1f6a"]  // Neon Red / Pink
];

const FONT_MAP = {
  "Anton": '"Anton", "Arial Narrow", sans-serif',
  "Bebas": '"Bebas Neue", "Arial Narrow", sans-serif',
  "Oswald": '"Oswald", "Arial Narrow", sans-serif'
};

// Full-width hero banner options (swap any for your own student/centre photo)
const HERO_BANNERS = {
  "Young Learners": "https://www.maacindia.com/images/home/young-learners-with-laptop.jpg",
  "GenAI": "https://www.maacindia.com/images/home/banner-genai-th.jpg",
  "Fueling Dreams": "https://www.maacindia.com/images/home/banner-fueling-dreams-th.jpg",
  "BVOC": "https://www.maacindia.com/images/home/banner-bvoc-th.jpg"
};

function MaacTweaks() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply every tweak to the page whenever something changes
  React.useEffect(() => {
    const root = document.documentElement;

    // --- Brand color combination ---
    const [primary, grad, deep] = t.palette;
    root.style.setProperty("--red", primary);
    root.style.setProperty("--orange", grad);
    root.style.setProperty("--red-deep", deep || primary);
    root.style.setProperty("--pink", grad);
    const hot = `linear-gradient(120deg, ${primary} 0%, ${grad} 100%)`;
    root.style.setProperty("--grad-hot", hot);
    root.style.setProperty("--grad-pink", hot);

    // --- Background tone ---
    if (t.tone === "charcoal") {
      root.style.setProperty("--ink", "#121214");
      root.style.setProperty("--ink-2", "#1a1a1f");
      root.style.setProperty("--surface", "#212127");
      root.style.setProperty("--surface-2", "#2a2a31");
    } else {
      root.style.setProperty("--ink", "#08080a");
      root.style.setProperty("--ink-2", "#0f0f13");
      root.style.setProperty("--surface", "#161619");
      root.style.setProperty("--surface-2", "#1f1f25");
    }

    // --- Corner style ---
    const rounded = t.corners === "rounded";
    root.style.setProperty("--radius", rounded ? "18px" : "4px");
    root.style.setProperty("--radius-sm", rounded ? "12px" : "4px");

    // --- Display font ---
    root.style.setProperty("--font-display", FONT_MAP[t.displayFont] || FONT_MAP.Anton);

    // --- Animations on/off ---
    document.body.classList.toggle("no-anim", !t.animations);

    // --- Ticker speed ---
    document.querySelectorAll(".ticker__track").forEach((el) => {
      el.style.animationDuration = t.tickerSpeed + "s";
    });

    // --- Hero banner image ---
    const banner = document.getElementById("heroBanner");
    if (banner) banner.style.backgroundImage = `url('${t.heroBanner}')`;
  }, [t]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Brand Color (from logo)" />
      <TweakColor
        label="Palette"
        value={t.palette}
        options={PALETTES}
        onChange={(v) => setTweak("palette", v)}
      />

      <TweakSection label="Theme" />
      <TweakRadio
        label="Background"
        value={t.tone}
        options={["midnight", "charcoal"]}
        onChange={(v) => setTweak("tone", v)}
      />
      <TweakRadio
        label="Corners"
        value={t.corners}
        options={["rounded", "sharp"]}
        onChange={(v) => setTweak("corners", v)}
      />

      <TweakSection label="Typography" />
      <TweakRadio
        label="Display font"
        value={t.displayFont}
        options={["Anton", "Bebas", "Oswald"]}
        onChange={(v) => setTweak("displayFont", v)}
      />

      <TweakSection label="Hero" />
      <TweakSelect
        label="Banner image"
        value={t.heroBanner}
        options={Object.keys(HERO_BANNERS).map((k) => ({ label: k, value: HERO_BANNERS[k] }))}
        onChange={(v) => setTweak("heroBanner", v)}
      />

      <TweakSection label="Motion" />
      <TweakToggle
        label="Animations"
        value={t.animations}
        onChange={(v) => setTweak("animations", v)}
      />
      <TweakSlider
        label="Ticker speed"
        value={t.tickerSpeed}
        min={10}
        max={60}
        step={2}
        unit="s"
        onChange={(v) => setTweak("tickerSpeed", v)}
      />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById("tweaks-root")).render(<MaacTweaks />);
