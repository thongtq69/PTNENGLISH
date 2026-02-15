"use client";

import { useEffect, useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

// ═══════════════════════════════════════════════
// 🐴 TẾT BÍNH NGỌ 2026 — MÃ ĐÁO THÀNH CÔNG
// ═══════════════════════════════════════════════

// ── Hoa Mai & Móng ngựa vàng rơi ──
const FALLING_ITEMS = ["🌸", "🏵️", "✿", "🌼", "🧧", "�"];

interface FallingItem {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  shape: string;
  swayAmount: number;
  opacity: number;
}

function generateItems(count: number): FallingItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 18,
    duration: 10 + Math.random() * 14,
    size: 10 + Math.random() * 14,
    shape: FALLING_ITEMS[Math.floor(Math.random() * FALLING_ITEMS.length)],
    swayAmount: 20 + Math.random() * 50,
    opacity: 0.3 + Math.random() * 0.4,
  }));
}

const FallingPetals = memo(function FallingPetals() {
  const [items, setItems] = useState<FallingItem[]>([]);
  useEffect(() => { setItems(generateItems(16)); }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {items.map((p) => (
        <motion.div
          key={p.id}
          className="absolute select-none"
          style={{ left: `${p.x}%`, top: -30, fontSize: p.size }}
          animate={{
            y: [0, typeof window !== "undefined" ? window.innerHeight + 50 : 1200],
            x: [0, p.swayAmount, -p.swayAmount / 2, p.swayAmount / 3, 0],
            rotate: [0, 180, 360],
            opacity: [0, p.opacity, p.opacity, 0],
          }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
        >
          {p.shape}
        </motion.div>
      ))}
    </div>
  );
});

// ── 🐎 Ngựa phi ngang màn hình ──
const GallopingHorse = memo(function GallopingHorse() {
  const [horses, setHorses] = useState<{ id: number; y: number; speed: number; size: number; flip: boolean }[]>([]);

  useEffect(() => {
    let counter = 0;
    const spawn = () => {
      const id = counter++;
      const flip = Math.random() > 0.5;
      setHorses(prev => [
        ...prev.slice(-3),
        {
          id,
          y: 15 + Math.random() * 60, // % from top
          speed: 4 + Math.random() * 4,
          size: 28 + Math.random() * 20,
          flip,
        },
      ]);
    };
    spawn();
    const interval = setInterval(spawn, 8000 + Math.random() * 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9996] overflow-hidden">
      {horses.map((h) => (
        <motion.div
          key={h.id}
          className="absolute select-none"
          style={{
            top: `${h.y}%`,
            fontSize: h.size,
            filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.2))",
            transform: h.flip ? "scaleX(-1)" : "scaleX(1)",
          }}
          initial={{ x: h.flip ? "100vw" : "-80px", opacity: 0 }}
          animate={{
            x: h.flip ? "-80px" : "100vw",
            opacity: [0, 1, 1, 1, 0],
          }}
          transition={{ duration: h.speed, ease: "linear" }}
        >
          <div className="relative">
            {/* Horse */}
            <span className="inline-block animate-bounce" style={{ animationDuration: "0.3s" }}>🐎</span>
            {/* Dust trail */}
            <motion.span
              className="absolute -bottom-1 text-[10px] opacity-40"
              style={{ [h.flip ? "right" : "left"]: -15 }}
              animate={{ opacity: [0.4, 0, 0.3, 0] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            >
              💨
            </motion.span>
          </div>
        </motion.div>
      ))}
    </div>
  );
});

// ── Pháo hoa ──
function Firework({ x, y, color }: { x: number; y: number; color: string }) {
  const particles = Array.from({ length: 10 }, (_, i) => {
    const angle = (i / 10) * Math.PI * 2;
    const dist = 35 + Math.random() * 50;
    return { id: i, dx: Math.cos(angle) * dist, dy: Math.sin(angle) * dist };
  });
  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: x, top: y,
            width: 3 + Math.random() * 3, height: 3 + Math.random() * 3,
            backgroundColor: color,
            boxShadow: `0 0 6px ${color}, 0 0 10px ${color}`,
          }}
          initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          animate={{ x: p.dx, y: p.dy, opacity: [1, 1, 0], scale: [1, 1.2, 0] }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      ))}
    </>
  );
}

const FIREWORK_COLORS = ["#FFD700", "#FF6B6B", "#FF1744", "#FFC107", "#FF9100", "#E91E63"];

const Fireworks = memo(function Fireworks() {
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number; color: string }[]>([]);
  useEffect(() => {
    let counter = 0;
    const spawn = () => {
      const id = counter++;
      setBursts(prev => [
        ...prev.slice(-4),
        {
          id,
          x: 60 + Math.random() * (typeof window !== "undefined" ? window.innerWidth - 120 : 700),
          y: 40 + Math.random() * 250,
          color: FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)],
        },
      ]);
    };
    spawn();
    const interval = setInterval(spawn, 3000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9998] overflow-hidden">
      {bursts.map((b) => <Firework key={b.id} x={b.x} y={b.y} color={b.color} />)}
    </div>
  );
});

