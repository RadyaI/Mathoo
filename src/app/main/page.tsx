"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import confetti from "canvas-confetti";

type Pose = "senang" | "sedih";
type Adegan = { teks: string; pose: Pose };
type Soal = {
  q: string;
  opsi: string[];
  benar: number;
  petunjuk: string;
  angka: string;
};
type LevelData = {
  judul: string;
  pembuka: Adegan[];
  penutup: Adegan[];
  soal: Soal[];
};

const LEVELS: Record<string, LevelData> = {
  "3-1-1": {
    judul: "Nilai Tempat",
    pembuka: [
      {
        teks: "Lihat, Papan Bilangan Hutan kosong! Semua angkanya terbang ke mana-mana gara-gara angin tadi.",
        pose: "sedih",
      },
      {
        teks: "Ada 5 angka yang harus kita kembalikan. Tiap jawabanmu yang benar akan membawa satu angka pulang ke papan.",
        pose: "senang",
      },
      {
        teks: "Siap? Ayo kita mulai dari angka yang nyangkut di pohon itu!",
        pose: "senang",
      },
    ],
    soal: [
      {
        q: "Angka 3.472 nyangkut di ranting pohon. Pada bilangan 3.472, angka 4 menempati nilai tempat...",
        opsi: ["Satuan", "Puluhan", "Ratusan"],
        benar: 2,
        petunjuk:
          "Baca dari kanan: 2 itu satuan, 7 itu puluhan, 4 itu ratusan, dan 3 itu ribuan.",
        angka: "3.472",
      },
      {
        q: "Angka 5.806 jatuh ke semak-semak. Pada bilangan 5.806, angka 8 bernilai...",
        opsi: ["8", "80", "800"],
        benar: 2,
        petunjuk: "Angka 8 ada di tempat ratusan, jadi nilainya 8 × 100.",
        angka: "5.806",
      },
      {
        q: "Mathoo menemukan petunjuk angka: 6 ribuan, 2 ratusan, 5 puluhan, dan 1 satuan. Bilangan apa itu?",
        opsi: ["6.215", "6.251", "2.651"],
        benar: 1,
        petunjuk: "Tulis dari ribuan ke satuan secara berurutan: 6, lalu 2, lalu 5, lalu 1.",
        angka: "6.251",
      },
      {
        q: "Angka 4.973 hanyut di sungai kecil. Pada bilangan 4.973, angka yang ada di tempat puluhan adalah...",
        opsi: ["9", "7", "3"],
        benar: 1,
        petunjuk:
          "Tempat puluhan adalah angka kedua dari kanan. Dari kanan ke kiri: 3, 7, 9, 4.",
        angka: "4.973",
      },
      {
        q: "Angka terakhir, 8.049, tersangkut di jaring laba-laba. Jika diuraikan, 8.049 sama dengan...",
        opsi: ["8.000 + 400 + 9", "8.000 + 40 + 9", "800 + 40 + 9"],
        benar: 1,
        petunjuk:
          "Ratusannya 0, jadi tidak ada ratusan. Yang ada: 8 ribuan, 4 puluhan, dan 9 satuan.",
        angka: "8.049",
      },
    ],
    penutup: [
      {
        teks: "Hore! Kelima angka sudah kembali ke papan. Hutan Bilangan mulai ceria lagi!",
        pose: "senang",
      },
      {
        teks: "Tapi kamu lihat nggak? Ada jejak di jalan menuju jembatan. Sepertinya angka-angka lain jatuh ke sana.",
        pose: "senang",
      },
      {
        teks: "Ayo kita cek di level berikutnya!",
        pose: "senang",
      },
    ],
  },
};

const ANGKA = [
  { n: "7", x: "12%", y: "16%" },
  { n: "3", x: "78%", y: "12%" },
  { n: "+", x: "58%", y: "28%" },
  { n: "12", x: "18%", y: "42%" },
  { n: "×", x: "84%", y: "40%" },
  { n: "5", x: "40%", y: "8%" },
];

const kayu =
  "border-4 border-[#c99a4b] bg-[#fff3d6] shadow-[0_6px_0_rgba(107,68,35,0.4)]";
