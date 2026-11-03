"use client";

import Link from "next/link";
import { motion } from "motion/react";

const SIMBOL = [
  { s: "+", x: "6%", y: "62%", d: 0 },
  { s: "×", x: "88%", y: "58%", d: 0.7 },
  { s: "÷", x: "10%", y: "30%", d: 1.2 },
  { s: "=", x: "86%", y: "26%", d: 0.4 },
];

export default function Home() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-[url('/latar-hutan.png')] bg-cover bg-center md:bg-[url('/layar-peta.png')]">
      {/* Gradasi tipis biar teks tetap kebaca */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />

      {/* Simbol matematika melayang */}
      {SIMBOL.map((it) => (
        <motion.div
          key={it.s}
          className="pointer-events-none absolute text-4xl font-bold text-white sm:text-6xl"
          style={{
            left: it.x,
            top: it.y,
            textShadow: "0 4px 0 rgba(30,58,138,0.55)",
          }}
          animate={{ y: [0, -14, 0], rotate: [-8, 8, -8] }}
          transition={{
            duration: 3.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: it.d,
          }}
        >
          {it.s}
        </motion.div>
      ))}

      {/* Konten */}
      <div className="relative z-10 mx-auto grid min-h-dvh w-full max-w-md grid-cols-1 content-center items-center justify-items-center gap-4 px-6 py-8 md:max-w-6xl md:grid-cols-2 md:gap-x-12">
        {/* Logo */}
        <motion.img
          src="/logo-mathoo.png"
          alt="Mathoo"
          className="h-auto w-64 drop-shadow-2xl sm:w-80 md:col-start-1 md:row-start-1 md:w-[26rem] md:justify-self-center"
          initial={{ opacity: 0, scale: 0.6, y: -30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 12 }}
        />

        {/* Maskot */}
        <motion.div
          className="md:col-start-2 md:row-span-3 md:row-start-1"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, type: "spring", stiffness: 120, damping: 14 }}
        >
          <motion.img
            src="/maskot-senang.png"
            alt="Mathoo si gajah"
            className="h-60 w-auto object-contain drop-shadow-2xl sm:h-72 md:h-[26rem] lg:h-[30rem]"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="rounded-full border-2 border-[#c99a4b] bg-[#fff3d6]/95 px-5 py-2 text-center text-sm font-semibold text-[#6b4423] shadow-[0_4px_0_rgba(107,68,35,0.35)] sm:text-base md:col-start-1 md:row-start-2 md:text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Petualangan angka, jadi jagoan matematika
        </motion.p>

        {/* Tombol mulai */}
        <motion.div
          className="w-full max-w-xs md:col-start-1 md:row-start-3"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0, scale: [1, 1.04, 1] }}
          transition={{
            opacity: { delay: 0.6 },
            y: { delay: 0.6 },
            scale: { delay: 1.2, duration: 1.8, repeat: Infinity },
          }}
          whileTap={{ scale: 0.97 }}
        >
          <Link
            href="/kelas"
            className="block w-full rounded-2xl border-4 border-[#8a4b00] bg-gradient-to-b from-[#ffe066] to-[#ffb100] px-6 py-4 text-center text-xl font-bold text-[#5a2e00] shadow-[0_8px_0_#8a4b00] transition active:translate-y-2 active:shadow-[0_0_0_#8a4b00] sm:text-2xl"
          >
            ▶ Mulai Petualangan
          </Link>
        </motion.div>
      </div>
    </main>
  );
}