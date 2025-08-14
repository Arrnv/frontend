// components/GlassTooltip.tsx
export default function GlassTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="backdrop-blur-xl text-black bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl px-4 py-2 shadow-2xl hover:scale-105 transition-transform">
      <p className=" font-semibold">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-black/80">
          {entry.name}: <span className="font-bold">{entry.value}</span>
        </p>
      ))}
    </div>
  );
}
