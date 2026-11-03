"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import confetti from "canvas-confetti";

type Pose = "senang" | "sedih";

const CERITA: { teks: string; pose: Pose; gelap?: boolean }[] = [
  {
    teks: "Halo! Aku Mathoo, gajah penjelajah dari Hutan Bilangan. Senang banget bisa ketemu kamu!",
    pose: "senang",
  },
  {
    teks: "Tapi ada masalah besar... Angin kencang meniup semua angka di hutanku sampai berhamburan ke mana-mana!",
    pose: "sedih",
    gelap: true,
  },
  {
    teks: "Cuma jagoan matematika yang bisa menyusun angka-angka itu lagi. Kamu mau bantu aku?",
    pose: "senang",
  },
  {
    teks: "Caranya gampang! Pilih jawaban yang benar. Kalau benar, kamu dapat poin dan bintang!",
    pose: "senang",
  },
  {
    teks: "Kalau salah, tenang aja. Nggak ada game over, aku bakal kasih petunjuk biar kamu paham.",
    pose: "senang",
  },
  {
    teks: "Yuk, latihan dulu sebelum berangkat petualangan!",
    pose: "senang",
  },
];

const SOAL: Record<
  number,
  { q: string; opsi: string[]; benar: number; petunjuk: string }
> = {
  3: {
    q: "Mathoo punya 125 apel. Ia mendapat 48 apel lagi dari temannya. Berapa apel Mathoo sekarang?",
    opsi: ["163", "173", "183"],
    benar: 1,
    petunjuk: "Jumlahkan satuannya dulu: 5 + 8 = 13. Tulis 3, simpan 1 ke puluhan.",
  },
  4: {
    q: "Toko Mathoo punya 2.350 permen. Hari ini terjual 1.275 permen. Berapa sisa permen?",
    opsi: ["1.075", "1.125", "1.175"],
    benar: 0,
    petunjuk: "Kurangi dari satuan dulu. Kalau angkanya tidak cukup, pinjam dari puluhan.",
  },
  5: {
    q: "Mathoo makan ½ potong kue di pagi hari dan ¼ potong di sore hari. Berapa potong kue yang dimakan Mathoo?",
    opsi: ["2/6", "3/4", "2/4"],
    benar: 1,
    petunjuk: "Samakan penyebutnya dulu. ½ sama dengan 2/4, jadi 2/4 + 1/4 = ?",
  },
  6: {
    q: "Mathoo punya 2½ liter air. Temannya memberi ½ liter lagi. Berapa liter air Mathoo sekarang?",
    opsi: ["2¼ liter", "2½ liter", "3 liter"],
    benar: 2,
    petunjuk: "½ + ½ = 1. Jadi tambahkan 1 ke 2, hasilnya berapa?",
  },
};

const ANGKA = [
  { n: "7", x: "12%", y: "16%" },
  { n: "3", x: "78%", y: "12%" },
  { n: "+", x: "58%", y: "28%" },
  { n: "12", x: "18%", y: "42%" },
  { n: "×", x: "84%", y: "40%" },
  { n: "5", x: "40%", y: "8%" },
  { n: "÷", x: "8%", y: "66%" },
  { n: "9", x: "88%", y: "64%" },
];

const kayu =
  "border-4 border-[#c99a4b] bg-[#fff3d6] shadow-[0_6px_0_rgba(107,68,35,0.4)]";

