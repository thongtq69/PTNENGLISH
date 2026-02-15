"use client";

import { useEffect, useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

// ── Hoa Mai/Đào rơi ──
const PETAL_COLORS = [
  "#FFD700", // vàng mai
  "#FFC107", // vàng đậm
  "#FFEB3B", // vàng nhạt
  "#FF6B6B", // hồng đào
  "#FF8A80", // hồng nhạt
  "#E91E63", // đỏ hồng
];

const PETAL_SHAPES = ["🌸", "🏵️", "✿", "❀", "🪷"];

interface Petal {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  color: string;
  shape: string;
  swayAmount: number;
  opacity: number;
}

function generatePetals(count: number): Petal[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 15,
    duration: 8 + Math.random() * 12,
    size: 12 + Math.random() * 18,
    color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
    shape: PETAL_SHAPES[Math.floor(Math.random() * PETAL_SHAPES.length)],
    swayAmount: 30 + Math.random() * 60,
    opacity: 0.4 + Math.random() * 0.5,
  }));
}

const FallingPetals = memo(function FallingPetals() {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    setPetals(generatePetals(20));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute select-none"
          style={{
            left: `${p.x}%`,
            top: -30,
            fontSize: p.size,
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
          }}
          animate={{
            y: [0, typeof window !== "undefined" ? window.innerHeight + 50 : 1200],
            x: [0, p.swayAmount, -p.swayAmount / 2, p.swayAmount / 3, 0],
            rotate: [0, 360, 180, 540],
            opacity: [0, p.opacity, p.opacity, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {p.shape}
        </motion.div>
      ))}
    </div>
  );
});

// ── Firework burst ──
function Firework({ x, y, color }: { x: number; y: number; color: string }) {
  const particles = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    const dist = 40 + Math.random() * 60;
    return {
      id: i,
      dx: Math.cos(angle) * dist,
      dy: Math.sin(angle) * dist,
    };
  });

  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: x,
            top: y,
            width: 4 + Math.random() * 4,
            height: 4 + Math.random() * 4,
            backgroundColor: color,
            boxShadow: `0 0 6px ${color}, 0 0 12px ${color}`,
          }}
          initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          animate={{
            x: p.dx,
            y: p.dy,
            opacity: [1, 1, 0],
            scale: [1, 1.2, 0],
          }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      ))}
    </>
  );
}

const FIREWORK_COLORS = ["#FFD700", "#FF6B6B", "#FF1744", "#E91E63", "#FFC107", "#00E676", "#FF9100"];

const Fireworks = memo(function Fireworks() {
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number; color: string }[]>([]);

  useEffect(() => {
    let counter = 0;
    const spawn = () => {
      const id = counter++;
      setBursts((prev) => [
        ...prev.slice(-6),
        {
          id,
          x: 50 + Math.random() * (typeof window !== "undefined" ? window.innerWidth - 100 : 800),
          y: 50 + Math.random() * 300,
          color: FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)],
        },
      ]);
    };

    // Initial burst
    spawn();
    const interval = setInterval(spawn, 2500 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9998] overflow-hidden">
      {bursts.map((b) => (
        <Firework key={b.id} x={b.x} y={b.y} color={b.color} />
      ))}
    </div>
  );
});

// ── Tet Banner ──
const TetBanner = memo(function TetBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("tet-banner-dismissed");
    if (!dismissed) setVisible(true);
  }, []);

  const dismiss = useCallback(() => {
    setVisible(false);
    sessionStorage.setItem("tet-banner-dismissed", "1");
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="fixed top-0 left-0 right-0 z-[10000] bg-gradient-to-r from-red-700 via-red-600 to-amber-600 shadow-2xl"
        >
          <div className="container mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-center gap-3 sm:gap-4 relative">
            {/* Lanterns */}
            <span className="text-xl sm:text-2xl animate-bounce" style={{ animationDelay: "0s" }}>🏮</span>

            {/* Message */}
            <div className="text-center">
              <p className="text-white font-heading font-bold text-xs sm:text-sm md:text-base tracking-wide">
                🧧 <span className="text-yellow-200">Chúc Mừng Năm Mới</span> — Happy Lunar New Year 2026! 🎊
              </p>
              <p className="text-red-100/80 text-[8px] sm:text-[10px] font-medium tracking-wider uppercase">
                Năm Bính Ngọ · PTN English kính chúc quý phụ huynh & học viên An Khang Thịnh Vượng 🐴
              </p>
            </div>

            <span className="text-xl sm:text-2xl animate-bounce" style={{ animationDelay: "0.3s" }}>🏮</span>

            {/* Close */}
            <button
              onClick={dismiss}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10 transition-all"
            >
              <X size={16} />
            </button>
          </div>

          {/* Decorative bottom border */}
          <div className="h-1 bg-gradient-to-r from-yellow-400 via-red-300 to-yellow-400 opacity-60" />
        </motion.div>
      )}
    </AnimatePresence>
  );
});

// ── Câu đối Tết (floating side scroll-downs) ──
const CauDoi = memo(function CauDoi() {
  return (
    <>
      {/* Left */}
      <div className="fixed left-0 top-20 z-[9997] pointer-events-none hidden lg:block">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="relative"
        >
          <div className="bg-red-700 text-yellow-300 px-2 py-6 rounded-r-lg shadow-xl border-r-2 border-b-2 border-yellow-500/40 writing-vertical">
            <p className="text-sm font-bold tracking-[0.5em] leading-relaxed" style={{ writingMode: "vertical-rl" }}>
              Tân Niên Hạnh Phúc
            </p>
          </div>
          <div className="absolute -top-1 left-0 right-0 h-3 bg-yellow-500 rounded-tr-lg" />
        </motion.div>
      </div>

      {/* Right */}
      <div className="fixed right-0 top-20 z-[9997] pointer-events-none hidden lg:block">
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="relative"
        >
          <div className="bg-red-700 text-yellow-300 px-2 py-6 rounded-l-lg shadow-xl border-l-2 border-b-2 border-yellow-500/40">
            <p className="text-sm font-bold tracking-[0.5em] leading-relaxed" style={{ writingMode: "vertical-rl" }}>
              Vạn Sự Như Ý
            </p>
          </div>
          <div className="absolute -top-1 left-0 right-0 h-3 bg-yellow-500 rounded-tl-lg" />
        </motion.div>
      </div>
    </>
  );
});

// ── Main export ──
export default function TetEffects() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <TetBanner />
      <FallingPetals />
      <Fireworks />
      <CauDoi />
    </>
  );
}
