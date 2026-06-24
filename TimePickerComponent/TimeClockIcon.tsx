function TimeClockIcon({
  className = 'fill-icon-icon',
}: {
  className?: string;
}) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9C0 4.02944 4.02944 0 9 0C13.9706 0 18 4.02944 18 9ZM2.02096 9C2.02096 12.8544 5.14558 15.979 9 15.979C12.8544 15.979 15.979 12.8544 15.979 9C15.979 5.14558 12.8544 2.02096 9 2.02096C5.14558 2.02096 2.02096 5.14558 2.02096 9Z"
        fill="#3B475B"
        className={className}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 5C9.55228 5 10 5.44772 10 6V9.10786L11.5633 10.1738C12.0196 10.4849 12.1373 11.107 11.8262 11.5633C11.5151 12.0196 10.893 12.1373 10.4367 11.8262L8.87333 10.7603C8.32692 10.3878 8 9.76919 8 9.10786V6C8 5.44772 8.44771 5 9 5Z"
        fill="#3B475B"
        className={className}
      />
    </svg>
  );
}

export default TimeClockIcon;
