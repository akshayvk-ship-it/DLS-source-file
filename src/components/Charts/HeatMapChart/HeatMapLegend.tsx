export interface HeatLegendData {
  value: string;
  percentValue: string;
  direction: 'up' | 'down';
  label?: string;
}

export interface HeatMapLegendProps {
  primaryColor: string;
  todayInfo: HeatLegendData;
  weekInfo: HeatLegendData;
  monthInfo: HeatLegendData;
  heatMapLegendClassName?: string;
  dataTestId?: string;
}

export function HeatMapLegend({
  primaryColor,
  monthInfo,
  todayInfo,
  weekInfo,
  heatMapLegendClassName = '',
  dataTestId = 'heat-map-legend',
}: HeatMapLegendProps) {
  const upArrow = (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="12" height="12" rx="6" fill="#09AF17" />
      <path
        d="M3.10662 5.7005L3.71813 6.31499L5.55563 4.4745L5.55563 9.19141L6.44455 9.19141L6.44455 4.4745L8.28503 6.31499L8.89355 5.7005L6.00009 2.80703L3.10662 5.7005Z"
        fill="white"
      />
    </svg>
  );

  const downArrow = (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="12" height="12" rx="6" fill="#EC3636" />
      <path
        d="M3.10662 6.2995L3.71813 5.68501L5.55563 7.5255L5.55563 2.80859L6.44455 2.80859L6.44455 7.5255L8.28503 5.68501L8.89355 6.2995L6.00009 9.19297L3.10662 6.2995Z"
        fill="white"
      />
    </svg>
  );

  return (
    <div
      className={`${heatMapLegendClassName} flex h-full flex-col justify-around`}
      data-testid={dataTestId}
    >
      <div className="flex flex-col">
        <p className="label-small text-text-light">
          {todayInfo.label || 'Today'}
        </p>
        <div
          className="heading-3-semibold text-text-text"
          style={{
            color: primaryColor,
          }}
        >
          {todayInfo.value}
        </div>
        <div className="label-small text-text-light flex items-center gap-0.5">
          {todayInfo.direction === 'up' ? upArrow : downArrow}
          <span>
            {todayInfo.direction === 'up' ? '+' : '-'}
            {todayInfo.percentValue}%
          </span>
        </div>
      </div>

      <div className="flex flex-col">
        <p className="label-small text-text-light">
          {weekInfo.label || 'This week'}
        </p>
        <div className="heading-3-semibold text-text-text">
          {weekInfo.value}
        </div>
        <div className="label-small text-text-light flex items-center gap-0.5">
          {weekInfo.direction === 'up' ? upArrow : downArrow}
          <span>
            {weekInfo.direction === 'up' ? '+' : '-'}
            {weekInfo.percentValue}%
          </span>
        </div>
      </div>

      <div className="flex flex-col">
        <p className="label-small text-text-light">
          {monthInfo.label || 'This month'}
        </p>
        <div className="heading-3-semibold text-text-text">
          {monthInfo.value}
        </div>
        <div className="label-small text-text-light flex items-center gap-0.5">
          {monthInfo.direction === 'up' ? upArrow : downArrow}
          <span>
            {monthInfo.direction === 'up' ? '+' : '-'}
            {monthInfo.percentValue}%
          </span>
        </div>
      </div>
    </div>
  );
}