const tombolEmas =
  "rounded-2xl border-4 border-[#8a4b00] bg-gradient-to-b from-[#ffe066] to-[#ffb100] font-bold text-[#5a2e00] shadow-[0_6px_0_#8a4b00] transition active:translate-y-1.5 active:shadow-none";

function Level({
  lv,
  kelas,
  area,
  level,
}: {
  lv: LevelData;
  kelas: number;
  area: number;
  level: number;
}) {
  const [tahap, setTahap] = useState<"pembuka" | "misi" | "penutup" | "hasil">(
    "pembuka"
  );
  const [langkah, setLangkah] = useState(0);
  const [ketik, setKetik] = useState("");

  const [idx, setIdx] = useState(0);
  const [salah, setSalah] = useState<number[]>([]);
  const [benarDipilih, setBenarDipilih] = useState<number | null>(null);
  const [pulih, setPulih] = useState(0);
  const [pertama, setPertama] = useState(0);
  const [poin, setPoin] = useState(0);
  const [bintang, setBintang] = useState(0);

  const sedangCerita = tahap === "pembuka" || tahap === "penutup";
  const cerita = tahap === "pembuka" ? lv.pembuka : lv.penutup;
  const adegan = cerita[Math.min(langkah, cerita.length - 1)];
  const selesaiKetik = ketik.length >= adegan.teks.length;
  const soal = lv.soal[idx];
  const pernahSalah = salah.length > 0;

  // Efek mesin ketik
  useEffect(() => {
    if (tahap !== "pembuka" && tahap !== "penutup") return;
    const daftar = tahap === "pembuka" ? lv.pembuka : lv.penutup;
    const teks = daftar[Math.min(langkah, daftar.length - 1)].teks;
    let i = 0;
    setKetik("");
    const t = setInterval(() => {
      i++;
      setKetik(teks.slice(0, i));
      if (i >= teks.length) clearInterval(t);
    }, 28);
    return () => clearInterval(t);
  }, [lv, tahap, langkah]);

  function simpan(b: number) {
    try {
      const kunci = `mathoo-progress-${kelas}`;
      const raw = localStorage.getItem(kunci);
      const arr: number[] = raw ? JSON.parse(raw) : Array(9).fill(0);
      const i = (area - 1) * 3 + (level - 1);
      if (Array.isArray(arr) && arr.length === 9 && i >= 0 && i < 9) {
        arr[i] = Math.max(arr[i] || 0, b);
        localStorage.setItem(kunci, JSON.stringify(arr));
      }
    } catch {}
  }

  function lanjutCerita() {
    if (!selesaiKetik) {
      setKetik(adegan.teks);
      return;
    }
    if (langkah + 1 < cerita.length) {
      setLangkah(langkah + 1);
      return;
    }
    if (tahap === "pembuka") {
      setTahap("misi");
      setLangkah(0);
    } else {
      const b = pertama >= 4 ? 3 : pertama >= 3 ? 2 : 1;
      setBintang(b);
      simpan(b);
      setTahap("hasil");
      confetti({ particleCount: 160, spread: 90, origin: { y: 0.6 } });
    }
  }

  function pilih(i: number) {
    if (benarDipilih !== null || salah.includes(i)) return;
    if (i === soal.benar) {
      setBenarDipilih(i);
      setPulih(idx + 1);
      if (salah.length === 0) {
        setPertama((p) => p + 1);
        setPoin((p) => p + 10);
      } else {
        setPoin((p) => p + 5);
      }
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
    } else {
      setSalah((s) => [...s, i]);
    }
  }

  function lanjutMisi() {
    if (idx + 1 >= lv.soal.length) {
      setTahap("penutup");
      setLangkah(0);
    } else {
      setIdx(idx + 1);
      setSalah([]);
      setBenarDipilih(null);
    }
  }

  function ulang() {
    setIdx(0);
    setSalah([]);
    setBenarDipilih(null);
    setPulih(0);
    setPertama(0);
    setPoin(0);
    setLangkah(0);
    setTahap("misi");
  }

  const gelap = tahap === "pembuka" && langkah === 0;
  const pose: Pose = sedangCerita
    ? adegan.pose
    : pernahSalah && benarDipilih === null
    ? "sedih"
    : "senang";

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[url('/latar-hutan.png')] bg-cover bg-center md:bg-[url('/layar-peta.png')]">
      <div
        className={`absolute inset-0 transition-colors duration-700 ${
          gelap
            ? "bg-slate-900/65"
            : "bg-gradient-to-b from-black/10 via-transparent to-black/30"
        }`}
      />

      {/* Angka berhamburan di adegan pertama */}
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

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col gap-3 px-4 py-4 sm:py-6 md:max-w-5xl">
        {/* Bar atas */}
        <div className="flex items-center justify-between gap-2">
          <Link
            href={`/peta?kelas=${kelas}`}
            className={`rounded-xl px-4 py-2 text-sm font-bold text-[#6b4423] transition active:translate-y-1 active:shadow-none sm:text-base ${kayu}`}
          >
            ← Peta
          </Link>

          <span className="rounded-full border-2 border-[#8a4b00] bg-[#ffd23f] px-3 py-1.5 text-xs font-bold text-[#5a2e00] sm:text-sm">
            Level {level} · {lv.judul}
          </span>

          {tahap === "pembuka" ? (
            <button
              onClick={() => setTahap("misi")}
              className="rounded-xl bg-black/35 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm"
            >
              Lewati
            </button>
          ) : (
            <span className="rounded-full border-2 border-[#8a4b00] bg-[#fff3d6] px-3 py-1.5 text-xs font-black text-[#5a2e00] sm:text-sm">
              {poin} poin
            </span>
          )}
        </div>

        {/* Papan Bilangan Hutan */}
        {tahap !== "hasil" && (
          <div className={`rounded-2xl p-2 sm:p-3 ${kayu}`}>
            <p className="mb-1 text-center text-xs font-black text-[#8a6a3a] sm:text-sm">
              Papan Bilangan Hutan
            </p>
            <div className="grid grid-cols-5 gap-1.5 sm:gap-3">
              {lv.soal.map((s, i) => {
                const ada = i < pulih;
                const aktif = tahap === "misi" && i === idx && !ada;
                return (
                  <motion.div
                    key={i}
                    animate={ada ? { scale: [0.6, 1.2, 1] } : { scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className={`flex h-12 items-center justify-center rounded-xl border-4 text-sm font-black sm:h-16 sm:text-xl ${
                      ada
                        ? "border-[#2d7a10] bg-[#9be564] text-[#1d5a08]"
                        : aktif
                        ? "animate-pulse border-[#ff9f1c] bg-[#fff8e8] text-[#c2410c]"
                        : "border-[#d9c9a8] bg-[#f3e8cf] text-[#b8a478]"
                    }`}
                  >
                    {ada ? s.angka : "?"}
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Adegan */}
        <div className="flex flex-1 flex-col items-center justify-end gap-3 md:flex-row md:items-end md:justify-center md:gap-8">
          <AnimatePresence mode="wait">
            <motion.img
              key={pose + tahap}
              src={`/maskot-${pose}.png`}
              alt="Mathoo"
              className={`w-auto object-contain drop-shadow-2xl ${
                tahap === "misi"
                  ? "h-28 sm:h-40 md:h-72"
                  : "h-44 sm:h-60 md:h-[24rem]"
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

          <div className="w-full max-w-xl pb-2">
            {/* CUTSCENE */}
            {sedangCerita && (
              <motion.div
                key={tahap + langkah}
                className={`relative rounded-3xl p-5 sm:p-6 ${kayu}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={lanjutCerita}
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
                    className={`${tombolEmas} px-6 py-2 text-lg sm:text-xl`}
                    animate={{ x: selesaiKetik ? [0, 5, 0] : 0 }}
                    transition={{ duration: 0.9, repeat: Infinity }}
                  >
                    {langkah + 1 >= cerita.length
                      ? tahap === "pembuka"
                        ? "Mulai misi ▶"
                        : "Lihat hasil ▶"
                      : "Lanjut ▶"}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* MISI */}
            {tahap === "misi" && (
              <motion.div
                key={idx}
                className={`flex flex-col gap-4 rounded-3xl p-5 sm:p-6 ${kayu}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#ffd23f] px-3 py-0.5 text-xs font-bold text-[#5a2e00] sm:text-sm">
                    Angka {idx + 1} dari {lv.soal.length}
                  </span>
                </div>

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
                        className={`rounded-2xl border-4 px-3 py-4 text-lg font-bold transition sm:text-xl ${
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
                      Pilih jawaban yang benar untuk membawa angka ini pulang!
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
                      <p className="text-xl font-black text-[#2d7a10] sm:text-2xl">
                        Benar! Angka {soal.angka} kembali ke papan 🎉
                      </p>
                      <p className="text-base font-bold text-[#5a3a1a]">
                        +{pernahSalah ? 5 : 10} poin
                      </p>
                      <button
                        onClick={lanjutMisi}
                        className={`${tombolEmas} w-full px-6 py-3 text-xl`}
                      >
                        {idx + 1 >= lv.soal.length ? "Selesai ▶" : "Angka berikutnya ▶"}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* HASIL */}
            {tahap === "hasil" && (
              <motion.div
                className={`flex flex-col items-center gap-3 rounded-3xl p-6 text-center ${kayu}`}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 14 }}
              >
                <p className="text-3xl font-black text-[#6b4423] sm:text-4xl">
                  Level Selesai!
                </p>
                <div className="flex gap-2 text-5xl sm:text-6xl">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        delay: 0.2 + i * 0.25,
                        type: "spring",
                        stiffness: 260,
                      }}
                      style={{ filter: bintang > i ? "none" : "grayscale(1) opacity(0.35)" }}
                    >
                      ⭐
                    </motion.span>
                  ))}
                </div>
                <p className="text-lg font-bold text-[#5a3a1a]">
                  {poin} poin · {pulih}/{lv.soal.length} angka kembali
                </p>
                <p className="text-sm font-semibold text-[#8a6a3a]">
                  {pertama} soal dijawab benar tanpa petunjuk
                </p>
                <Link
                  href={`/peta?kelas=${kelas}`}
                  className={`${tombolEmas} mt-1 w-full px-6 py-3 text-xl`}
                >
                  ▶ Kembali ke Peta
                </Link>
                <button
                  onClick={ulang}
                  className="w-full rounded-2xl border-4 border-[#c99a4b] bg-white px-6 py-2 text-base font-bold text-[#6b4423] shadow-[0_4px_0_rgba(107,68,35,0.4)] transition active:translate-y-1 active:shadow-none"
                >
                  ↻ Main Lagi
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function Segera({ kelas }: { kelas: number }) {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[url('/latar-hutan.png')] bg-cover bg-center md:bg-[url('/layar-peta.png')]">
      <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/5 to-black/40" />
      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-5 px-5 py-8 text-center">
        <motion.img
          src="/maskot-senang.png"
          alt="Mathoo"
          className="h-48 w-auto object-contain drop-shadow-2xl sm:h-60"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className={`w-full rounded-3xl p-6 ${kayu}`}>
          <span className="inline-block rounded-full border-2 border-[#8a4b00] bg-[#ffd23f] px-4 py-0.5 text-sm font-bold text-[#5a2e00]">
            Segera Hadir
          </span>
          <h1 className="mt-3 text-3xl font-black text-[#6b4423] sm:text-4xl">
            Coming Soon
          </h1>
          <p className="mt-2 text-base font-semibold text-[#8a6a3a] sm:text-lg">
            Level ini lagi disiapkan Mathoo. Coba Level 1 di Hutan Bilangan dulu ya!
          </p>
          <Link
            href={`/peta?kelas=${kelas}`}
            className={`${tombolEmas} mt-5 block w-full px-6 py-3 text-xl`}
          >
            ← Kembali ke Peta
          </Link>
        </div>
      </div>
    </main>
  );
}

function Main() {
  const sp = useSearchParams();
  const k = Number(sp.get("kelas"));
  const kelas = [3, 4, 5, 6].includes(k) ? k : 3;
  const a = Number(sp.get("area"));
  const area = [1, 2, 3, 4].includes(a) ? a : 1;
  const l = Number(sp.get("level"));
  const level = [1, 2, 3].includes(l) ? l : 1;

  const lv = LEVELS[`${kelas}-${area}-${level}`];
  if (!lv) return <Segera kelas={kelas} />;

  return (
    <Level
      key={`${kelas}-${area}-${level}`}
      lv={lv}
      kelas={kelas}
      area={area}
      level={level}
    />
  );
}

export default function MainPage() {
  return (
    <Suspense fallback={null}>
      <Main />
    </Suspense>
  );
}