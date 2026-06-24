import { Breadcrumbs, BreadcrumbsProps } from '../Breadcrumbs';
import { Button, ButtonProps as BtnProps } from '../Button';

export interface PageHeaderProps {
  title: string;
  subtitle: string;
  primaryBtnProps?: Omit<BtnProps, 'size' | 'hierarchy' | 'type'>;
  secondaryBtnProps?: Omit<BtnProps, 'size' | 'hierarchy' | 'type'>;
  breadCrumbsProps?: BreadcrumbsProps;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

export function PageHeader({
  title,
  subtitle,
  className = '',
  titleClassName = '',
  subtitleClassName = '',
  primaryBtnProps,
  secondaryBtnProps,
  breadCrumbsProps,
}: PageHeaderProps) {
  const BtnBaseProps = {
    size: 'lg',
    type: 'button',
  } as const;

  return (
    <div className={`${className ?? ''} flex w-full flex-col`}>
      {breadCrumbsProps && (
        <Breadcrumbs {...breadCrumbsProps} classNameWrapper="pb-2" />
      )}
      <div className="flex justify-between py-2">
        <div className="flex flex-col space-y-2">
          <h1
            className={`${titleClassName ?? ''} text-text-dark heading-1-semibold`}
          >
            {title}
          </h1>
          <p className={`${subtitleClassName ?? ''} text-text-text`}>
            {subtitle}
          </p>
        </div>
        <div className="flex space-x-4">
          {secondaryBtnProps && (
            <Button
              {...BtnBaseProps}
              {...secondaryBtnProps}
              hierarchy="Secondary"
            />
          )}
          {primaryBtnProps && (
            <Button
              {...BtnBaseProps}
              {...primaryBtnProps}
              hierarchy="Primary"
            />
          )}
        </div>
      </div>
    </div>
  );
}
