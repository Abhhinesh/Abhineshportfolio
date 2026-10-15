import React, { useState, useEffect, useRef, useCallback } from 'react';

interface IconProps {
  className?: string;
}

const ArrowUpRight: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter" className={className} aria-hidden="true">
    <path d="M7 17L17 7" />
    <path d="M7 7h10v10" />
  </svg>
);

const ArrowUp: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter" className={className} aria-hidden="true">
    <path d="M12 19V5" />
    <path d="M5 12l7-7 7 7" />
  </svg>
);

const X: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter" className={className} aria-hidden="true">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const Check: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter" className={className} aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const Copy: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter" className={className} aria-hidden="true">
    <rect x="9" y="9" width="13" height="13" />
    <path d="M5 15H4V4h11v1" />
  </svg>
);

const Code2: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter" className={className} aria-hidden="true">
    <path d="m18 16 4-4-4-4M6 8l-4 4 4 4m8.5-12-5 16" />
  </svg>
);

const Cpu: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter" className={className} aria-hidden="true">
    <rect x="4" y="4" width="16" height="16" />
    <rect x="9" y="9" width="6" height="6" />
    <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
  </svg>
);

const Mail: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter" className={className} aria-hidden="true">
    <rect width="20" height="16" x="2" y="4" />
    <path d="m22 7-10 7L2 7" />
  </svg>
);

const Menu: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter" className={className} aria-hidden="true">
    <line x1="4" x2="20" y1="7" y2="7" />
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="17" y2="17" />
  </svg>
);

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mediaQuery.matches);
    const listener = (event: MediaQueryListEvent) => setReduced(event.matches);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  return reduced;
}

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  reducedMotion?: boolean;
}

const Reveal: React.FC<RevealProps> = ({
  children,
  className = '',
  delayMs = 0,
  reducedMotion = false,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      setVisible(true);
      return;
    }
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: reducedMotion ? '0ms' : `${delayMs}ms`,
      }}
      className={`transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      } ${className}`}
    >
      {children}
    </div>
  );
};

interface ProjectItem {
  id: string;
  number: string;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  liveUrl: string;
  sourceUrl: string;
  visualType: 'orb-grid' | 'wave-topology' | 'glyph-matrix' | 'node-architecture';
  year: string;
}

interface SkillCategory {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  skills: string[];
}

interface ProcessStage {
  number: string;
  title: string;
  description: string;
  deliverables: string[];
  glyphPattern: number[];
}

interface PortfolioData {
  monogram: string;
  availabilityText: string;
  isAvailable: boolean;
  heroIntro: string;
  aboutHeadline: string[];
  aboutDescription: string;
  profile: {
    name: string;
    role: string;
    location: string;
    focus: string;
    experience: string;
    availability: string;
  };
  projects: ProjectItem[];
  skillCategories: SkillCategory[];
  contact: {
    email: string;
    message: string;
    socials: {
      github: string;
      linkedin: string;
      instagram: string;
    };
  };
}

const DEFAULT_PORTFOLIO_DATA: PortfolioData = {
  monogram: 'N//01',
  availabilityText: 'AVAILABLE FOR OPPORTUNITIES',
  isAvailable: true,
  heroIntro:
    "I'm a creative developer exploring the intersection of design, technology, and digital experiences.",
  aboutHeadline: ['CURIOUS BY NATURE.', 'BUILT TO CREATE.'],
  aboutDescription:
    "I'm passionate about creating digital experiences that combine thoughtful design, purposeful technology, and meaningful interactions.",
  profile: {
    name: '[ ABHINESH RAI ]',
    role: '[ Full stack developer ]',
    location: '[ Lucknow // Uttar Pradesh ]',
    focus: '[ INTERACTIVE SYSTEMS & UI ]',
    experience: '[ 2+ YEARS ]',
    availability: '[ WEB DESIGNING ]',
  },
  projects: [
    {
      id: 'proj-01',
      number: '01',
      title: 'DIGITAL EXPERIENCE',
      category: 'INTERACTIVE WEB ARCHITECTURE',
      description:
        'An experimental spatial web environment combining Swiss typographic grids, kinetic typography, and real-time procedural shaders.',
      technologies: ['React', 'TypeScript', 'WebGL / Canvas', 'Motion Systems'],
      liveUrl: 'https://example.com',
      sourceUrl: 'https://github.com',
      visualType: 'orb-grid',
      year: '2025 // SYS.01',
    },
    {
      id: 'proj-02',
      number: '02',
      title: 'CREATIVE EXPERIMENT',
      category: 'GENERATIVE DOT-MATRIX ENGINE',
      description:
        'Audio-reactive and pointer-responsive dot-matrix glyph synthesizer built to explore minimalist industrial telemetry interfaces.',
      technologies: ['HTML5 Canvas', 'JavaScript', 'CSS Grid', 'Web Audio API'],
      liveUrl: 'https://example.com',
      sourceUrl: 'https://github.com',
      visualType: 'wave-topology',
      year: '2025 // SYS.02',
    },
    {
      id: 'proj-03',
      number: '03',
      title: 'INTERACTIVE INTERFACE',
      category: 'DESIGN SYSTEM & COMPONENT KIT',
      description:
        'A high-contrast, monochrome modular interface system engineered for zero-latency micro-interactions and strict keyboard accessibility.',
      technologies: ['React', 'Tailwind CSS', 'UI Primitives', 'TypeScript'],
      liveUrl: 'https://example.com',
      sourceUrl: 'https://github.com',
      visualType: 'glyph-matrix',
      year: '2024 // SYS.03',
    },
    {
      id: 'proj-04',
      number: '04',
      title: 'PERSONAL PROJECT',
      category: 'CREATIVE CODING ARCHIVE',
      description:
        'A curated collection of algorithmic layout studies, physics-driven UI primitives, and brutalist editorial prototypes.',
      technologies: ['Creative Coding', 'SVG Filters', 'Motion Systems', 'CSS Architecture'],
      liveUrl: 'https://example.com',
      sourceUrl: 'https://github.com',
      visualType: 'node-architecture',
      year: '2024 // SYS.04',
    },
  ],
  skillCategories: [
    {
      id: 'cat-dev',
      code: 'SYS // 01',
      title: 'DEVELOPMENT',
      subtitle: 'FRONTEND ARCHITECTURE & ENGINEERING',
      skills: ['HTML', 'CSS', 'JavaScript', 'React'],
    },
    {
      id: 'cat-des',
      code: 'SYS // 02',
      title: 'DESIGN',
      subtitle: 'SYSTEMS, GRIDS & VISUAL PRECISION',
      skills: ['UI/UX Design', 'Responsive Design', 'Visual Design', 'Prototyping'],
    },
    {
      id: 'cat-tech',
      code: 'SYS // 03',
      title: 'CREATIVE TECHNOLOGY',
      subtitle: 'MOTION & GENERATIVE INTERFACES',
      skills: ['Animation', 'Interactive Experiences', 'Creative Coding'],
    },
  ],
  contact: {
    email: 'abhineshr@student.iul.ac.in',
    message: 'Open to interesting projects, creative collaborations, and new opportunities.',
    socials: {
      github: 'https://github.com',
      linkedin:
        'https://www.linkedin.com/in/abhinesh-rai-07297a356?utm_source=share_via&utm_content=profile&utm_medium=member_android',
      instagram: 'https://www.instagram.com/abhinesh_ra1?rpxt=bWF0N3pjNmV3bmZz',
    },
  },
};

