export default function Star({
  className = "w-3 h-3 fill-yellow-400 stroke-yellow-400",
}) {
  return (
    <svg viewBox="0 0 12 12" className={className}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.99984 9.62097L2.42572 11.5L3.10832 7.52016L0.216797 4.70163L4.21278 4.12098L5.99984 0.5L7.7869 4.12098L11.7829 4.70163L8.89136 7.52016L9.57395 11.5L5.99984 9.62097Z"
      ></path>
    </svg>
  );
}
