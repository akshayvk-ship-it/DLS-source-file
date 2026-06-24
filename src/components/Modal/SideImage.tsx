import { SideImageProps } from './types';

// eslint-disable-next-line import/prefer-default-export
export function SideImage({ children }: SideImageProps) {
  return <div className="h-full w-full overflow-hidden">{children}</div>;
}
