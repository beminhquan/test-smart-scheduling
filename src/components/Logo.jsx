// Logo + tên hệ thống (dùng trên thanh menu, nền tối)
export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-500 text-white shadow-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          <path d="M8 2v4" />
          <path d="M16 2v4" />
          <rect width="18" height="18" x="3" y="4" rx="2" />
          <path d="M3 10h18" />
          <path d="m9 16 2 2 4-4" />
        </svg>
      </span>
      <div className="leading-tight">
        <p className="text-xl font-extrabold tracking-tight text-white">Smart</p>
        <p className="text-xl font-extrabold tracking-tight text-blue-300">Scheduling</p>
      </div>
    </div>
  );
}
