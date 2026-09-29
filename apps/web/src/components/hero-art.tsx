/**
 * Minh họa kỹ thuật (vector) cho hero: cột anten, sóng vô tuyến, tuyến quang.
 * Thay bằng ảnh hiện trường THẬT đã có quyền sử dụng (usage_rights = PUBLIC_APPROVED)
 * khi COMTECH cung cấp [CONTENT REQUIRED]; không dùng ảnh stock làm dự án (SPEC 34.1).
 */
export function HeroArt() {
  return (
    <svg viewBox="0 0 520 460" className="h-auto w-full" role="img" aria-label="Minh họa hạ tầng viễn thông: cột anten và tuyến truyền dẫn">
      <defs>
        <linearGradient id="fiber" x1="0" x2="1">
          <stop offset="0" stopColor="#0E7490" stopOpacity="0" />
          <stop offset=".5" stopColor="#22D3EE" stopOpacity=".7" />
          <stop offset="1" stopColor="#0E7490" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="glow" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#FA9D0E" stopOpacity=".35" />
          <stop offset="1" stopColor="#FA9D0E" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Tuyến quang dưới mặt đất */}
      <path d="M0 410 C120 380 200 430 300 400 S460 370 520 395" stroke="url(#fiber)" strokeWidth="2" fill="none" />
      <path d="M0 430 C140 405 220 450 330 420 S470 395 520 415" stroke="url(#fiber)" strokeWidth="1.2" fill="none" opacity=".6" />
      {/* Các node mạng */}
      {[
        [60, 396],
        [190, 408],
        [300, 400],
        [440, 382],
      ].map(([x, y]) => (
        <g key={`${x}`}>
          <circle cx={x} cy={y} r="5" fill="#0F1B2D" stroke="#22D3EE" strokeWidth="1.5" />
        </g>
      ))}
      {/* Hào quang tại anten */}
      <circle cx="300" cy="118" r="120" fill="url(#glow)" />
      {/* Sóng vô tuyến */}
      {[40, 70, 100, 130].map((r, i) => (
        <g key={r} fill="none" stroke="#FA9D0E" strokeWidth="2" strokeLinecap="round" opacity={1 - i * 0.2}>
          <path d={`M${300 - r} ${118 - r * 0.25} A${r} ${r} 0 0 1 ${300 - r * 0.55} ${118 - r * 0.85}`} />
          <path d={`M${300 + r} ${118 - r * 0.25} A${r} ${r} 0 0 0 ${300 + r * 0.55} ${118 - r * 0.85}`} />
        </g>
      ))}
      {/* Cột lưới */}
      <g stroke="#E2E8F0" strokeWidth="2" fill="none" strokeLinejoin="round">
        <path d="M300 110 L252 400 M300 110 L348 400" />
        <path d="M262 340 L338 340 M270 290 L330 290 M278 240 L322 240 M286 190 L314 190 M292 150 L308 150" />
        <path d="M262 340 L330 290 M338 340 L270 290 M270 290 L322 240 M330 290 L278 240 M278 240 L314 190 M322 240 L286 190 M286 190 L308 150 M314 190 L292 150" opacity=".55" />
      </g>
      {/* Anten sector */}
      <g fill="#FA9D0E">
        <rect x="276" y="126" width="9" height="34" rx="2" />
        <rect x="315" y="126" width="9" height="34" rx="2" />
        <rect x="295.5" y="120" width="9" height="34" rx="2" />
      </g>
      <circle cx="300" cy="104" r="5" fill="#FA9D0E" />
      {/* Tủ thiết bị */}
      <g>
        <rect x="372" y="336" width="58" height="64" rx="4" fill="#1A2333" stroke="#E2E8F0" strokeWidth="1.5" />
        <rect x="380" y="346" width="42" height="6" rx="1" fill="#22D3EE" opacity=".7" />
        <rect x="380" y="358" width="42" height="6" rx="1" fill="#FA9D0E" opacity=".8" />
        <rect x="380" y="370" width="42" height="6" rx="1" fill="#E2E8F0" opacity=".4" />
      </g>
      {/* Nhãn công nghệ */}
      {[
        ['2G', 70, 90],
        ['3G', 110, 160],
        ['4G', 440, 70],
        ['5G', 470, 150],
      ].map(([t, x, y]) => (
        <g key={String(t)}>
          <rect x={Number(x) - 22} y={Number(y) - 14} width="44" height="26" rx="13" fill="#1A2333" stroke="#FA9D0E" strokeOpacity=".5" />
          <text x={Number(x)} y={Number(y) + 4} textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="12" fontWeight="600" fill="#FFFFFF">
            {t}
          </text>
        </g>
      ))}
    </svg>
  );
}
