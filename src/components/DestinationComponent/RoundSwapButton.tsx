import React from 'react';

const keyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
  if (e.key === 'Enter') {
    e.currentTarget.focus();
  }
};

function RoundSwapButton({
  switchButtonOnClick = () => {},
}: {
  switchButtonOnClick?: () => void;
}) {
  const svgRef = React.useRef<SVGSVGElement>(null);
  return (
    <div>
      <div
        className="border-border-border bg-fill-fill hover:bg-fill-hover-light active:bg-fill-pressed group absolute right-5 top-[calc(50%-1.25rem)] z-40 flex h-10 w-10 items-center justify-center rounded-full border"
        onClick={() => {
          switchButtonOnClick();
        }}
        role="button"
        onKeyDown={keyDown}
        tabIndex={0}
      >
        <svg
          ref={svgRef}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-icon-icon group-active:stroke-icon-pressed"
        >
          <path
            d="M5.83333 16.6666V3.33325M5.83333 3.33325L2.5 6.66659M5.83333 3.33325L9.16667 6.66659"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="active:bg-fill-pressed"
          />
          <path
            d="M14.1666 3.33317V16.6665M14.1666 16.6665L10.8333 13.3332M14.1666 16.6665L17.4999 13.3332"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="border-border-border bg-fill-fill absolute right-4 top-[calc(50%-1.5rem)] z-20 flex h-12 w-12 justify-center rounded-full border" />
      <span className="bg-fill-fill absolute right-4 top-[calc(50%-0.5rem)] z-30 h-4 w-12" />
    </div>
  );
}

export default RoundSwapButton;
