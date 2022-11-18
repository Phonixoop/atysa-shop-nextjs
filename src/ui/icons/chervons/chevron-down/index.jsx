export default function ChevronDownIcon({
  className = "w-4 h-4 fill-none stroke-gray-900 stroke-2 ",
}) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}
