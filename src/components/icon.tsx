import type { CSSProperties } from "react";

const paths: Record<string, React.ReactNode> = {
  arrow: (
    <>
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </>
  ),
  northeast: <path d="M6 18 18 6M6 6h12v12" />,
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  pin: (
    <>
      <path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  heart: (
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
  ),
  car: (
    <>
      <path d="m3 10 2-6h14l2 6v9h-3v-3H6v3H3Zm0 0h18M6 13h2m8 0h2" />
    </>
  ),
  suv: (
    <>
      <path d="M2 10h20v7H2Zm3 0 2-6h11l3 6M12 4v6" />
      <circle cx="6" cy="17" r="2" />
      <circle cx="18" cy="17" r="2" />
    </>
  ),
  van: (
    <>
      <path d="M2 5h15l5 6v7H2Zm4 0v7h15M12 5v7" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="18" r="2" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </>
  ),
  gear: (
    <>
      <path d="M6 3v12m0-7h12M18 3v12M12 8v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="18" r="3" />
    </>
  ),
  fuel: (
    <>
      <path d="M3 21V3h10v18M1 21h14M3 10h10m0 3h3v5a2 2 0 0 0 4 0V9l-4-4m2 2v4h2" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="7" r="3" />
      <path d="M2 21v-3a7 7 0 0 1 14 0v3M16 4a3 3 0 0 1 0 6m3 4a6 6 0 0 1 3 5v2" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  shield: (
    <>
      <path d="m12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6Z" />
      <path d="m8 12 3 3 5-6" />
    </>
  ),
  chat: (
    <>
      <path d="M21 11a9 9 0 0 1-9 9H3l1.5-4A9 9 0 1 1 21 11Z" />
      <path d="M8 10h8m-8 4h5" />
    </>
  ),
  phone: (
    <path d="m5 3 4 1 1 5-3 2a15 15 0 0 0 6 6l2-3 5 1 1 4c-1 3-6 2-10-1S2 8 3 5Z" />
  ),
  chevron: <path d="m6 9 6 6 6-6" />,
  filter: (
    <>
      <path d="M4 6h16M4 12h16M4 18h16" />
      <circle cx="8" cy="6" r="2" />
      <circle cx="16" cy="12" r="2" />
      <circle cx="9" cy="18" r="2" />
    </>
  ),
  close: <path d="m6 6 12 12M6 18 18 6" />,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  plus: <path d="M12 5v14M5 12h14" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 6 9 7 9-7" />
    </>
  ),
  upload: (
    <>
      <path d="M12 16V3m-5 5 5-5 5 5M3 16v5h18v-5" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 1v2m0 18v2M1 12h2m18 0h2M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="8" r="5" />
      <path d="m12 12 9 9m-6-6 3-3m0 6 3-3" />
    </>
  ),
};
export function Icon({
  name,
  size = 20,
  className,
  style,
}: {
  name: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      style={style}
    >
      {paths[name] || paths.car}
    </svg>
  );
}
