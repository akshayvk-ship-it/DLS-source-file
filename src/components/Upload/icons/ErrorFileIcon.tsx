export default function ErrorFileIcon({
  ...props
}: React.SVGAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      className={props.className}
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 4C4 1.79086 5.79086 0 8 0H20L28 8.5L36 16V36C36 38.2091 34.2091 40 32 40H8C5.79086 40 4 38.2091 4 36V4Z"
        fill="#FBCBDB"
      />
      <path
        d="M20 0L28 8.5L36 16H24C21.7909 16 20 14.2091 20 12V0Z"
        fill="#FDE7EF"
      />
      <circle cx="20" cy="27" r="7" fill="#F68DB0" />
      <path
        d="M22.1149 24.7876L17.7743 29.0831"
        stroke="white"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
      <path
        d="M17.9269 24.7876L22.0959 29.0831"
        stroke="white"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
    </svg>
  );
}
