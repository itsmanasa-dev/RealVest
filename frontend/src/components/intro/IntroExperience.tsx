import React, { useEffect, useRef, useState } from 'react';
import type { Property, MarketHotZone } from '../../types';
import { mockHotZones, mockProperties } from '../../data/mockProperties';
import { MICRO_MARKET_COORDS, BENGALURU_CENTER } from '../../services/geoService';
import { formatInrLakhs } from '../../utils/currency';
import { ArrowRight } from 'lucide-react';

// Scene progression ids
type Scene = 'logo' | 'tagline' | 'map' | 'question' | 'journey' | 'property';

interface IntroExperienceProps {
  isDark: boolean;
  properties?: Property[];
  onComplete: () => void;
}

/* Project a real Bengaluru coordinate onto the intro SVG map.
   Uses the same geographic data as the live Leaflet map, so the
   "Bengaluru emerges" scene is geographically real, not a fake illustration. */
const BBOX = {
  latMin: 12.82,
  latMax: 13.12,
  lngMin: 77.52,
  lngMax: 77.82,
};

function project(lat: number, lng: number, w: number, h: number) {
  const x = ((lng - BBOX.lngMin) / (BBOX.lngMax - BBOX.lngMin)) * w;
  const y = ((BBOX.latMax - lat) / (BBOX.latMax - BBOX.latMin)) * h;
  return { x, y };
}

/* The micro-markets we actually reveal in the map scene (real, app-supported areas). */
const REVEAL_LOCATIONS = [
  { label: 'Yelahanka', key: 'yelahanka', isHot: false },
  { label: 'Hebbal', key: 'hebbal', isHot: false },
  { label: 'Indiranagar', key: 'indiranagar', isHot: true },
  { label: 'Koramangala', key: 'koramangala', isHot: true },
  { label: 'Whitefield', key: 'whitefield', isHot: true },
  { label: 'Bellandur', key: 'bellandur', isHot: true },
  { label: 'Marathahalli', key: 'marathahalli', isHot: true },
  { label: 'HSR Layout', key: 'hsr layout', isHot: false },
  { label: 'Electronic City', key: 'electronic city', isHot: true },
];

/* Investment journey — the connecting narrative of the product. */
const JOURNEY_STEPS = [
  { label: 'BUDGET', value: '₹50L' },
  { label: 'LOCATION', value: 'Whitefield' },
  { label: 'PROPERTY', value: 'Opportunity found' },
  { label: 'MARKET', value: 'Demand 96.4' },
  { label: 'ANALYSIS', value: '21.9% ROI' },
  { label: 'SIMULATION', value: 'Cash-flow +' },
  { label: 'DECISION', value: 'BUY' },
];