// ── 🏮 Banner "Mã Đáo Thành Công" ──
const TetBanner = memo(function TetBanner() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!sessionStorage.getItem("tet-banner-2026")) setVisible(true);
  }, []);
  const dismiss = useCallback(() => {
    setVisible(false);
    sessionStorage.setItem("tet-banner-2026", "1");
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="fixed top-0 left-0 right-0 z-[10000]"
        >
          {/* Main banner */}
          <div className="bg-gradient-to-r from-red-800 via-red-700 to-red-800 relative overflow-hidden">
            {/* Cloud pattern overlay */}
            <div className="absolute inset-0 opacity-[0.06]" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 10c-5 0-10 5-10 10s5 10 10 10 10-5 10-10-5-10-10-10z' fill='%23fff' fill-opacity='.3'/%3E%3C/svg%3E")`,
            }} />

            <div className="container mx-auto px-4 py-2 sm:py-2.5 flex items-center justify-center gap-2 sm:gap-4 relative">
              {/* Left horse */}
              <motion.span
                className="text-lg sm:text-2xl"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                🐴
              </motion.span>

              <span className="text-base sm:text-xl animate-bounce" style={{ animationDuration: "2s" }}>🏮</span>

              {/* Center message */}
              <div className="text-center min-w-0">
                <p className="text-yellow-300 font-heading font-bold text-[11px] sm:text-sm md:text-base tracking-wide whitespace-nowrap">
                  ✨ Mã Đáo Thành Công ✨
                </p>
                <p className="text-red-200/70 text-[7px] sm:text-[9px] font-medium tracking-wider">
                  Năm Bính Ngọ 2026 · PTN English kính chúc An Khang Thịnh Vượng
                </p>
              </div>

              <span className="text-base sm:text-xl animate-bounce" style={{ animationDuration: "2s", animationDelay: "0.5s" }}>🏮</span>

              {/* Right horse */}
              <motion.span
                className="text-lg sm:text-2xl"
                style={{ transform: "scaleX(-1)" }}
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
              >
                🐴
              </motion.span>

              {/* Close */}
              <button
                onClick={dismiss}
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-1 rounded-full hover:bg-white/10 transition-all"
              >
                <X size={14} />
              </button>
            </div>

            {/* Gold border bottom */}
            <div className="h-[2px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-50" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

// ── 📜 Câu đối — theme Mã Đáo ──
const CauDoi = memo(function CauDoi() {
  return (
    <>
      {/* Left scroll */}
      <div className="fixed left-0 top-24 z-[9997] pointer-events-none hidden lg:block">
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6, type: "spring" }}
        >
          <div className="relative">
            {/* Gold cap top */}
            <div className="w-8 h-2 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-tr-sm shadow-md" />
            {/* Scroll body */}
            <div className="bg-gradient-to-b from-red-700 to-red-800 px-1.5 py-4 shadow-xl border-r border-yellow-600/30 w-8">
              <p className="text-yellow-300 text-[10px] font-bold tracking-[0.4em] leading-[1.8]" style={{ writingMode: "vertical-rl" }}>
                馬到成功
              </p>
            </div>
            {/* Gold cap bottom */}
            <div className="w-8 h-2 bg-gradient-to-t from-yellow-400 to-yellow-600 rounded-br-sm shadow-md" />
            {/* Tassel */}
            <motion.div
              className="w-1.5 h-6 bg-gradient-to-b from-yellow-500 to-red-500 mx-auto rounded-b-full"
              animate={{ rotate: [-3, 3, -3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>

      {/* Right scroll */}
      <div className="fixed right-0 top-24 z-[9997] pointer-events-none hidden lg:block">
        <motion.div
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.6, type: "spring" }}
        >
          <div className="relative">
            <div className="w-8 h-2 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-tl-sm shadow-md" />
            <div className="bg-gradient-to-b from-red-700 to-red-800 px-1.5 py-4 shadow-xl border-l border-yellow-600/30 w-8">
              <p className="text-yellow-300 text-[10px] font-bold tracking-[0.4em] leading-[1.8]" style={{ writingMode: "vertical-rl" }}>
                萬事如意
              </p>
            </div>
            <div className="w-8 h-2 bg-gradient-to-t from-yellow-400 to-yellow-600 rounded-bl-sm shadow-md" />
            <motion.div
              className="w-1.5 h-6 bg-gradient-to-b from-yellow-500 to-red-500 mx-auto rounded-b-full"
              animate={{ rotate: [3, -3, 3] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            />
          </div>
        </motion.div>
      </div>
    </>
  );
});

// ── Main Export ──
export default function TetEffects() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <>
      <TetBanner />
      <FallingPetals />
      <GallopingHorse />
      <Fireworks />
      <CauDoi />
    </>
  );
}