const PROCESS_STAGES: ProcessStage[] = [
  {
    number: '01',
    title: 'DISCOVER',
    description: 'Understand the problem and identify the opportunity.',
    deliverables: ['PROBLEM DEFINITION', 'TECHNICAL CONSTRAINTS', 'ARCHITECTURE MAP'],
    glyphPattern: [
      0, 0, 1, 0, 0,
      0, 1, 1, 1, 0,
      1, 1, 0, 1, 1,
      0, 1, 1, 1, 0,
      0, 0, 1, 0, 0,
    ],
  },
  {
    number: '02',
    title: 'EXPLORE',
    description: 'Experiment with ideas, references, and visual directions.',
    deliverables: ['TYPOGRAPHIC SYSTEMS', 'MOTION PROTOTYPES', 'INTERACTION MODELS'],
    glyphPattern: [
      1, 0, 1, 0, 1,
      0, 1, 1, 1, 0,
      1, 1, 1, 1, 1,
      0, 1, 1, 1, 0,
      1, 0, 1, 0, 1,
    ],
  },
  {
    number: '03',
    title: 'BUILD',
    description: 'Turn concepts into polished, functional experiences.',
    deliverables: ['MODULAR CODEBASE', 'FLUID RESPONSIVENESS', '60FPS MOTION ENGINE'],
    glyphPattern: [
      1, 1, 1, 1, 1,
      1, 0, 0, 0, 1,
      1, 0, 1, 0, 1,
      1, 0, 0, 0, 1,
      1, 1, 1, 1, 1,
    ],
  },
  {
    number: '04',
    title: 'REFINE',
    description: 'Improve performance, usability, and visual details.',
    deliverables: ['WCAG ACCESSIBILITY', 'LIGHTHOUSE AUDIT', 'MICRO-INTERACTION POLISH'],
    glyphPattern: [
      0, 1, 1, 1, 0,
      1, 0, 1, 0, 1,
      1, 1, 1, 1, 1,
      1, 0, 1, 0, 1,
      0, 1, 1, 1, 0,
    ],
  },
];

const Crosshair: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span
    aria-hidden="true"
    className={`pointer-events-none select-none font-mono text-[10px] leading-none text-[#555555] ${className}`}
  >
    +
  </span>
);

const DotMatrixBadge: React.FC<{ active?: boolean }> = ({ active = true }) => (
  <span
    className="inline-grid grid-cols-3 gap-[2px] p-1 border border-white/10 bg-[#0A0A0A]"
    aria-hidden="true"
  >
    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
      const isRed = active && i === 4;
      const isLit = i % 2 === 0 || i === 4;
      return (
        <span
          key={i}
          className={`w-[3px] h-[3px] rounded-full transition-colors duration-300 ${
            isRed ? 'bg-[#E62B2B]' : isLit ? 'bg-[#F5F5F5]' : 'bg-[#262626]'
          }`}
        />
      );
    })}
  </span>
);

interface ProjectVisualPreviewProps {
  type: ProjectItem['visualType'];
  number: string;
}

