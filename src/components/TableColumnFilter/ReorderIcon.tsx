export default function ReorderIcon({ className }: { className?: string }) {
  return (
    <svg
      width="13"
      height="8"
      viewBox="0 0 13 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="6.5" cy="1.5" r="1.5" fill="#D0D3D8" />
      <circle cx="6.5" cy="6.5" r="1.5" fill="#D0D3D8" />
      <circle cx="1.5" cy="1.5" r="1.5" fill="#D0D3D8" />
      <circle cx="1.5" cy="6.5" r="1.5" fill="#D0D3D8" />
      <circle cx="11.5" cy="1.5" r="1.5" fill="#D0D3D8" />
      <circle cx="11.5" cy="6.5" r="1.5" fill="#D0D3D8" />
    </svg>
  );
}
