"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";

const AREA = [
  { nama: "Hutan Bilangan", warna: "#58cc02", gelap: "#2d7a10" },
  { nama: "Lembah Hitung", warna: "#ff9f1c", gelap: "#9a5200" },
  { nama: "Pulau Pecahan", warna: "#1cb0f6", gelap: "#0f5fa3" },
];

const MATERI: Record<number, string[]> = {
  3: ["Tambah dan kurang", "Kali dan bagi", "Pecahan sederhana"],
  4: ["Bilangan sampai 10.000", "Kali dan bagi", "Pecahan"],
  5: ["Operasi bilangan besar", "Pecahan", "Desimal"],
  6: ["Bilangan cacah besar", "Pecahan campuran", "Desimal"],
};

// Posisi titik di peta (persen dari lebar & tinggi gambar).
// Kalau kurang pas sama jalannya, tinggal ubah angka x dan y di sini.
const NODE = [
  { x: 10, y: 86 },
  { x: 24, y: 73 },
  { x: 40, y: 66 },
  { x: 52, y: 50 },
  { x: 62, y: 42 },
  { x: 76, y: 38 },
  { x: 88, y: 56 },
  { x: 82, y: 68 },
  { x: 72, y: 77 },
];
const ISTANA = { x: 65, y: 16 };

const kayu =
  "border-4 border-[#c99a4b] bg-[#fff3d6] shadow-[0_5px_0_rgba(107,68,35,0.4)]";

