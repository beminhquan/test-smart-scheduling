export default function Button({ children, ...props }) {
  return (
    <button
      className="rounded-md bg-blue-600 px-3.5 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      {...props}
    >
      {children}
    </button>
  );
}