function Tutorial() {
  const sp = useSearchParams();
  const k = Number(sp.get("kelas"));
  const kelas = [3, 4, 5, 6].includes(k) ? k : 3;
  const soal = SOAL[kelas];

  const [fase, setFase] = useState<"cerita" | "latihan">("cerita");
  const [langkah, setLangkah] = useState(0);
  const [ketik, setKetik] = useState("");

  const [salah, setSalah] = useState<number[]>([]);
  const [benarDipilih, setBenarDipilih] = useState<number | null>(null);

  const adegan = CERITA[langkah];
  const selesaiKetik = ketik.length >= adegan.teks.length;

  // Efek mesin ketik
  useEffect(() => {
    if (fase !== "cerita") return;
    const teks = CERITA[langkah].teks;
    let i = 0;
    setKetik("");
    const t = setInterval(() => {
      i++;
      setKetik(teks.slice(0, i));
      if (i >= teks.length) clearInterval(t);
    }, 28);
    return () => clearInterval(t);
  }, [langkah, fase]);

  function lanjut() {
    if (!selesaiKetik) {
      setKetik(adegan.teks);
      return;
    }
    if (langkah + 1 >= CERITA.length) {
      setFase("latihan");
    } else {
      setLangkah(langkah + 1);
    }
  }

  function pilih(i: number) {
    if (benarDipilih !== null || salah.includes(i)) return;
    if (i === soal.benar) {
      setBenarDipilih(i);
      confetti({ particleCount: 140, spread: 85, origin: { y: 0.6 } });
    } else {
      setSalah((s) => [...s, i]);
    }
  }

  const pernahSalah = salah.length > 0;
  const poseLatihan: Pose =
    pernahSalah && benarDipilih === null ? "sedih" : "senang";
  const pose: Pose = fase === "cerita" ? adegan.pose : poseLatihan;
  const gelap = fase === "cerita" && adegan.gelap;

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[url('/latar-hutan.png')] bg-cover bg-center md:bg-[url('/layar-peta.png')]">
      {/* Overlay suasana */}
      <div
        className={`absolute inset-0 transition-colors duration-700 ${
          gelap
            ? "bg-slate-900/65"
            : "bg-gradient-to-b from-black/10 via-transparent to-black/30"
        }`}
      />

      {/* Angka berhamburan (adegan masalah) */}
      <AnimatePresence>
        {gelap &&
          ANGKA.map((a, i) => (
            <motion.div
              key={a.n + i}
              className="pointer-events-none absolute text-4xl font-black text-white sm:text-6xl"
              style={{
                left: a.x,
                top: a.y,
                textShadow: "0 4px 0 rgba(30,58,138,0.7)",
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 0.9,
                scale: 1,
                x: [0, 40, -30, 0],
                y: [0, -30, 30, 0],
                rotate: [0, 180, 360],
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                duration: 5 + (i % 3),
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {a.n}
            </motion.div>
          ))}
      </AnimatePresence>

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 py-4 sm:py-6 md:max-w-5xl">
        {/* Bar atas */}
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/kelas"
            className={`rounded-xl px-4 py-2 text-sm font-bold text-[#6b4423] transition active:translate-y-1 active:shadow-none sm:text-base ${kayu}`}
          >
            ← Kelas
          </Link>

          {fase === "cerita" ? (
            <>
              <div className="flex gap-1.5">
                {CERITA.map((_, i) => (
                  <span
                    key={i}
                    className={`h-2.5 rounded-full transition-all ${
                      i === langkah
                        ? "w-7 bg-[#ffd23f]"
                        : i < langkah
                        ? "w-2.5 bg-white"
                        : "w-2.5 bg-white/40"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => setFase("latihan")}
                className="rounded-xl bg-black/35 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm"
              >
                Lewati
              </button>
            </>
          ) : (
            <span className="rounded-full border-2 border-[#8a4b00] bg-[#ffd23f] px-4 py-1.5 text-sm font-bold text-[#5a2e00]">
              Latihan · Kelas {kelas}
            </span>
          )}
        </div>

        {/* Adegan */}
        <div className="flex flex-1 flex-col items-center justify-end gap-3 pt-4 md:flex-row md:items-end md:justify-center md:gap-8">
          {/* Maskot */}
          <AnimatePresence mode="wait">
            <motion.img
              key={pose}
              src={`/maskot-${pose}.png`}
              alt="Mathoo"
              className={`w-auto object-contain drop-shadow-2xl ${
                fase === "latihan"
                  ? "h-32 sm:h-44 md:h-80"
                  : "h-48 sm:h-64 md:h-[26rem]"
              }`}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{
                opacity: { duration: 0.2 },
                scale: { type: "spring", stiffness: 220, damping: 14 },
                y: { duration: 2.6, repeat: Infinity, ease: "easeInOut" },
              }}
            />
          </AnimatePresence>

          {/* Panel kanan/bawah */}
          <div className="w-full max-w-xl pb-2">
            {fase === "cerita" ? (
              <motion.div
                key={langkah}
                className={`relative rounded-3xl p-5 sm:p-6 ${kayu}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={lanjut}
              >
                <span className="absolute -top-4 left-5 rounded-full border-2 border-[#8a4b00] bg-[#ffd23f] px-4 py-0.5 text-sm font-bold text-[#5a2e00] sm:text-base">
                  Mathoo
                </span>
                <p className="min-h-[5.5rem] pt-2 text-lg font-semibold leading-snug text-[#5a3a1a] sm:min-h-[6.5rem] sm:text-2xl">
                  {ketik}
                  {!selesaiKetik && <span className="animate-pulse">▍</span>}
                </p>
                <div className="mt-3 flex justify-end">
                  <motion.button
                    className="rounded-2xl border-4 border-[#8a4b00] bg-gradient-to-b from-[#ffe066] to-[#ffb100] px-6 py-2 text-lg font-bold text-[#5a2e00] shadow-[0_6px_0_#8a4b00] active:translate-y-1.5 active:shadow-none sm:text-xl"
                    animate={{ x: selesaiKetik ? [0, 5, 0] : 0 }}
                    transition={{ duration: 0.9, repeat: Infinity }}
                  >
                    {langkah + 1 >= CERITA.length ? "Ayo latihan ▶" : "Lanjut ▶"}
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                className={`flex flex-col gap-4 rounded-3xl p-5 sm:p-6 ${kayu}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-lg font-bold leading-snug text-[#5a3a1a] sm:text-2xl">
                  {soal.q}
                </p>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {soal.opsi.map((o, i) => {
                    const isSalah = salah.includes(i);
                    const isBenar = benarDipilih === i;
                    return (
                      <motion.button
                        key={i}
                        onClick={() => pilih(i)}
                        disabled={isSalah || benarDipilih !== null}
                        animate={isSalah ? { x: [0, -8, 8, -6, 6, 0] } : {}}
                        transition={{ duration: 0.4 }}
                        whileTap={{ scale: 0.96 }}
                        className={`rounded-2xl border-4 px-3 py-4 text-xl font-bold transition sm:text-2xl ${
                          isBenar
                            ? "border-[#2d7a10] bg-[#9be564] text-[#1d5a08] shadow-[0_5px_0_#2d7a10]"
                            : isSalah
                            ? "border-[#c0392b] bg-[#ffd6d1] text-[#c0392b] line-through opacity-80"
                            : "border-[#c99a4b] bg-white text-[#5a3a1a] shadow-[0_5px_0_rgba(107,68,35,0.4)] hover:bg-[#fff8e8]"
                        }`}
                      >
                        {String.fromCharCode(65 + i)}. {o}
                      </motion.button>
                    );
                  })}
                </div>

                <AnimatePresence mode="wait">
                  {benarDipilih === null && !pernahSalah && (
                    <motion.p
                      key="info"
                      className="text-center text-sm font-semibold text-[#8a6a3a] sm:text-base"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Ayo, pilih jawaban yang menurutmu benar!
                    </motion.p>
                  )}

                  {benarDipilih === null && pernahSalah && (
                    <motion.div
                      key="salah"
                      className="rounded-2xl border-4 border-[#e57373] bg-[#ffe9e6] p-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <p className="text-lg font-bold text-[#c0392b]">
                        Belum tepat, coba lagi ya!
                      </p>
                      <p className="mt-1 text-base font-semibold text-[#6b4423] sm:text-lg">
                        💡 {soal.petunjuk}
                      </p>
                    </motion.div>
                  )}

                  {benarDipilih !== null && (
                    <motion.div
                      key="benar"
                      className="flex flex-col items-center gap-3 rounded-2xl border-4 border-[#2d7a10] bg-[#e3f9cf] p-4 text-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 240, damping: 14 }}
                    >
                      <p className="text-2xl font-black text-[#2d7a10] sm:text-3xl">
                        Jawaban Benar!
                      </p>
                      <div className="flex gap-1 text-4xl">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            initial={{ scale: 0, rotate: -90 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                              delay: 0.2 + i * 0.2,
                              type: "spring",
                              stiffness: 260,
                            }}
                          >
                            ⭐
                          </motion.span>
                        ))}
                      </div>
                      <p className="text-lg font-bold text-[#5a3a1a]">
                        +{pernahSalah ? 5 : 10} Poin
                      </p>
                      <Link
                        href={`/peta?kelas=${kelas}`}
                        className="w-full rounded-2xl border-4 border-[#8a4b00] bg-gradient-to-b from-[#ffe066] to-[#ffb100] px-6 py-3 text-xl font-bold text-[#5a2e00] shadow-[0_7px_0_#8a4b00] transition active:translate-y-2 active:shadow-none"
                      >
                        ▶ Mulai Petualangan
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function TutorialPage() {
  return (
    <Suspense fallback={null}>
      <Tutorial />
    </Suspense>
  );
}