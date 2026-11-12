export function LoadsmartLogo({ className = "h-7" }: { className?: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg viewBox="0 0 36 36" className={`${className} w-auto flex-shrink-0`} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="36" height="36" rx="8" fill="#2563EB" />
        <path d="M10 18L18 10L26 18L18 26L10 18Z" stroke="white" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M18 10V26" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="18" cy="18" r="3" fill="#93C5FD" />
      </svg>
      <span className="font-extrabold text-[17px] tracking-tight text-slate-900">
        LOAD<span className="text-blue-600">SMART</span>
      </span>
    </div>
  );
}
