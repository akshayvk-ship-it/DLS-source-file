/* eslint-disable import/prefer-default-export */
import { RotatingVector1 } from '../assets/RotatingVector1';
import { RotatingVector2 } from '../assets/RotatingVector2';
import { RotatingVector3 } from '../assets/RotatingVector3';
import { StripeFrame } from '../assets/StripeFrame';

export interface DefaultBannerProps {
  bannerHeading?: string;
  bannerSubheading?: string;
  bannerHeadingClassName?: string;
  bannerSubheadingClassName?: string;
  bannerClass?: string;
  bannerLabelClass?: string;
}

export function DefaultBanner({
  bannerHeading = '',
  bannerSubheading = '',
  bannerHeadingClassName = '',
  bannerSubheadingClassName = '',
  bannerClass = '',
  bannerLabelClass = '',
}: Readonly<DefaultBannerProps>) {
  return (
    <div
      className={`${bannerClass} ${bannerLabelClass} bg-icon-on-fill-action-pressed relative flex size-full flex-col gap-4 overflow-hidden p-10`}
    >
      {bannerHeading && (
        <h2
          className={`display-small-semibold text-fill-fill z-10 max-w-[80%] whitespace-break-spaces break-words ${bannerHeadingClassName}`}
        >
          {bannerHeading}
        </h2>
      )}

      {bannerSubheading && (
        <h6
          className={`paragraph-large text-fill-fill z-10 max-w-[70%] whitespace-break-spaces break-words ${bannerSubheadingClassName}`}
        >
          {bannerSubheading}
        </h6>
      )}

      {/* Black overlay */}
      <div className="absolute inset-0 z-[5] bg-[#000000]/5" />

      <RotatingVector1
        className="animate-move-spin-ping-1 -bottom-[20%] -left-[20%] blur-[100px]"
        width={480}
        height={450}
      />
      <RotatingVector2
        className="animate-move-spin-ping-2 -bottom-[20%] -right-[40%] blur-[100px]"
        width={650}
        height={650}
      />
      <RotatingVector3
        className="animate-move-spin-ping-3 -top-[30%] left-0 blur-[100px]"
        width={600}
        height={635}
      />

      <div className="absolute inset-0 size-full overflow-hidden">
        <StripeFrame className="absolute inset-0 m-auto size-full scale-125 blur-[2px]" />
      </div>
    </div>
  );
}
