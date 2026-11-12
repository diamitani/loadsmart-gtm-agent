export function LoadsmartLogo({ className = "h-7", showTag = true }: { className?: string; showTag?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      {/* Loadsmart Geometric Logistics Cube Mark */}
      <svg 
        viewBox="0 0 36 36" 
        className={`${className} w-auto flex-shrink-0`}
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="36" height="36" rx="8" fill="#2563EB" />
        {/* Dynamic freight flow paths representing multimodal freight routing */}
        <path 
          d="M10 18L18 10L26 18L18 26L10 18Z" 
          stroke="white" 
          strokeWidth="2.2" 
          strokeLinejoin="round" 
        />
        <path 
          d="M18 10V26" 
          stroke="white" 
          strokeWidth="2.2" 
          strokeLinecap="round" 
        />
        <circle cx="18" cy="18" r="3" fill="#60A5FA" />
      </svg>

      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold text-[17px] tracking-tight text-slate-900">
            LOAD<span className="text-blue-600">SMART</span>
          </span>
          {showTag && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-blue-50 text-blue-700 border border-blue-200">
              GTM AI
            </span>
          )}
        </div>
        <span className="text-[10px] text-slate-500 font-medium tracking-wide mt-0.5">
          Autonomous GTM Engine
        </span>
      </div>
    </div>
  );
}

