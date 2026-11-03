"use client";

import Link from "next/link";
import { motion } from "motion/react";

const KELAS = [
  {
    k: 3,
    fase: "Fase B",
    materi: "Tambah, kurang, kali, bagi",
    warna: "from-[#8be04e] to-[#3fa21a]",
    tepi: "border-[#2d7a10] shadow-[0_8px_0_#2d7a10]",
  },
  {
    k: 4,
    fase: "Fase B",
    materi: "Bilangan sampai 10.000",
    warna: "from-[#5cd0ff] to-[#1c8fe0]",
    tepi: "border-[#0f5fa3] shadow-[0_8px_0_#0f5fa3]",
  },
  {
    k: 5,
    fase: "Fase C",
    materi: "Pecahan dan desimal",
    warna: "from-[#ffc857] to-[#f08a00]",
    tepi: "border-[#9a5200] shadow-[0_8px_0_#9a5200]",
  },
  {
    k: 6,
    fase: "Fase C",
    materi: "Pecahan campuran",
    warna: "from-[#ff8fb3] to-[#e0457f]",
    tepi: "border-[#9c2656] shadow-[0_8px_0_#9c2656]",
  },
];

export default function PilihKelas() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-[url('/latar-hutan.png')] bg-cover bg-center md:bg-[url('/layar-peta.png')]">
      <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/5 to-black/35" />

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col gap-5 px-5 py-5 sm:py-8 md:max-w-5xl md:gap-8">
        {/* Kembali */}
        <Link
          href="/"
          className="self-start rounded-xl border-2 border-[#c99a4b] bg-[#fff3d6] px-4 py-2 text-sm font-bold text-[#6b4423] shadow-[0_4px_0_rgba(107,68,35,0.4)] transition active:translate-y-1 active:shadow-none sm:text-base"
        >
          ← Kembali
        </Link>

        {/* Maskot + dialog */}
        <div className="flex items-end justify-center gap-2 sm:gap-6">
          <motion.img
            src="/maskot-senang.png"
            alt="Mathoo"
            className="h-32 w-auto shrink-0 object-contain drop-shadow-2xl sm:h-44 md:h-56"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0, y: [0, -8, 0] }}
            transition={{
              opacity: { duration: 0.4 },
              x: { type: "spring", stiffness: 140, damping: 14 },
              y: { duration: 2.6, repeat: Infinity, ease: "easeInOut" },
            }}
          />
          <motion.div
            className="relative mb-6 max-w-[15rem] rounded-3xl border-4 border-[#c99a4b] bg-[#fff3d6] px-4 py-3 shadow-[0_6px_0_rgba(107,68,35,0.4)] sm:max-w-sm sm:px-6 sm:py-4"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            <div className="absolute -left-3 bottom-4 h-5 w-5 rotate-45 border-b-4 border-l-4 border-[#c99a4b] bg-[#fff3d6]" />
            <p className="text-lg font-bold leading-tight text-[#6b4423] sm:text-2xl md:text-3xl">
              Hai! Kamu kelas berapa?
            </p>
          </motion.div>
        </div>

        {/* Pilihan kelas */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
          {KELAS.map((it, i) => (
            <motion.div
              key={it.k}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.4 + i * 0.1,
                type: "spring",
                stiffness: 200,
                damping: 14,
              }}
              whileHover={{ y: -6, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                href={`/tutorial?kelas=${it.k}`}
                className={`flex h-full flex-col items-center gap-2 rounded-3xl border-4 bg-gradient-to-b p-4 text-center text-white transition active:translate-y-2 active:shadow-none sm:gap-3 sm:p-6 ${it.warna} ${it.tepi}`}
              >
                <span className="text-6xl font-black leading-none drop-shadow-[0_4px_0_rgba(0,0,0,0.3)] sm:text-7xl md:text-8xl">
                  {it.k}
                </span>
                <span className="text-xl font-bold drop-shadow-[0_2px_0_rgba(0,0,0,0.3)] sm:text-2xl">
                  Kelas {it.k}
                </span>
                <span className="text-xs font-semibold leading-tight text-white/95 sm:text-sm">
                  {it.materi}
                </span>
                <span className="mt-auto rounded-full bg-black/25 px-3 py-0.5 text-xs font-bold sm:text-sm">
                  {it.fase}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}