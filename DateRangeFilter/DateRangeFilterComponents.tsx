// eslint-disable-next-line import/prefer-default-export
export function CloseIcon({ onClick }: { onClick: () => void }) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onKeyDown={onClick}
      role="button"
      tabIndex={-2}
      className="mr-4"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="fill-icon-icon"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.861 12.7773C12.1141 13.0303 12.5243 13.0303 12.7773 12.7773C13.0303 12.5243 13.0303 12.114 12.7773 11.861L8.91624 8L12.7773 4.13896C13.0303 3.88595 13.0303 3.47574 12.7773 3.22273C12.5243 2.96972 12.114 2.96972 11.861 3.22273L8 7.08376L4.13896 3.22272C3.88595 2.96971 3.47573 2.96971 3.22272 3.22272C2.96971 3.47573 2.96971 3.88594 3.22272 4.13895L7.08377 8L3.22272 11.8611C2.96971 12.1141 2.96971 12.5243 3.22272 12.7773C3.47573 13.0303 3.88594 13.0303 4.13895 12.7773L8 8.91623L11.861 12.7773Z"
        />
      </svg>
    </div>
  );
}
