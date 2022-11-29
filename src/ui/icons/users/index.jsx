export default function UserIcon({
  className = " fill-none stroke-[3px] stroke-atysa-800",
  size = "w-5 h-5",
}) {
  return (
    <svg
      className={`${className} ${size}`}
      viewBox="0 0 24 24"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
}