function Peta() {
  const sp = useSearchParams();
  const k = Number(sp.get("kelas"));
  const kelas = [3, 4, 5, 6].includes(k) ? k : 3;
  const kunci = `mathoo-progress-${kelas}`;

  const [bintang, setBintang] = useState<number[]>(Array(9).fill(0));
  const [siap, setSiap] = useState(false);
  const [pilih, setPilih] = useState<number | null>(null);
  const gulir = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(kunci);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr) && arr.length === 9) setBintang(arr);
      }
    } catch {}
    setSiap(true);
  }, [kunci]);

  const idxAktif = bintang.findIndex((b) => b === 0);
  const sekarang = idxAktif === -1 ? 9 : idxAktif; // 9 = istana
  const totalBintang = bintang.reduce((a, b) => a + b, 0);

  // Fokus ke level aktif (berguna di HP)
  useEffect(() => {
    if (!siap) return;
    const el = gulir.current;
    if (!el) return;
    const pos = sekarang >= 9 ? ISTANA : NODE[sekarang];
    el.scrollTo({
      left: (pos.x / 100) * el.scrollWidth - el.clientWidth / 2,
      behavior: "smooth",
    });
  }, [siap, sekarang]);

  const terbuka = (i: number) => i === 0 || bintang[i - 1] > 0;

  // Info panel
  const adaPilihan = pilih !== null;
  const isIstana = pilih === 9;
  const aIdx = pilih !== null && pilih < 9 ? Math.floor(pilih / 3) : 0;
  const lvl = pilih !== null && pilih < 9 ? (pilih % 3) + 1 : 1;
  const bukaPilih = pilih === null ? false : isIstana ? sekarang === 9 : terbuka(pilih);
  const hrefMain = isIstana
    ? `/main?kelas=${kelas}&area=4&level=1`
    : `/main?kelas=${kelas}&area=${aIdx + 1}&level=${lvl}`;

  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden bg-[url('/latar-hutan.png')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/25" />

      <div className="relative z-10 flex flex-1 flex-col gap-3 p-3 sm:p-5">
        {/* HUD */}
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3">
          <Link
            href="/kelas"
            className={`rounded-xl px-4 py-2 text-sm font-bold text-[#6b4423] transition active:translate-y-1 active:shadow-none sm:text-base ${kayu}`}
          >
            ← Kelas
          </Link>

          <div
            className={`rounded-2xl px-4 py-1.5 text-center text-[#6b4423] ${kayu}`}
          >
            <p className="text-base font-black leading-tight sm:text-xl">
              Kelas {kelas}
            </p>
            <p className="text-[10px] font-semibold leading-tight sm:text-xs">
              Petualangan Mathoo
            </p>
          </div>

          <div className="flex items-center gap-1.5 rounded-full border-4 border-[#8a4b00] bg-gradient-to-b from-[#ffe066] to-[#ffb100] px-4 py-1.5 text-base font-black text-[#5a2e00] shadow-[0_4px_0_#8a4b00] sm:text-xl">
            ⭐ {totalBintang}
            <span className="text-xs font-bold opacity-70 sm:text-sm">/ 27</span>
          </div>
        </div>

        <p className="text-center text-xs font-bold text-white drop-shadow md:hidden">
          👆 Geser peta ke kiri atau kanan
        </p>

        {/* Bingkai peta */}
        <div className="flex flex-1 items-center justify-center">
          <div
            ref={gulir}
            className="w-full overflow-x-auto rounded-3xl border-4 border-[#c99a4b] bg-[#c99a4b] shadow-[0_8px_0_rgba(107,68,35,0.5)] md:w-[min(100%,calc((100dvh_-_7.5rem)*1.7778))] md:overflow-hidden"
          >
            <div className="relative aspect-video w-full min-w-[1100px] md:min-w-0">
              <img
                src="/layar-peta.png"
                alt="Peta petualangan Mathoo"
                draggable={false}
                className="absolute inset-0 h-full w-full select-none"
              />

              {/* Jalur */}
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="pointer-events-none absolute inset-0 h-full w-full"
              >
                <polyline
                  points={[...NODE, ISTANA].map((p) => `${p.x},${p.y}`).join(" ")}
                  fill="none"
                  stroke="rgba(255,255,255,0.85)"
                  strokeWidth="5"
                  strokeDasharray="1 11"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
                <polyline
                  points={[...NODE, ISTANA]
                    .slice(0, Math.min(sekarang + 1, 10))
                    .map((p) => `${p.x},${p.y}`)
                    .join(" ")}
                  fill="none"
                  stroke="#ffd23f"
                  strokeWidth="6"
                  strokeDasharray="1 11"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              {/* Papan nama area */}
              {AREA.map((a, ai) => {
                const n = NODE[ai * 3];
                return (
                  <div
                    key={a.nama}
                    className="pointer-events-none absolute -translate-x-1/2 -translate-y-full"
                    style={{ left: `${n.x}%`, top: `${n.y - 7}%` }}
                  >
                    <div
                      className="flex items-center gap-1.5 whitespace-nowrap rounded-xl border-[3px] px-2.5 py-1 text-[11px] font-black text-white shadow-[0_3px_0_rgba(0,0,0,0.35)] sm:text-sm md:text-base"
                      style={{ background: a.warna, borderColor: a.gelap }}
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs sm:h-6 sm:w-6 sm:text-sm" style={{ color: a.gelap }}>
                        {ai + 1}
                      </span>
                      {a.nama}
                    </div>
                  </div>
                );
              })}

              {/* Titik level */}
              {NODE.map((n, i) => {
                const a = AREA[Math.floor(i / 3)];
                const buka = terbuka(i);
                const selesai = bintang[i] > 0;
                const aktif = i === sekarang;
                const bg = !buka ? "#94a3b8" : selesai ? a.warna : "#ffd23f";
                const tepi = !buka ? "#475569" : selesai ? a.gelap : "#9a5200";
                return (
                  <div
                    key={i}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${n.x}%`, top: `${n.y}%` }}
                  >
                    <motion.button
                      onClick={() => setPilih(i)}
                      animate={aktif ? { scale: [1, 1.18, 1] } : { scale: 1 }}
                      transition={
                        aktif ? { duration: 1.2, repeat: Infinity } : undefined
                      }
                      whileTap={{ scale: 0.9 }}
                      className="flex h-10 w-10 items-center justify-center rounded-full border-4 text-lg font-black shadow-[0_5px_0_rgba(0,0,0,0.35)] sm:h-12 sm:w-12 sm:text-xl md:h-14 md:w-14 md:text-2xl"
                      style={{
                        background: bg,
                        borderColor: tepi,
                        color: aktif ? "#5a2e00" : "#fff",
                      }}
                    >
                      {buka ? (i % 3) + 1 : "🔒"}
                    </motion.button>
                    {buka && (
                      <div className="pointer-events-none absolute left-1/2 top-full mt-0.5 flex -translate-x-1/2 text-[11px] sm:text-sm">
                        {[0, 1, 2].map((j) => (
                          <span
                            key={j}
                            style={{
                              color: bintang[i] > j ? "#ffd23f" : "rgba(255,255,255,0.6)",
                              textShadow: "0 1px 0 rgba(0,0,0,0.5)",
                            }}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Istana */}
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${ISTANA.x}%`, top: `${ISTANA.y}%` }}
              >
                <motion.button
                  onClick={() => setPilih(9)}
                  animate={sekarang === 9 ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                  transition={
                    sekarang === 9 ? { duration: 1.2, repeat: Infinity } : undefined
                  }
                  whileTap={{ scale: 0.9 }}
                  className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-[#6d28d9] bg-[#a78bfa] text-2xl shadow-[0_5px_0_rgba(0,0,0,0.35)] sm:h-14 sm:w-14 md:h-16 md:w-16 md:text-3xl"
                >
                  {sekarang === 9 ? "🏰" : "🔒"}
                </motion.button>
                <p className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#4c1d95] px-2 py-0.5 text-[10px] font-bold text-white sm:text-xs md:text-sm">
                  Puncak Tantangan
                </p>
              </div>

              {/* Maskot di posisi sekarang */}
              {siap && (
                <motion.img
                  src="/maskot-senang.png"
                  alt="Mathoo"
                  className="pointer-events-none absolute h-12 w-auto -translate-x-1/2 -translate-y-full drop-shadow-xl sm:h-16 md:h-20"
                  animate={{
                    left: `${(sekarang >= 9 ? ISTANA : NODE[sekarang]).x}%`,
                    top: `calc(${(sekarang >= 9 ? ISTANA : NODE[sekarang]).y}% - 1.6rem)`,
                    y: [0, -8, 0],
                  }}
                  transition={{
                    left: { type: "spring", stiffness: 80, damping: 14 },
                    top: { type: "spring", stiffness: 80, damping: 14 },
                    y: { duration: 1.4, repeat: Infinity, ease: "easeInOut" },
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Panel info level */}
      <AnimatePresence>
        {adaPilihan && (
          <motion.div
            className="fixed inset-0 z-30 flex items-end justify-center bg-black/50 p-3 sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPilih(null)}
          >
            <motion.div
              className={`relative flex w-full max-w-sm flex-col items-center gap-3 rounded-3xl p-6 text-center ${kayu}`}
              initial={{ y: 80, scale: 0.9 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: "spring", stiffness: 240, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setPilih(null)}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#c99a4b] text-lg font-black text-white"
                aria-label="Tutup"
              >
                ×
              </button>

              {isIstana ? (
                <>
                  <p className="text-5xl">🏰</p>
                  <h2 className="text-2xl font-black text-[#6b4423]">
                    Puncak Tantangan
                  </h2>
                  <p className="text-base font-semibold text-[#8a6a3a]">
                    Soal pamungkas dari semua area. Buka dengan menyelesaikan
                    ketiga area dulu.
                  </p>
                </>
              ) : (
                <>
                  <span
                    className="rounded-full px-4 py-0.5 text-sm font-bold text-white"
                    style={{ background: AREA[aIdx].warna }}
                  >
                    Area {aIdx + 1} · {AREA[aIdx].nama}
                  </span>
                  <h2 className="text-3xl font-black text-[#6b4423]">
                    Level {lvl}
                  </h2>
                  <p className="text-base font-semibold text-[#8a6a3a]">
                    {MATERI[kelas][aIdx]}
                  </p>
                  <div className="flex gap-1 text-4xl">
                    {[0, 1, 2].map((j) => (
                      <span
                        key={j}
                        style={{
                          color: bintang[pilih as number] > j ? "#ffb100" : "#d9c9a8",
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </>
              )}

              {bukaPilih ? (
                <Link
                  href={hrefMain}
                  className="mt-1 w-full rounded-2xl border-4 border-[#8a4b00] bg-gradient-to-b from-[#ffe066] to-[#ffb100] px-6 py-3 text-xl font-bold text-[#5a2e00] shadow-[0_7px_0_#8a4b00] transition active:translate-y-2 active:shadow-none"
                >
                  ▶ Main
                </Link>
              ) : (
                <p className="mt-1 w-full rounded-2xl bg-[#e2e8f0] px-4 py-3 text-base font-bold text-[#475569]">
                  🔒 Selesaikan level sebelumnya dulu
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function PetaPage() {
  return (
    <Suspense fallback={null}>
      <Peta />
    </Suspense>
  );
}