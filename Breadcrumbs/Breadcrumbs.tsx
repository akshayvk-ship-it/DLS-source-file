import { forwardRef, Fragment, useState } from 'react';

import HomeSVG from '../../icons/HomeSVG';

export interface BreadCrumbItem {
  key: string;
  element: (value: string) => JSX.Element;
}

/**
 * Breadcrumbs component for displaying navigation hierarchy.
 * Meets WCAG accessibility guidelines by using <nav> semantics and aria-current.
 */
export interface BreadcrumbsProps {
  breadcrumbsItems: BreadCrumbItem[];
  homeButtonClickHandler?: () => void;
  firstBreadcrumbElement?: JSX.Element;
  separator?: JSX.Element;
  classNameWrapper?: string;
  classNameEllipsis?: string;
  maxItems?: number;
}

export const Breadcrumbs = forwardRef<HTMLDivElement, BreadcrumbsProps>(
  (
    {
      breadcrumbsItems,
      homeButtonClickHandler = () => {},
      firstBreadcrumbElement,
      classNameWrapper = '',
      classNameEllipsis = '',
      separator,
      maxItems = 2,
    },
    ref,
  ) => {
    const [isExpanded, setIsExpanded] = useState(
      breadcrumbsItems.length <= maxItems,
    );

    const linkClassName =
      'hover:bg-fill-hover-light hover:text-text-action-hover rounded px-2 duration-200';

    const activeClassName =
      'bg-fill-action-light text-text-action label-small rounded px-2 font-semibold';

    const ceilNumber = Math.ceil(maxItems / 2);
    const floorNumber = Math.floor(maxItems / 2);
    const ceilBreadCrumbs = breadcrumbsItems.slice(-ceilNumber);
    const floorBreadCrumbs = breadcrumbsItems.slice(
      0,
      maxItems > 1 ? floorNumber : 1,
    );

    const homeButton = (
      <button
        className="hover:text-text-action-hover duration-200"
        type="button"
        aria-label="Home button"
        onClick={homeButtonClickHandler}
      >
        <HomeSVG />
      </button>
    );

    const breadCrumbDivider = separator || (
      <span
        className="text-text-lighter label-small font-medium"
        aria-hidden="true"
      >
        /
      </span>
    );

    const renderEllipsis = (
      <button
        onClick={() => setIsExpanded(true)}
        type="button"
        aria-label="See more"
        className={`${classNameEllipsis} hover:bg-fill-hover-light hover:text-text-action-hover`}
      >
        ...
      </button>
    );

    const breadCrumbsWithEllipsis = (
      <>
        {floorBreadCrumbs.map((item) => (
          <Fragment key={item.key}>
            {item.element(linkClassName)}
            {breadCrumbDivider}
          </Fragment>
        ))}
        {renderEllipsis}
        {breadCrumbDivider}
        {ceilBreadCrumbs.map((item, index) => {
          const isLast = ceilBreadCrumbs.length - 1 === index;
          return (
            <Fragment key={item.key}>
              {isLast ? (
                <span aria-current="page" className="inline-flex items-center">
                  {item.element(activeClassName)}
                </span>
              ) : (
                item.element(linkClassName)
              )}
              {!isLast && breadCrumbDivider}
            </Fragment>
          );
        })}
      </>
    );

    return (
      <nav
        aria-label="Breadcrumb"
        className={`${classNameWrapper} text-text-text label-small flex items-center py-0.5 font-medium [&>*]:mr-2 last:[&>*]:mr-0`}
        ref={ref}
      >
        {firstBreadcrumbElement || homeButton}
        {breadCrumbDivider}
        {isExpanded || maxItems === 0
          ? breadcrumbsItems.map((item, index) => {
              const isLast = breadcrumbsItems.length - 1 === index;
              return (
                <Fragment key={item.key}>
                  {isLast ? (
                    <span
                      aria-current="page"
                      className="inline-flex items-center"
                    >
                      {item.element(activeClassName)}
                    </span>
                  ) : (
                    item.element(linkClassName)
                  )}
                  {!isLast && breadCrumbDivider}
                </Fragment>
              );
            })
          : breadCrumbsWithEllipsis}
      </nav>
    );
  },
);
