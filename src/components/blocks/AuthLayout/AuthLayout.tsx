/* eslint-disable import/prefer-default-export */
import { BilldeskLogo } from '../../Icons';
import './index.css';
import {
  AuthLayoutProps,
  AuthLayoutVariants,
  BannerLabelPosition,
} from './types';
import { DefaultBanner } from './components/DefaultBanner';

// These classes will be used to position the label in the banner
const bannerLabelClassMap: Record<BannerLabelPosition, string> = {
  'top-left': '',
  'bottom-left': 'justify-end',
  'bottom-center': 'justify-end items-center text-center',
};

// These classes differentiate the styling between each auth layout variant.
const getVariantClasses = (
  mainContentPosition: AuthLayoutProps['mainContentPosition'],
): Record<
  AuthLayoutVariants,
  { bannerWrapperClass: string; bannerClass: string }
> => ({
  type1: {
    bannerWrapperClass: 'p-4',
    bannerClass: 'rounded-4xl',
  },
  type2: {
    bannerWrapperClass: `pt-4 ${mainContentPosition === 'left' ? 'pl-4' : 'pr-4'}`,
    bannerClass: `${mainContentPosition === 'left' ? 'rounded-tl-4xl' : 'rounded-tr-4xl'}`,
  },
  type3: {
    bannerWrapperClass: '',
    bannerClass: '',
  },
  type4: {
    bannerWrapperClass: `${mainContentPosition === 'left' ? 'pl-4' : 'pr-4'}`,
    bannerClass: `${mainContentPosition === 'left' ? 'rounded-l-4xl' : 'rounded-r-4xl'}`,
  },
});

export function AuthLayout({
  bannerHeading = '',
  bannerSubheading = '',
  bannerHeadingClassName = '',
  bannerSubheadingClassName = '',
  children,
  banner,
  variant,
  headerLogo: HeaderLogo,
  mainContentPosition = 'left',
  bannerLabelPosition = 'top-left',
  wrapperClassName = '',
  bannerWrapperClassName = '',
}: Readonly<AuthLayoutProps>) {
  const { bannerWrapperClass, bannerClass } =
    getVariantClasses(mainContentPosition)[variant];

  const bannerLabelClass = bannerLabelClassMap[bannerLabelPosition];

  const showHeaderLogo = mainContentPosition === 'left';

  const headerLogo = HeaderLogo ? (
    <HeaderLogo />
  ) : (
    <BilldeskLogo width={99} height={24} />
  );

  return (
    <div
      className={`${wrapperClassName} ${mainContentPosition === 'right' ? 'flex-row-reverse' : ''} bg-fill-fill flex h-screen w-full`}
    >
      <div className="flex h-full min-w-0 flex-1 flex-col">
        <div
          className={`${
            mainContentPosition === 'left' ? 'pl-6 pr-14' : 'pl-14 pr-6'
          } flex h-full flex-col gap-4 py-6`}
        >
          {showHeaderLogo && headerLogo}

          <div className="flex min-h-0 flex-1 items-center justify-center">
            {children}
          </div>
        </div>
      </div>

      <div
        className={`${bannerWrapperClassName} ${bannerWrapperClass} ${mainContentPosition === 'left' ? 'justify-end' : ''} flex h-full w-[63.33%] max-w-[57rem]`}
      >
        {banner || (
          <DefaultBanner
            bannerHeading={bannerHeading}
            bannerSubheading={bannerSubheading}
            bannerHeadingClassName={bannerHeadingClassName}
            bannerSubheadingClassName={bannerSubheadingClassName}
            bannerClass={bannerClass}
            bannerLabelClass={bannerLabelClass}
          />
        )}
      </div>
    </div>
  );
}
