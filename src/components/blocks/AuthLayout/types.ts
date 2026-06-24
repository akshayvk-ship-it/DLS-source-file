/* eslint-disable import/prefer-default-export */
import type { JSX } from 'react';
import { DefaultBannerProps } from './components/DefaultBanner';

type AuthLayoutVariants = 'type1' | 'type2' | 'type3' | 'type4';

type BannerLabelPosition = 'top-left' | 'bottom-left' | 'bottom-center';

interface AuthLayoutProps
  extends Pick<
    DefaultBannerProps,
    | 'bannerHeading'
    | 'bannerSubheading'
    | 'bannerHeadingClassName'
    | 'bannerSubheadingClassName'
  > {
  children: React.ReactNode;
  banner?: React.ReactNode | JSX.Element;
  mainContentPosition?: 'left' | 'right';
  variant: AuthLayoutVariants;
  headerLogo?: React.ComponentType<React.SVGAttributes<SVGElement>>;
  wrapperClassName?: string;
  bannerWrapperClassName?: string;
  bannerLabelPosition?: BannerLabelPosition;
}

export type { AuthLayoutVariants, AuthLayoutProps, BannerLabelPosition };
