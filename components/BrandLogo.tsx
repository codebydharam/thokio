import Link from 'next/link';

type BrandLogoProps = {
  href?: string;
};

/** The shared ThokIO mark and wordmark used by every application surface. */
export function BrandLogo({ href = '/' }: BrandLogoProps) {
  return <Link href={href} aria-label="ThokIO home" className="group inline-flex items-center gap-3 text-lg font-extrabold tracking-[-.045em] text-ink">
    <span className="grid size-10 place-items-center rounded-[13px] bg-ink shadow-lg shadow-indigo-950/15 transition-transform group-hover:-rotate-3" aria-hidden="true">
      <svg viewBox="0 0 32 32" className="size-7" fill="none">
        <path d="M16 3.5 27.5 10v12L16 28.5 4.5 22V10L16 3.5Z" stroke="#F59E0B" strokeWidth="1.8" />
        <path d="m10 12 6-3.4 6 3.4v7l-6 3.4-6-3.4v-7Z" fill="#F59E0B" fillOpacity=".2" stroke="#FFF7ED" strokeWidth="1.35" />
        <path d="M16 8.6v13.8M10 12l12 7M22 12l-12 7" stroke="#FFF7ED" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </span>
    <span>ThokIO<span className="text-amber">.</span></span>
  </Link>;
}