const ProjectVisualPreview: React.FC<ProjectVisualPreviewProps> = ({ type, number }) => {
  return (
    <div className="relative w-full h-56 sm:h-64 bg-[#060606] border-b border-white/10 overflow-hidden flex items-center justify-center select-none">
      {/* Subtle Dot-Matrix Grid Background */}
      <div
        className="absolute inset-0 opacity-30 transition-transform duration-700 ease-out group-hover:scale-105"
        style={{
          backgroundImage: 'radial-gradient(rgba(245, 245, 245, 0.22) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />

      {/* Top Metadata Bar */}
      <div className="absolute top-3 inset-x-4 flex items-center justify-between font-mono text-[10px] tracking-[0.18em] text-[#666666] z-10">
        <span>FIG // {number}</span>
        <span className="text-[#888888] group-hover:text-[#E62B2B] transition-colors">
          [ PREVIEW.SYS ]
        </span>
      </div>

      {/* Procedural SVG Artwork per Project */}
      <div className="relative z-10 transition-transform duration-500 ease-out group-hover:scale-105">
        {type === 'orb-grid' && (
          <svg className="w-36 h-36 sm:w-40 sm:h-40" viewBox="0 0 160 160" aria-hidden="true">
            <circle cx="80" cy="80" r="62" fill="none" stroke="rgba(255,255,255,0.12)" strokeDasharray="3 3" />
            <circle cx="80" cy="80" r="44" fill="none" stroke="rgba(255,255,255,0.22)" />
            <circle cx="80" cy="80" r="24" fill="none" stroke="#E62B2B" strokeWidth="1.5" strokeDasharray="4 4" />
            {Array.from({ length: 12 }).map((_, idx) => {
              const angle = (idx / 12) * Math.PI * 2;
              const cx = 80 + Math.cos(angle) * 44;
              const cy = 80 + Math.sin(angle) * 44;
              return (
                <circle
                  key={idx}
                  cx={cx}
                  cy={cy}
                  r={idx % 3 === 0 ? 3 : 2}
                  fill={idx === 0 ? '#E62B2B' : '#F5F5F5'}
                />
              );
            })}
            <circle cx="80" cy="80" r="4" fill="#E62B2B" />
          </svg>
        )}

        {type === 'wave-topology' && (
          <svg className="w-44 h-36 sm:w-48 sm:h-40" viewBox="0 0 200 140" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, row) =>
              Array.from({ length: 9 }).map((__, col) => {
                const x = 24 + col * 19;
                const yOffset = Math.sin(col * 0.8 + row * 0.6) * 10;
                const y = 30 + row * 20 + yOffset;
                const isAccent = (row === 2 && col === 4) || (row === 1 && col === 6);
                return (
                  <circle
                    key={`${row}-${col}`}
                    cx={x}
                    cy={y}
                    r={isAccent ? 3.2 : 2}
                    fill={isAccent ? '#E62B2B' : 'rgba(245,245,245,0.75)'}
                  />
                );
              })
            )}
            <path
              d="M 24 70 Q 65 40, 100 70 T 176 70"
              fill="none"
              stroke="rgba(230,43,43,0.45)"
              strokeWidth="1.2"
              strokeDasharray="3 3"
            />
          </svg>
        )}

        {type === 'glyph-matrix' && (
          <div className="grid grid-cols-7 gap-2.5 p-4 border border-white/10 bg-black/80" aria-hidden="true">
            {Array.from({ length: 35 }).map((_, i) => {
              const isRed = i === 17 || i === 3;
              const isLit = i % 2 === 0 || i % 5 === 0;
              return (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full transition-transform duration-300 group-hover:scale-110 ${
                    isRed
                      ? 'bg-[#E62B2B]'
                      : isLit
                      ? 'bg-[#F5F5F5]'
                      : 'bg-[#222222]'
                  }`}
                />
              );
            })}
          </div>
        )}

        {type === 'node-architecture' && (
          <svg className="w-44 h-36 sm:w-48 sm:h-40" viewBox="0 0 200 140" aria-hidden="true">
            <line x1="40" y1="35" x2="100" y2="70" stroke="rgba(255,255,255,0.2)" />
            <line x1="160" y1="35" x2="100" y2="70" stroke="rgba(255,255,255,0.2)" />
            <line x1="40" y1="105" x2="100" y2="70" stroke="rgba(255,255,255,0.2)" />
            <line x1="160" y1="105" x2="100" y2="70" stroke="#E62B2B" strokeDasharray="3 3" />
            <rect x="28" y="23" width="24" height="24" fill="#0A0A0A" stroke="rgba(255,255,255,0.4)" />
            <rect x="148" y="23" width="24" height="24" fill="#0A0A0A" stroke="rgba(255,255,255,0.4)" />
            <rect x="28" y="93" width="24" height="24" fill="#0A0A0A" stroke="rgba(255,255,255,0.4)" />
            <rect x="148" y="93" width="24" height="24" fill="#0A0A0A" stroke="#E62B2B" />
            <circle cx="100" cy="70" r="10" fill="#0A0A0A" stroke="#F5F5F5" strokeWidth="1.5" />
            <circle cx="100" cy="70" r="3.5" fill="#E62B2B" />
          </svg>
        )}
      </div>

      {/* Bottom Corner Technical Coordinates */}
      <div className="absolute bottom-3 inset-x-4 flex items-center justify-between font-mono text-[9px] tracking-[0.2em] text-[#555555]">
        <span>RES // 1440x900</span>
        <span className="group-hover:text-[#F5F5F5] transition-colors">INSPECT ↗</span>
      </div>
    </div>
  );
};

type MatrixMode = 'orb' | 'wave' | 'glyph';

interface DotMatrixCanvasProps {
  mode: MatrixMode;
  onModeChange: (m: MatrixMode) => void;
  reducedMotion: boolean;
}

const InteractiveDotMatrix: React.FC<DotMatrixCanvasProps> = ({
  mode,
  reducedMotion,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pointerRef = useRef<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    active: boolean;
    pulseTime: number;
    pulseX: number;
    pulseY: number;
  }>({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    active: false,
    pulseTime: -100,
    pulseX: 0,
    pulseY: 0,
  });

  const [telemetry, setTelemetry] = useState({
    nodes: 420,
    coordX: '000',
    coordY: '000',
  });

  const triggerPulse = useCallback((clientX?: number, clientY?: number) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = clientX !== undefined ? clientX - rect.left : rect.width / 2;
    const y = clientY !== undefined ? clientY - rect.top : rect.height / 2;
    pointerRef.current.pulseX = x;
    pointerRef.current.pulseY = y;
    pointerRef.current.pulseTime = performance.now();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const isMobile = window.innerWidth < 768;
    const sphereCount = isMobile ? 220 : 420;
    const spherePoints: {
      bx: number;
      by: number;
      bz: number;
      isAccent: boolean;
    }[] = [];

    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < sphereCount; i++) {
      const y = 1 - (i / (sphereCount - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      spherePoints.push({
        bx: x,
        by: y,
        bz: z,
        isAccent: i % 29 === 0,
      });
    }

    const updateSize = () => {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      width = Math.max(280, Math.floor(rect.width));
      height = Math.max(300, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    let rotationY = 0;
    let rotationX = 0.25;

    const render = (now: number) => {
      ctx.clearRect(0, 0, width, height);

      const t = reducedMotion ? 0 : now * 0.001;
      const ptr = pointerRef.current;
      const pulseElapsed = (now - ptr.pulseTime) * 0.001;
      const hasActivePulse = pulseElapsed >= 0 && pulseElapsed < 2.2;

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      const cx = width / 2;
      const cy = height / 2;
      const baseRadius = Math.min(width, height) * 0.36;

      if (!reducedMotion) {
        rotationY += 0.0045 + ptr.vx * 0.0002;
        rotationX += (0.25 - rotationX) * 0.03 + ptr.vy * 0.0002;
        ptr.vx *= 0.92;
        ptr.vy *= 0.92;
      }

      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);

      for (let i = 0; i < spherePoints.length; i++) {
        const p = spherePoints[i];

        const x1 = p.bx * cosY - p.bz * sinY;
        const z1 = p.bz * cosY + p.bx * sinY;
        const y2 = p.by * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.by * sinX;

        const wave = reducedMotion
          ? 0
          : Math.sin(p.bx * 4 + t * 2.2) * Math.cos(p.by * 4 + t * 1.8) * 0.06;

        const currentRadius = baseRadius * (1 + wave);
        let sx = cx + x1 * currentRadius;
        let sy = cy + y2 * currentRadius;

        if (ptr.active) {
          const dx = sx - ptr.x;
          const dy = sy - ptr.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 115;
          if (dist < maxDist && dist > 0.1) {
            const force = (1 - dist / maxDist) * 22;
            sx += (dx / dist) * force;
            sy += (dy / dist) * force;
          }
        }

        let pulseBoost = 0;
        if (hasActivePulse) {
          const dx = sx - ptr.pulseX;
          const dy = sy - ptr.pulseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const waveRadius = pulseElapsed * 240;
          const diff = Math.abs(dist - waveRadius);
          if (diff < 36) {
            pulseBoost = (1 - diff / 36) * (1 - pulseElapsed / 2.2);
            if (dist > 0.1) {
              sx += (dx / dist) * pulseBoost * 14;
              sy += (dy / dist) * pulseBoost * 14;
            }
          }
        }

        const depthAlpha = Math.max(0.12, (z2 + 1.25) / 2.25);
        const dotRadius = (z2 > 0 ? 2.1 : 1.25) + pulseBoost * 1.8;

        ctx.beginPath();
        ctx.arc(sx, sy, dotRadius, 0, Math.PI * 2);

        if (p.isAccent || pulseBoost > 0.55) {
          ctx.fillStyle = `rgba(230, 43, 43, ${Math.min(1, depthAlpha + 0.35)})`;
        } else {
          ctx.fillStyle = `rgba(245, 245, 245, ${depthAlpha * 0.88})`;
        }
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateSize);
    };
  }, [mode, reducedMotion]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    pointerRef.current.vx = x - pointerRef.current.x;
    pointerRef.current.vy = y - pointerRef.current.y;
    pointerRef.current.x = x;
    pointerRef.current.y = y;
    pointerRef.current.active = true;

    setTelemetry((prev) => ({
      ...prev,
      coordX: String(Math.round(x)).padStart(3, '0'),
      coordY: String(Math.round(y)).padStart(3, '0'),
    }));
  };

  const handlePointerLeave = () => {
    pointerRef.current.active = false;
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={(e) => triggerPulse(e.clientX, e.clientY)}
      className="relative w-full h-[360px] sm:h-[430px] lg:h-[500px] bg-[#060606] border border-white/10 overflow-hidden select-none cursor-crosshair group"
      role="region"
      aria-label="Interactive Dot-Matrix Visualiser. Move cursor or click to interact."
    >
      <Crosshair className="absolute top-2 left-2.5 z-10" />
      <Crosshair className="absolute top-2 right-2.5 z-10" />
      <Crosshair className="absolute bottom-2 left-2.5 z-10" />
      <Crosshair className="absolute bottom-2 right-2.5 z-10" />

      <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-black/60 backdrop-blur-sm font-mono text-[10px] tracking-[0.18em] text-[#888888]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E62B2B] animate-pulse" />
          <span className="text-[#F5F5F5]">GLYPH.MATRIX // ENGINE v2.4</span>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <span>
            XY: [{telemetry.coordX}, {telemetry.coordY}]
          </span>
          <span>NODES: {telemetry.nodes}</span>
        </div>
      </div>

      <canvas ref={canvasRef} className="block w-full h-full" />

      <div className="absolute bottom-0 inset-x-0 z-10 flex items-center justify-between px-4 py-2.5 border-t border-white/10 bg-black/80 backdrop-blur-md font-mono text-[10px] tracking-[0.16em] text-[#888888]">
        <span>INTERACTIVE FIELD // MOVE POINTER</span>
        <span className="text-[#F5F5F5] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E62B2B]" />
          CLICK TO PULSE
        </span>
      </div>
    </div>
  );
};

export function App() {
  const reducedMotion = usePrefersReducedMotion();

  const data = DEFAULT_PORTFOLIO_DATA;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('home');
  const [activeProcessIndex, setActiveProcessIndex] = useState<number>(0);
  const [emailCopied, setEmailCopied] = useState(false);
  const [heroMounted, setHeroMounted] = useState(false);

  const [utcTime, setUtcTime] = useState<string>('00:00:00 UTC');
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number; visible: boolean }>({
    x: -100,
    y: -100,
    visible: false,
  });

  useEffect(() => {
    setHeroMounted(true);
    const updateClock = () => {
      const now = new Date();
      setUtcTime(now.toISOString().slice(11, 19) + ' UTC');
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY, visible: true });
    };
    const handleMouseLeave = () => {
      setCursorPos((prev) => ({ ...prev, visible: false }));
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [reducedMotion]);

  useEffect(() => {
    const sectionIds = ['home', 'about', 'projects', 'skills', 'process', 'contact'];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 240;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  };

  const heroLines = ['DESIGNING', 'THE DIGITAL', 'UNKNOWN.'];

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(data.contact.email);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2500);
    } catch {
      // Clipboard fallback
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-[#000000] text-[#F5F5F5] selection:bg-[#E62B2B] selection:text-white relative overflow-x-hidden antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DotGothic16&family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap');

        :root {
          --font-display: 'Space Grotesk', sans-serif;
          --font-mono: 'IBM Plex Mono', monospace;
          --font-sans: 'Inter', sans-serif;
          --font-dot: 'DotGothic16', monospace;
        }

        .font-display { font-family: var(--font-display); }
        .font-mono { font-family: var(--font-mono); }
        .font-sans { font-family: var(--font-sans); }
        .font-dot { font-family: var(--font-dot); }

        .bg-dot-grid {
          background-image: radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px);
          background-size: 24px 24px;
        }

        .bg-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E");
        }
      `}</style>

      {/* Fixed Atmospheric Grain */}
      <div className="fixed inset-0 pointer-events-none z-40 bg-noise" aria-hidden="true" />

      {/* Custom Precision Desktop Cursor Follower */}
      {!reducedMotion && cursorPos.visible && (
        <div
          aria-hidden="true"
          className="fixed top-0 left-0 z-50 pointer-events-none hidden lg:block transition-transform duration-75 ease-out"
          style={{
            transform: `translate3d(${cursorPos.x - 16}px, ${cursorPos.y - 16}px, 0)`,
          }}
        >
          <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-[#E62B2B]" />
          </div>
        </div>
      )}

      {/* STICKY NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('home');
            }}
            className="group flex items-center gap-2.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#E62B2B]"
          >
            <DotMatrixBadge active={data.isAvailable} />
            <span className="font-dot text-lg sm:text-xl tracking-[0.18em] text-[#F5F5F5] group-hover:text-[#E62B2B] transition-colors">
              {data.monogram}
            </span>
          </a>

          <nav aria-label="Primary Navigation" className="hidden lg:flex items-center gap-2">
            {[
              { id: 'home', label: 'Home', num: '00' },
              { id: 'about', label: 'About', num: '01' },
              { id: 'projects', label: 'Projects', num: '02' },
              { id: 'skills', label: 'Skills', num: '03' },
              { id: 'process', label: 'Process', num: '04' },
              { id: 'contact', label: 'Contact', num: '05' },
            ].map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.id);
                  }}
                  className={`relative px-3.5 py-2 font-mono text-xs uppercase tracking-[0.16em] transition-colors group ${
                    isActive ? 'text-[#F5F5F5]' : 'text-[#888888] hover:text-[#F5F5F5]'
                  }`}
                >
                  <span className="text-[9px] text-[#555555] mr-1 group-hover:text-[#E62B2B] transition-colors">
                    {item.num}.
                  </span>
                  {item.label}
                  <span
                    className={`absolute bottom-0 left-3.5 right-3.5 h-[2px] transition-all duration-300 ${
                      isActive
                        ? 'bg-[#E62B2B] scale-x-100'
                        : 'bg-white/40 scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-white/10 bg-[#0A0A0A] font-mono text-[10px] tracking-[0.16em] text-[#F5F5F5]">
              <span className="w-2 h-2 rounded-full bg-[#E62B2B] animate-pulse" />
              <span>{data.availabilityText}</span>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
              className="lg:hidden p-2.5 border border-white/15 bg-[#0A0A0A] text-[#F5F5F5] hover:border-[#E62B2B] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Minimalist Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-[#050505] px-4 py-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10 font-mono text-[10px] tracking-[0.16em] text-[#F5F5F5]">
              <span className="w-2 h-2 rounded-full bg-[#E62B2B]" />
              <span>{data.availabilityText}</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {[
                { id: 'home', label: 'Home', num: '00' },
                { id: 'about', label: 'About', num: '01' },
                { id: 'projects', label: 'Projects', num: '02' },
                { id: 'skills', label: 'Skills', num: '03' },
                { id: 'process', label: 'Process', num: '04' },
                { id: 'contact', label: 'Contact', num: '05' },
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.id);
                  }}
                  className="flex items-center justify-between py-2.5 px-3 border border-white/10 bg-[#0A0A0A] font-mono text-xs tracking-[0.18em] uppercase text-[#F5F5F5] hover:border-[#E62B2B]"
                >
                  <span>
                    <span className="text-[#888888] mr-2">[{item.num}]</span>
                    {item.label}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#E62B2B]" />
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="max-w-[1440px] mx-auto border-x border-white/10 bg-dot-grid relative">
        {/* HERO SECTION */}
        <section
          id="home"
          className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between border-b border-white/10"
        >
          <div className="px-4 sm:px-8 py-3 border-b border-white/10 flex items-center justify-between font-mono text-[10px] tracking-[0.18em] text-[#888888]">
            <span>INDEX // 00 — PORTFOLIO SYSTEM</span>
            <span>{utcTime}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 p-6 sm:p-10 lg:p-14 items-center my-auto">
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-2.5 px-3 py-1 border border-white/15 bg-[#0A0A0A] font-mono text-[10px] tracking-[0.2em] uppercase text-[#888888]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E62B2B]" />
                <span>CREATIVE DEVELOPER &amp; FULL STACK ENGINEER</span>
              </div>

              <div className="space-y-1 sm:space-y-2">
                {heroLines.map((line, lineIdx) => (
                  <div key={lineIdx} className="overflow-hidden">
                    <h1
                      style={{
                        transitionDelay: reducedMotion ? '0ms' : `${lineIdx * 120}ms`,
                      }}
                      className={`font-display font-bold uppercase tracking-[-0.04em] leading-[0.92] text-[clamp(2.65rem,7.2vw,6.4rem)] text-[#F5F5F5] flex items-baseline gap-3 transition-all duration-700 ease-out ${
                        heroMounted || reducedMotion
                          ? 'opacity-100 translate-y-0'
                          : 'opacity-0 translate-y-full'
                      }`}
                    >
                      <span>{line}</span>
                      {lineIdx === 2 && (
                        <span
                          className="inline-block w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-[#E62B2B] shrink-0"
                          aria-hidden="true"
                        />
                      )}
                    </h1>
                  </div>
                ))}
              </div>

              <Reveal delayMs={350} reducedMotion={reducedMotion}>
                <div className="max-w-xl border-l-2 border-[#E62B2B] pl-4 sm:pl-6 py-1">
                  <p className="font-sans text-base sm:text-lg text-[#888888] leading-relaxed">
                    {data.heroIntro}
                  </p>
                </div>
              </Reveal>

              <Reveal delayMs={500} reducedMotion={reducedMotion}>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <a
                    href="#projects"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('projects');
                    }}
                    className="group relative inline-flex items-center gap-3 px-6 py-4 bg-[#F5F5F5] text-[#000000] font-mono text-xs font-medium tracking-[0.18em] uppercase border border-[#F5F5F5] hover:bg-transparent hover:text-[#F5F5F5] transition-all duration-300"
                  >
                    <span>[ EXPLORE PROJECTS</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#E62B2B]" />
                    <span>]</span>
                  </a>

                  <a
                    href="#contact"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('contact');
                    }}
                    className="group relative inline-flex items-center gap-3 px-6 py-4 bg-[#0A0A0A] text-[#F5F5F5] font-mono text-xs tracking-[0.18em] uppercase border border-white/20 hover:border-[#E62B2B] transition-all duration-300"
                  >
                    <span>[ LET&apos;S CONNECT</span>
                    <ArrowUpRight className="w-4 h-4 text-[#888888] group-hover:text-[#E62B2B] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    <span>]</span>
                  </a>
                </div>
              </Reveal>
            </div>

            <Reveal delayMs={250} reducedMotion={reducedMotion} className="lg:col-span-5">
              <InteractiveDotMatrix
                mode="orb"
                onModeChange={() => {}}
                reducedMotion={reducedMotion}
              />
            </Reveal>
          </div>

          <div className="border-t border-white/10 px-4 sm:px-8 py-4 flex items-center justify-between font-mono text-[10px] tracking-[0.2em] uppercase text-[#888888]">
            <span>SCROLL TO EXPLORE</span>

            <button
              type="button"
              onClick={() => scrollToSection('about')}
              className="group flex items-center gap-2 text-[#F5F5F5] hover:text-[#E62B2B] transition-colors"
            >
              <span>[ 01 — ABOUT ]</span>
              <span className="inline-flex flex-col items-center justify-center w-4 h-6 border border-white/20 rounded-full p-0.5">
                <span className="w-1 h-1.5 rounded-full bg-[#E62B2B] animate-bounce" />
              </span>
            </button>
          </div>
        </section>

        <section id="about" className="relative border-b border-white/10">
          <div className="px-4 sm:px-8 py-4 border-b border-white/10 flex items-center justify-between font-mono text-xs tracking-[0.2em]">
            <span className="text-[#F5F5F5] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E62B2B]" />
              [ 01 — ABOUT ]
            </span>
            <span className="text-[10px] text-[#888888]">PROFILE // SPECIFICATIONS</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-8 p-6 sm:p-10 lg:p-14 border-b lg:border-b-0 lg:border-r border-white/10 space-y-10">
              <Reveal reducedMotion={reducedMotion} className="space-y-6">
                <h2 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl uppercase tracking-[-0.03em] leading-[0.96] text-[#F5F5F5]">
                  {data.aboutHeadline[0]}
                  <br />
                  <span className="text-[#888888]">{data.aboutHeadline[1]}</span>
                </h2>

                <p className="font-sans text-base sm:text-lg text-[#888888] leading-relaxed max-w-2xl">
                  {data.aboutDescription}
                </p>
              </Reveal>

              <div className="border-t border-l border-white/10 grid grid-cols-1 sm:grid-cols-2">
                {(
                  [
                    { key: 'name', label: '01 // NAME' },
                    { key: 'role', label: '02 // ROLE' },
                    { key: 'location', label: '03 // LOCATION' },
                    { key: 'focus', label: '04 // CURRENT FOCUS' },
                    { key: 'experience', label: '05 // EXPERIENCE' },
                    { key: 'availability', label: '06 // AVAILABILITY' },
                  ] as { key: keyof PortfolioData['profile']; label: string }[]
                ).map((field) => (
                  <div
                    key={field.key}
                    className="p-4 sm:p-5 border-r border-b border-white/10 bg-[#050505]/70 hover:bg-[#0A0A0A] transition-colors relative"
                  >
                    <Crosshair className="absolute top-1.5 right-2" />
                    <div className="font-mono text-[10px] tracking-[0.18em] text-[#888888] mb-2">
                      {field.label}
                    </div>
                    <div className="font-mono text-xs sm:text-sm text-[#F5F5F5] tracking-[0.06em] break-words">
                      {data.profile[field.key]}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 p-6 sm:p-10 bg-[#060606] flex flex-col justify-between space-y-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <div className="font-mono text-[10px] tracking-[0.2em] text-[#E62B2B] uppercase">
                      SYSTEM TELEMETRY
                    </div>
                    <div className="font-dot text-lg tracking-[0.14em] text-[#F5F5F5] mt-0.5">
                      NODE.ARCH // v2.5
                    </div>
                  </div>
                  <Cpu className="w-5 h-5 text-[#888888]" />
                </div>

                <div className="p-6 border border-white/10 bg-[#000000] flex flex-col items-center justify-center space-y-4">
                  <div className="grid grid-cols-5 gap-3 py-2" aria-hidden="true">
                    {[
                      1, 0, 1, 0, 1,
                      0, 1, 1, 1, 0,
                      1, 1, 1, 1, 1,
                      0, 1, 1, 1, 0,
                      1, 0, 1, 0, 1,
                    ].map((val, idx) => (
                      <span
                        key={idx}
                        className={`w-2.5 h-2.5 rounded-full ${
                          idx === 12
                            ? 'bg-[#E62B2B] shadow-[0_0_8px_rgba(230,43,43,0.7)]'
                            : val === 1
                            ? 'bg-[#F5F5F5]'
                            : 'bg-[#1A1A1A]'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="w-full pt-3 border-t border-white/10 flex items-center justify-between font-mono text-[10px] tracking-[0.16em] text-[#888888]">
                    <span>CORE ARCHITECTURE</span>
                    <span className="text-[#F5F5F5]">OPERATIONAL</span>
                  </div>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between py-2 border-b border-white/10">
                    <span className="text-[#888888]">DESIGN SYSTEM</span>
                    <span className="text-[#F5F5F5]">SWISS / MONOCHROME</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-white/10">
                    <span className="text-[#888888]">PERFORMANCE</span>
                    <span className="text-[#F5F5F5]">60FPS MOTION</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-white/10">
                    <span className="text-[#888888]">STATUS</span>
                    <span className="text-[#E62B2B]">● READY FOR DEPLOYMENT</span>
                  </div>
                </div>
              </div>

              <div className="font-mono text-[10px] tracking-[0.16em] text-[#666666] uppercase">
                SYS.VERIFIED // PRODUCTION BUILD
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="relative border-b border-white/10">
          <div className="px-4 sm:px-8 py-4 border-b border-white/10 flex items-center justify-between font-mono text-xs tracking-[0.2em]">
            <span className="text-[#F5F5F5] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E62B2B]" />
              [ 02 — SELECTED WORK ]
            </span>
            <span className="text-[10px] text-[#888888]">ARCHIVE // 01 — 04</span>
          </div>

          <div className="p-6 sm:p-10 lg:p-14 border-b border-white/10">
            <Reveal reducedMotion={reducedMotion}>
              <h2 className="font-display font-bold text-4xl sm:text-6xl lg:text-7xl uppercase tracking-[-0.03em] leading-[0.94] text-[#F5F5F5]">
                LESS TALK.
                <br />
                <span className="text-[#888888]">MORE MAKING.</span>
              </h2>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {data.projects.map((project, index) => (
              <Reveal
                key={project.id}
                delayMs={(index % 2) * 100}
                reducedMotion={reducedMotion}
                className={`group relative flex flex-col justify-between border-b border-white/10 ${
                  index % 2 === 0 ? 'md:border-r border-white/10' : ''
                } bg-[#030303] hover:bg-[#080808] transition-colors duration-300`}
              >
                <div>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <ProjectVisualPreview
                      type={project.visualType}
                      number={project.number}
                    />
                  </a>

                  <div className="p-6 sm:p-8 space-y-4">
                    <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.18em] text-[#888888]">
                      <span className="text-[#E62B2B] font-medium">
                        {project.number} / {project.category}
                      </span>
                      <span>{project.year}</span>
                    </div>

                    <h3 className="font-display font-bold text-2xl sm:text-3xl uppercase tracking-[-0.02em] text-[#F5F5F5]">
                      {project.title}
                    </h3>

                    <p className="font-sans text-sm sm:text-base text-[#888888] leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {project.technologies.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-1 bg-[#0C0C0C] border border-white/10 font-mono text-[10px] tracking-[0.14em] uppercase text-[#F5F5F5]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-6 sm:px-8 py-4 border-t border-white/10 bg-[#060606] flex items-center justify-between font-mono text-xs tracking-[0.16em] uppercase">
                  <div className="flex items-center gap-5">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[#F5F5F5] hover:text-[#E62B2B] transition-colors group/link"
                    >
                      <span>LIVE PROJECT</span>
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                    </a>

                    <a
                      href={project.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[#888888] hover:text-[#F5F5F5] transition-colors"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>SOURCE</span>
                    </a>
                  </div>

                  <span className="text-[10px] text-[#555555]">
                    [ DEPLOYED ]
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="skills" className="relative border-b border-white/10">
          <div className="px-4 sm:px-8 py-4 border-b border-white/10 flex items-center justify-between font-mono text-xs tracking-[0.2em]">
            <span className="text-[#F5F5F5] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E62B2B]" />
              [ 03 — CAPABILITIES ]
            </span>
            <span className="text-[10px] text-[#888888]">TECHNICAL INVENTORY</span>
          </div>

          <div className="p-6 sm:p-10 lg:p-14 border-b border-white/10">
            <Reveal reducedMotion={reducedMotion}>
              <h2 className="font-display font-bold text-4xl sm:text-6xl lg:text-7xl uppercase tracking-[-0.03em] leading-[0.94] text-[#F5F5F5]">
                TOOLS ARE
                <br />
                <span className="text-[#888888]">JUST THE BEGINNING.</span>
              </h2>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
            {data.skillCategories.map((category) => (
              <div
                key={category.id}
                className="p-6 sm:p-8 lg:p-10 bg-[#040404] flex flex-col justify-between space-y-8"
              >
                <div className="space-y-6">
                  <div className="border-b border-white/10 pb-4 space-y-1">
                    <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-[#E62B2B]">
                      <span>{category.code}</span>
                      <span>[{String(category.skills.length).padStart(2, '0')}]</span>
                    </div>
                    <h3 className="font-display font-bold text-2xl uppercase tracking-[-0.02em] text-[#F5F5F5]">
                      {category.title}
                    </h3>
                    <p className="font-mono text-[10px] tracking-[0.14em] text-[#888888]">
                      {category.subtitle}
                    </p>
                  </div>

                  <ul className="divide-y divide-white/10 border-y border-white/10">
                    {category.skills.map((skill, sIdx) => (
                      <li
                        key={skill}
                        className="group py-3.5 px-2 flex items-center justify-between hover:bg-white/[0.03] transition-colors"
                      >
                        <div className="flex items-center gap-3.5">
                          <span className="font-mono text-[10px] tracking-[0.16em] text-[#666666] group-hover:text-[#E62B2B] transition-colors">
                            {String(sIdx + 1).padStart(2, '0')}
                          </span>
                          <span className="font-sans text-sm sm:text-base font-medium text-[#F5F5F5] group-hover:translate-x-1 transition-transform">
                            {skill}
                          </span>
                        </div>
                        <span className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-[#E62B2B] transition-colors" />
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 flex items-center justify-between font-mono text-[10px] tracking-[0.16em] text-[#555555] uppercase">
                  <span>MODULE // ACTIVE</span>
                  <span>100% VERIFIED</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="process" className="relative border-b border-white/10">
          <div className="px-4 sm:px-8 py-4 border-b border-white/10 flex items-center justify-between font-mono text-xs tracking-[0.2em]">
            <span className="text-[#F5F5F5] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E62B2B]" />
              [ 04 — PROCESS ]
            </span>
            <span className="text-[10px] text-[#888888]">EXECUTION PROTOCOL</span>
          </div>

          <div className="p-6 sm:p-10 lg:p-14 border-b border-white/10">
            <Reveal reducedMotion={reducedMotion}>
              <h2 className="font-display font-bold text-4xl sm:text-6xl uppercase tracking-[-0.03em] leading-[0.94] text-[#F5F5F5]">
                THOUGHTFUL BY DESIGN.
                <br />
                <span className="text-[#888888]">PRECISE BY EXECUTION.</span>
              </h2>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {PROCESS_STAGES.map((stage, idx) => {
              const isSelected = activeProcessIndex === idx;
              return (
                <Reveal
                  key={stage.number}
                  delayMs={idx * 90}
                  reducedMotion={reducedMotion}
                  className={`p-6 sm:p-8 flex flex-col justify-between space-y-10 cursor-pointer transition-colors relative ${
                    isSelected ? 'bg-[#0A0A0A]' : 'bg-[#030303] hover:bg-[#080808]'
                  }`}
                >
                  <div
                    onMouseEnter={() => setActiveProcessIndex(idx)}
                    onClick={() => setActiveProcessIndex(idx)}
                    className="h-full flex flex-col justify-between space-y-10"
                  >
                    <div
                      className={`absolute top-0 left-0 right-0 h-[2px] transition-colors duration-300 ${
                        idx <= activeProcessIndex ? 'bg-[#E62B2B]' : 'bg-transparent'
                      }`}
                    />

                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs tracking-[0.2em] text-[#E62B2B]">
                          {stage.number} — {stage.title}
                        </span>

                        <div
                          className="grid grid-cols-5 gap-[2px] p-1.5 border border-white/10 bg-black"
                          aria-hidden="true"
                        >
                          {stage.glyphPattern.map((bit, bIdx) => (
                            <span
                              key={bIdx}
                              className={`w-1 h-1 rounded-full ${
                                bit === 1
                                  ? isSelected && bIdx === 12
                                    ? 'bg-[#E62B2B]'
                                    : 'bg-[#F5F5F5]'
                                  : 'bg-[#222222]'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <h3 className="font-display font-bold text-2xl sm:text-3xl uppercase tracking-[-0.02em] text-[#F5F5F5]">
                        {stage.title}
                      </h3>

                      <p className="font-sans text-sm sm:text-base text-[#888888] leading-relaxed">
                        {stage.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/10 space-y-2">
                      {stage.deliverables.map((item) => (
                        <div
                          key={item}
                          className="font-mono text-[10px] tracking-[0.14em] text-[#888888] flex items-center gap-2"
                        >
                          <span
                            className={`w-1 h-1 rounded-full ${
                              isSelected ? 'bg-[#E62B2B]' : 'bg-[#555555]'
                            }`}
                          />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        <section id="contact" className="relative">
          <div className="px-4 sm:px-8 py-4 border-b border-white/10 flex items-center justify-between font-mono text-xs tracking-[0.2em]">
            <span className="text-[#F5F5F5] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E62B2B]" />
              [ 05 — GET IN TOUCH ]
            </span>
            <span className="text-[10px] text-[#888888]">● {data.availabilityText}</span>
          </div>

          <div className="p-6 sm:p-10 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-7 space-y-8">
              <Reveal reducedMotion={reducedMotion}>
                <h2 className="font-display font-bold text-4xl sm:text-6xl lg:text-7xl uppercase tracking-[-0.03em] leading-[0.94] text-[#F5F5F5]">
                  HAVE AN IDEA?
                  <br />
                  <span className="text-[#888888]">LET&apos;S MAKE IT REAL.</span>
                </h2>
              </Reveal>

              <p className="font-sans text-base sm:text-lg text-[#888888] max-w-xl leading-relaxed">
                {data.contact.message}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href={`mailto:${data.contact.email}`}
                  className="group inline-flex items-center gap-4 px-7 py-4 bg-[#F5F5F5] text-black font-mono text-xs sm:text-sm font-medium tracking-[0.16em] uppercase border border-[#F5F5F5] hover:bg-transparent hover:text-[#F5F5F5] transition-all duration-300"
                >
                  <Mail className="w-4 h-4 text-[#E62B2B]" />
                  <span>{data.contact.email}</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="px-5 py-4 bg-[#0A0A0A] border border-white/15 text-[#F5F5F5] hover:border-[#E62B2B] font-mono text-xs tracking-[0.15em] uppercase transition-colors inline-flex items-center gap-2"
                >
                  {emailCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#E62B2B]" />
                      <span>COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#888888]" />
                      <span>COPY EMAIL</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-3">
              <div className="font-mono text-[10px] tracking-[0.2em] text-[#888888] uppercase pb-2 border-b border-white/10">
                EXTERNAL CHANNELS // SOCIAL NETWORKS
              </div>

              {(
                [
                  { key: 'github', label: '01 // GITHUB' },
                  { key: 'linkedin', label: '02 // LINKEDIN' },
                  { key: 'instagram', label: '03 // INSTAGRAM' },
                ] as { key: keyof PortfolioData['contact']['socials']; label: string }[]
              ).map((soc) => (
                <a
                  key={soc.key}
                  href={data.contact.socials[soc.key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 border border-white/10 bg-[#060606] hover:border-[#E62B2B] flex items-center justify-between group transition-colors"
                >
                  <span className="font-mono text-xs tracking-[0.18em] text-[#F5F5F5]">
                    {soc.label}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-[#888888] group-hover:text-[#E62B2B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="max-w-[1440px] mx-auto border-x border-t border-b border-white/10 bg-[#030303] px-4 sm:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pb-8 border-b border-white/10">
          <div className="md:col-span-5 space-y-2">
            <div className="flex items-center gap-2.5">
              <DotMatrixBadge active={data.isAvailable} />
              <span className="font-dot text-lg tracking-[0.18em] text-[#F5F5F5]">
                {data.monogram}
              </span>
            </div>
            <p className="font-mono text-[11px] tracking-[0.18em] text-[#888888] uppercase leading-relaxed">
              DESIGNED WITH INTENTION.
              <br />
              BUILT WITH PRECISION.
            </p>
          </div>

          <div className="md:col-span-4 flex flex-wrap items-center gap-6 font-mono text-xs tracking-[0.16em] uppercase">
            <a
              href={data.contact.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#888888] hover:text-[#F5F5F5] transition-colors inline-flex items-center gap-1"
            >
              <span>GITHUB</span>
              <ArrowUpRight className="w-3 h-3 text-[#E62B2B]" />
            </a>
            <a
              href={data.contact.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#888888] hover:text-[#F5F5F5] transition-colors inline-flex items-center gap-1"
            >
              <span>LINKEDIN</span>
              <ArrowUpRight className="w-3 h-3 text-[#E62B2B]" />
            </a>
            <a
              href={data.contact.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#888888] hover:text-[#F5F5F5] transition-colors inline-flex items-center gap-1"
            >
              <span>INSTAGRAM</span>
              <ArrowUpRight className="w-3 h-3 text-[#E62B2B]" />
            </a>
          </div>

          <div className="md:col-span-3 flex md:justify-end">
            <button
              type="button"
              onClick={() => scrollToSection('home')}
              className="group px-4 py-2.5 border border-white/15 bg-[#0A0A0A] hover:border-[#E62B2B] font-mono text-[10px] tracking-[0.18em] uppercase text-[#F5F5F5] inline-flex items-center gap-2 transition-colors"
            >
              <span>BACK TO TOP</span>
              <ArrowUp className="w-3.5 h-3.5 text-[#E62B2B] group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-[10px] tracking-[0.18em] text-[#888888] uppercase">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E62B2B] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E62B2B]" />
            </span>
            <span>© {currentYear} — ALL RIGHTS RESERVED.</span>
          </div>

          <div className="flex items-center gap-4 text-[#666666]">
            <span>SYS.STATUS // OPERATIONAL</span>
            <span>•</span>
            <span>{utcTime}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;