export const IntroExperience: React.FC<IntroExperienceProps> = ({
  isDark,
  properties = mockProperties,
  onComplete,
}) => {
  const [scene, setScene] = useState<Scene>('logo');
  const [showAnswer, setShowAnswer] = useState(false);
  const [exit, setExit] = useState(false);
  const [mobile, setMobile] = useState(false);
  // property reveal + journey indexes stagger in
  const [stepIdx, setStepIdx] = useState(0);
  const [mapIdx, setMapIdx] = useState(0);
  const doneRef = useRef(false);

  const hero = properties[0] || mockProperties[0];

  useEffect(() => {
    setMobile(typeof window !== 'undefined' && window.innerWidth < 640);
  }, []);

  // Primary scene timeline (auto-advance). Mobile runs a reduced sequence.
  useEffect(() => {
    const t: ReturnType<typeof setTimeout>[] = [];
    const schedule = (ms: number, fn: () => void) => t.push(setTimeout(fn, ms));

    if (mobile) {
      // Mobile: RealVest -> Bengaluru -> Question -> Property -> Dashboard
      schedule(200, () => setScene('logo'));
      schedule(2200, () => setScene('map'));
      schedule(5600, () => setScene('question'));
      schedule(8500, () => setScene('property'));
    } else {
      schedule(200, () => setScene('logo'));
      schedule(3300, () => setScene('tagline'));
      schedule(6000, () => setScene('map'));
      schedule(10500, () => setScene('question'));
      schedule(13500, () => setScene('journey'));
      schedule(19400, () => setScene('property'));
    }

    return () => t.forEach(clearTimeout);
  }, [mobile]);

  // When the property reveal (final scene) leads the timeline, hold the reveal
  // for a beat, then fade out and hand off to the workspace.
  useEffect(() => {
    if (scene !== 'property') return;
    setExit(false);
    const t = setTimeout(() => setExit(true), mobile ? 3000 : 3800);
    return () => clearTimeout(t);
  }, [scene, mobile]);

  // Stagger the investment-journey steps
  useEffect(() => {
    if (scene !== 'journey') return;
    setStepIdx(0);
    const interval = setInterval(() => {
      setStepIdx((i) => {
        if (i >= JOURNEY_STEPS.length - 1) {
          clearInterval(interval);
          return i;
        }
        return i + 1;
      });
    }, 780);
    return () => clearInterval(interval);
  }, [scene]);

  // Stagger the map location reveals
  useEffect(() => {
    if (scene !== 'map') return;
    setMapIdx(0);
    const interval = setInterval(() => {
      setMapIdx((i) => {
        if (i >= REVEAL_LOCATIONS.length - 1) {
          clearInterval(interval);
          return i;
        }
        return i + 1;
      });
    }, 380);
    return () => clearInterval(interval);
  }, [scene]);

  // Question scene: reveal the answer after a beat
  useEffect(() => {
    if (scene !== 'question') return;
    setShowAnswer(false);
    const t = setTimeout(() => setShowAnswer(true), 2000);
    return () => clearTimeout(t);
  }, [scene]);

  // Hand off to the app when the outro fade completes
  useEffect(() => {
    if (!exit) return;
    const t = setTimeout(() => {
      if (!doneRef.current) {
        doneRef.current = true;
        onComplete();
      }
    }, 850);
    return () => clearTimeout(t);
  }, [exit, onComplete]);

  const handleSkip = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setExit(true);
  };

  /* Build the geometric Bengaluru map points from real coordinates (SVG viewBox 400 x 300) */
  const W = 400;
  const H = 300;
  const center = project(BENGALURU_CENTER.lat, BENGALURU_CENTER.lng, W, H);
  const locationPoints = REVEAL_LOCATIONS.map((loc) => {
    const coord = MICRO_MARKET_COORDS[loc.key] || BENGALURU_CENTER;
    const pt = project(coord.lat, coord.lng, W, H);
    return { ...loc, x: pt.x, y: pt.y };
  });
  const hotZonePoints = mockHotZones
    .map((z) => {
      const coord = getZoneCoord(z);
      return coord ? project(coord.lat, coord.lng, W, H) : null;
    })
    .filter(Boolean);

  const propertyPoint = getPropertyCoord(hero);
  const propPt = propertyPoint ? project(propertyPoint.lat, propertyPoint.lng, W, H) : null;

  return (
    <div
      className={`fixed inset-0 z-[60] overflow-hidden bg-canvas text-ink transition-colors duration-500 ${
        exit ? 'rv-intro-exit' : ''
      }`}
      aria-label="RealVest introduction"
    >
      {/* ambient brand glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: isDark
            ? 'radial-gradient(1100px 600px at 50% 38%, rgba(77,124,255,0.16), transparent 65%)'
            : 'radial-gradient(1100px 600px at 50% 38%, rgba(36,86,242,0.10), transparent 65%)',
        }}
      />

      {/* Skip */}
      {scene !== 'property' && (
        <button
          onClick={handleSkip}
          className="absolute top-6 right-6 z-20 inline-flex items-center gap-1.5 text-sm font-medium text-ink-3 hover:text-ink transition-colors cursor-pointer"
        >
          Skip intro <ArrowRight size={15} />
        </button>
      )}

      {/* SCENE: LOGO */}
      {scene === 'logo' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
          <h1 className="rv-intro-logo font-display text-4xl sm:text-6xl font-extrabold tracking-[0.18em] text-ink uppercase">
            RealVest
          </h1>
          <p className="rv-intro-sub mt-4 text-[11px] sm:text-xs font-semibold tracking-[0.3em] uppercase text-ink-3">
            Bengaluru Investment Intelligence
          </p>
        </div>
      )}

      {/* SCENE: TAGLINE */}
      {scene === 'tagline' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <p className="rv-intro-rise max-w-xl text-lg sm:text-2xl font-medium text-ink leading-snug">
            Understand the market.
            <br />
            Find the opportunity.
            <br />
            <span className="text-brand font-semibold">Make the decision.</span>
          </p>
        </div>
      )}

      {/* SCENE: BENGALURU EMERGES */}
      {scene === 'map' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          <p className="rv-intro-sub mb-2 text-[11px] font-semibold tracking-[0.3em] uppercase text-ink-3">
            Bengaluru emerges
          </p>
          <div className="rv-intro-map relative w-full max-w-lg rounded-2xl border border-line bg-surface-soft/40 p-2 sm:p-3">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto rounded-xl" role="img" aria-label="Map of Bengaluru investment corridors">
              {/* subtle grid */}
              {Array.from({ length: 7 }).map((_, i) => (
                <line key={`v${i}`} x1={(i + 1) * (W / 8)} y1={0} x2={(i + 1) * (W / 8)} y2={H} stroke="var(--border)" strokeWidth={0.5} opacity={0.5} />
              ))}
              {Array.from({ length: 8 }).map((_, i) => (
                <line key={`h${i}`} x1={0} y1={(i + 1) * (H / 9)} x2={W} y2={(i + 1) * (H / 9)} stroke="var(--border)" strokeWidth={0.5} opacity={0.5} />
              ))}

              {/* corridor silhouette sketch (approximate ring road) */}
              <path
                d={`M ${center.x - 78} ${center.y + 52} C ${center.x - 60} ${center.y - 46}, ${center.x + 14} ${center.y - 66}, ${center.x + 62} ${center.y - 30} C ${center.x + 96} ${center.y - 6}, ${center.x + 66} ${center.y + 62}, ${center.x + 4} ${center.y + 64} C ${center.x - 46} ${center.y + 64}, ${center.x - 92} ${center.y + 72}, ${center.x - 78} ${center.y + 52} Z`}
                fill="none"
                stroke="var(--brand)"
                strokeOpacity={0.5}
                strokeWidth={1.2}
                strokeDasharray="2 6"
              />

              {/* hot-zone ambient clusters */}
              {hotZonePoints.map((pt, i) => (
                <circle key={`hc${i}`} cx={pt.x} cy={pt.y} r={16 + (i % 3) * 7} fill="var(--brand)" opacity={0.05} />
              ))}

              {/* center node */}
              <circle cx={center.x} cy={center.y} r={4} fill="var(--brand)" className="rv-intro-pulse" />

              {/* revealed micro-markets (real coordinates, staggered) */}
              {locationPoints.slice(0, mapIdx + 1).map((loc, i) => (
                <g key={loc.key} className="rv-intro-dot" style={{ animationDelay: `${i * 60}ms` }}>
                  <circle cx={loc.x} cy={loc.y} r={loc.isHot ? 4.5 : 3} fill={loc.isHot ? 'var(--pos)' : 'var(--brand)'} />
                  <circle cx={loc.x} cy={loc.y} r={loc.isHot ? 9 : 6} fill="none" stroke={loc.isHot ? 'var(--pos)' : 'var(--brand)'} strokeOpacity={0.35} />
                  <text
                    x={loc.x + 8}
                    y={loc.y + 3.5}
                    className="font-mono text-[7px]"
                    fill="var(--text-muted)"
                    style={{ textAnchor: 'start' }}
                  >
                    {loc.label}
                  </text>
                </g>
              ))}

              {/* hero property marker after the ring appears */}
              {mapIdx >= REVEAL_LOCATIONS.length - 1 && propPt && (
                <g className="rv-intro-dot" style={{ animationDelay: '0ms' }}>
                  <circle cx={propPt.x} cy={propPt.y} r={10} fill="var(--brand)" opacity={0.25} className="rv-intro-pulse" />
                  <circle cx={propPt.x} cy={propPt.y} r={5} fill="var(--brand)" />
                </g>
              )}
            </svg>
          </div>
          <p className="mt-3 text-xs font-medium text-ink-2 rv-intro-fade">
            {mapIdx < REVEAL_LOCATIONS.length
              ? `Mapping ${REVEAL_LOCATIONS[Math.min(mapIdx, REVEAL_LOCATIONS.length - 1)].label}…`
              : 'Investment corridors identified'}
          </p>
        </div>
      )}

      {/* SCENE: QUESTION */}
      {scene === 'question' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <p className="rv-intro-rise text-3xl sm:text-5xl font-display font-semibold tracking-tight text-ink">
            Where should your
            <br />
            money live<span className="text-brand">?</span>
          </p>
          {showAnswer && (
            <p className="rv-intro-rise mt-6 text-base sm:text-xl font-medium text-ink-2">
              <span className="text-pos font-semibold">RealVest</span> finds the answer.
            </p>
          )}
        </div>
      )}

      {/* SCENE: JOURNEY */}
      {scene === 'journey' && (
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="w-full max-w-md">
            <p className="rv-intro-sub mb-5 text-center text-[11px] font-semibold tracking-[0.3em] uppercase text-ink-3">
              The investment journey
            </p>
            <div className="flex flex-col gap-1.5">
              {JOURNEY_STEPS.slice(0, stepIdx + 1).map((step, i) => {
                const isDecision = step.label === 'DECISION';
                return (
                  <div
                    key={step.label}
                    className={`rv-intro-step flex items-center justify-between rounded-lg px-4 py-2.5 border ${
                      i === stepIdx
                        ? isDecision
                          ? 'border-pos bg-pos-soft'
                          : 'border-brand bg-brand-soft/60'
                        : 'border-line bg-surface'
                    }`}
                    style={{ animationDelay: `${Math.min(i, stepIdx) * 0 }ms` }}
                  >
                    <span
                      className={`text-[10px] font-bold tracking-[0.2em] uppercase ${
                        i === stepIdx ? 'text-brand' : 'text-ink-3'
                      }`}
                    >
                      {step.label}
                    </span>
                    <span
                      className={`font-semibold text-sm ${
                        isDecision ? 'text-pos' : i === stepIdx ? 'text-ink' : 'text-ink-2'
                      }`}
                    >
                      {step.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SCENE: PROPERTY REVEAL */}
      {scene === 'property' && (
        <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6">
          <div className="rv-intro-zoom relative w-full max-w-lg overflow-hidden rounded-2xl border border-line shadow-pop">
            <img
              src={hero.imageUrl}
              alt={hero.title}
              className="w-full h-[280px] sm:h-[360px] object-cover"
              loading="lazy"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white/70">{hero.location}</p>
                  <h2 className="mt-0.5 text-lg sm:text-xl font-semibold text-white truncate">{hero.title}</h2>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white">
                    <span>
                      Est. value{' '}
                      <span className="font-semibold text-white">{formatInrLakhs(hero.fairValueLakhs)}</span>
                    </span>
                    <span>
                      Projected ROI <span className="font-semibold text-emerald-300">{hero.annualYield}%</span>
                    </span>
                    <span>
                      Confidence <span className="font-semibold text-white">{hero.confidenceScore}%</span>
                    </span>
                  </div>
                </div>
                <span className="shrink-0 rounded-md bg-emerald-500 px-3 py-1 text-xs font-bold text-white">
                  {hero.recommendation}
                </span>
              </div>
            </div>
          </div>
          <p className="rv-intro-fade absolute bottom-8 sm:bottom-10 text-xs font-medium text-ink-3 tracking-wide">
            Entering your RealVest workspace…
          </p>
        </div>
      )}

      {/* progress indicator */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
        {(['logo', 'tagline', 'map', 'question', 'journey', 'property'] as Scene[]).map((s) => (
          <span
            key={s}
            className={`h-1 rounded-full transition-all duration-500 ${
              s === scene ? 'w-6 bg-brand' : 'bg-line-strong'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

/* Small local helpers to resolve real coordinates (mirrors geoService logic without map deps). */
function getZoneCoord(zone: MarketHotZone): { lat: number; lng: number } | null {
  const nameKey = (zone.name || '').toLowerCase();
  for (const key of Object.keys(MICRO_MARKET_COORDS)) {
    if (nameKey.includes(key)) return MICRO_MARKET_COORDS[key];
  }
  return null;
}

function getPropertyCoord(property: Property): { lat: number; lng: number } {
  const locKey = (property.location || '').toLowerCase().trim();
  return (
    MICRO_MARKET_COORDS[locKey] ||
    Object.entries(MICRO_MARKET_COORDS).find(([key]) => locKey.includes(key))?.[1] ||
    BENGALURU_CENTER
  );
}
