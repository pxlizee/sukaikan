"use client";
import { useState, useEffect } from 'react';

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    hari: 0, jam: 0, menit: 0, detik: 0
  });

  useEffect(() => {
    // Set target: Misal setiap Kamis jam 21:00 (WIB)
    const target = new Date();
    target.setDate(target.getDate() + (4 + 7 - target.getDay()) % 7);
    target.setHours(21, 0, 0, 0);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = target.getTime() - now;

      setTimeLeft({
        hari: Math.floor(distance / (1000 * 60 * 60 * 24)),
        jam: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        menit: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        detik: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const Box = ({ val, label }: { val: number, label: string }) => (
    <div className="flex flex-col items-center">
      <span className="text-2xl md:text-3xl font-black text-rose-500 tabular-nums">
        {val.toString().padStart(2, '0')}
      </span>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
  );

  return (
    <div className="inline-flex gap-6 bg-white/50 backdrop-blur-sm border border-rose-100 px-8 py-4 rounded-[32px] shadow-sm">
      <Box val={timeLeft.hari} label="Hari" />
      <span className="text-rose-200 font-bold self-center">:</span>
      <Box val={timeLeft.jam} label="Jam" />
      <span className="text-rose-200 font-bold self-center">:</span>
      <Box val={timeLeft.menit} label="Menit" />
      <span className="text-rose-200 font-bold self-center">:</span>
      <Box val={timeLeft.detik} label="Detik" />
    </div>
  );
}