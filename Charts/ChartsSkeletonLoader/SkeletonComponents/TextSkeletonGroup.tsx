import Skeleton from 'react-loading-skeleton';
import './styles/VerticalFunnelSkeleton.css';

function TextSkeletonGroup({
  left,
  top,
  animate = true,
  widthReference,
  heightReference,
}: Readonly<{
  left: number;
  top: number;
  animate?: boolean;
  widthReference: number;
  heightReference: number;
}>): React.ReactElement {
  const middleTextWidth = widthReference * 0.1323;
  const middleTextHeight = heightReference * 0.0277;
  const subTextWidth = widthReference * 0.0923;
  const subTextHeight = heightReference * 0.0169;
  return (
    <div
      className="text-group absolute mt-4 flex w-[5.375rem] flex-col items-center justify-center"
      style={{ left, top, gap: heightReference * 0.0123 }}
    >
      <div className="block overflow-hidden leading-[0]">
        <Skeleton
          width={subTextWidth}
          height={subTextHeight}
          className={`block delay-[200ms] ${animate ? 'skeleton-bar-expand' : ''}`}
        />
      </div>
      <div className="block overflow-hidden leading-[0]">
        <Skeleton
          width={middleTextWidth}
          height={middleTextHeight}
          className={`block delay-[200ms] ${animate ? 'skeleton-bar-expand' : ''}`}
        />
      </div>
      <div className="mb-[1px] block overflow-hidden leading-[0]">
        <Skeleton
          width={subTextWidth}
          height={subTextHeight}
          className={`block delay-[200ms] ${animate ? 'skeleton-bar-expand' : ''}`}
        />
      </div>
    </div>
  );
}

export default TextSkeletonGroup;
