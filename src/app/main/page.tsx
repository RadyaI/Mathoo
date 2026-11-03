"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";

const kayu =
  "border-4 border-[#c99a4b] bg-[#fff3d6] shadow-[0_6px_0_rgba(107,68,35,0.4)]";

function Main() {
  const sp = useSearchParams();
  const k = Number(sp.get("kelas"));
  const kelas = [3, 4, 5, 6].includes(k) ? k : 3;

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[url('/latar-hutan.png')] bg-cover bg-center md:bg-[url('/layar-peta.png')]">
      <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/5 to-black/40" />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-5 px-5 py-8 text-center">
        <motion.img
          src="/maskot-senang.png"
          alt="Mathoo"
          className="h-48 w-auto object-contain drop-shadow-2xl sm:h-60"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: [0, -12, 0] }}
          transition={{
            opacity: { duration: 0.4 },
            y: { duration: 2.6, repeat: Infinity, ease: "easeInOut" },
          }}
        />

        <motion.div
          className={`w-full rounded-3xl p-6 ${kayu}`}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 14 }}
        >
          <span className="inline-block rounded-full border-2 border-[#8a4b00] bg-[#ffd23f] px-4 py-0.5 text-sm font-bold text-[#5a2e00]">
            Segera Hadir
          </span>
          <h1 className="mt-3 text-3xl font-black text-[#6b4423] sm:text-4xl">
            Coming Soon
          </h1>
          <p className="mt-2 text-base font-semibold text-[#8a6a3a] sm:text-lg">
            Mathoo lagi nyiapin soal-soal seru buat Kelas {kelas}. Tunggu ya!
          </p>

          <Link
            href={`/peta?kelas=${kelas}`}
            className="mt-5 block w-full rounded-2xl border-4 border-[#8a4b00] bg-gradient-to-b from-[#ffe066] to-[#ffb100] px-6 py-3 text-xl font-bold text-[#5a2e00] shadow-[0_7px_0_#8a4b00] transition active:translate-y-2 active:shadow-none"
          >
            ← Kembali ke Peta
          </Link>
        </motion.div>
      </div>
    </main>
  );
}

export default function MainPage() {
  return (
    <Suspense fallback={null}>
      <Main />
    </Suspense>
  );
}