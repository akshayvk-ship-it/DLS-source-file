import React from 'react';
import { Button } from '../Button';
import {
  Error403MI,
  Error500MI,
  Error404MI,
} from '../Icons/MicroIllustrationsComponents';

type Key500 =
  | 'internal server issue'
  | 'unavailable service'
  | 'gateway timeout'
  | 'database error';
type Key404 =
  | 'broken or dead link'
  | 'mispelled url'
  | 'moved or deleted'
  | 'server config issue';
type Key403 =
  | 'forbidden access'
  | 'blocked IP'
  | 'authentication error'
  | 'blocked access';

type ErrorType500 = {
  errorCode: 500;
  errorCase: Key500;
};

type ErrorType404 = {
  errorCode: 404;
  errorCase: Key404;
};

type ErrorType403 = {
  errorCode: 403;
  errorCase: Key403;
};

type ErrorTypeCustorm = {
  errorCode: 403 | 404 | 500;
  errorCase: 'custom';
};

type ButtonPreview = {
  label: string;
  icon?: JSX.Element;
  onClick?: () => void;
  buttonClassName?: string;
};

type ActionElements = {
  primary: ButtonPreview;
  secondary?: ButtonPreview;
};

export interface ErrorPageProps {
  title?: string;
  subtext?: string;
  showSubtext?: boolean;
  showImage?: boolean;
  imageElement?: JSX.Element;
  errorType: ErrorType500 | ErrorType404 | ErrorType403 | ErrorTypeCustorm;
  actionElements: ActionElements;
  titleClassName?: string;
  subtextClassName?: string;
  wrapperClassName?: string;
}

export const ErrorPage = React.forwardRef<HTMLDivElement, ErrorPageProps>(
  (
    {
      title,
      subtext,
      imageElement,
      errorType,
      actionElements,
      showSubtext = true,
      showImage = true,
      wrapperClassName = '',
      subtextClassName = '',
      titleClassName = '',
    },
    ref,
  ) => {
    const image = {
      500: <Error500MI className="h-[7.5rem]" />,
      404: <Error404MI className="h-[7.5rem]" />,
      403: <Error403MI className="h-[7.5rem]" />,
    };

    const content: Record<Key404 | Key500 | Key403 | 'custom', string[]> = {
      'internal server issue': [
        'Oops! something went wrong',
        'Our servers are down, we are working on it',
      ],
      'unavailable service': [
        'Taking a Quick Break',
        'We’re currently performing maintenance or experiencing high traffic. Please try again later',
      ],
      'gateway timeout': [
        'Oops! Timeout',
        'We’re currently performing maintenance or experiencing high traffic. Please try again later',
      ],
      'database error': [
        'Database Meltdown',
        'We’re having trouble with our database. Try again later or contact us if it keeps happening.',
      ],
      'broken or dead link': [
        'Oops!  Page not found.',
        'The page you are looking for is temporarily removed.',
      ],
      'mispelled url': [
        'Uh-oh! Wrong Turn',
        'The URL seems incorrect. Double-check the spelling or use the homepage to find what you need.',
      ],
      'moved or deleted': [
        'Oops! This Page Took a Detour',
        'This page has been moved or deleted. Use the menu or search bar to find the new location.',
      ],
      'server config issue': [
        'We’re Having a Tech Glitch',
        'There’s a technical issue on our end. Please try again later or contact support if the problem continues',
      ],
      'forbidden access': [
        'Forbidden Access',
        'You’re not authorized to view the page. Please check your permissions or contact support',
      ],
      'blocked IP': [
        'Access Blocked by IP',
        'Your IP address is restricted from accessing this page. Please try from a different network or contact support.',
      ],
      'authentication error': [
        'Authentication Needed',
        'This page requires additional authentication. Please log in or provide the necessary credentials to access it',
      ],
      'blocked access': [
        'Access Blocked',
        'Your request has been blocked by our security settings. Please review the security policies or contact support for help..',
      ],
      custom: [title!, subtext!],
    };

    return (
      <div
        ref={ref}
        className={`flex flex-col justify-between px-4 pb-10 pt-6 ${wrapperClassName} `}
      >
        <div className="flex h-full flex-col items-center justify-center ">
          {showImage && (imageElement ?? image[errorType.errorCode])}
          <div className="mt-6 w-full">
            <div
              className={`sm:heading-1 heading-3 text-text-text text-center font-semibold ${titleClassName}`}
            >
              {content[errorType.errorCase][0]}
            </div>
            {showSubtext && (
              <div
                className={`sm:paragraph-large paragraph-medium text-text-light mt-1 text-center sm:mt-2 ${subtextClassName}`}
              >
                {content[errorType.errorCase][1]}
              </div>
            )}
          </div>
        </div>
        <div className="mt-10 flex w-full flex-col justify-center sm:flex-row">
          {actionElements.secondary ? (
            <Button
              className={`mb-6 sm:mb-0 sm:mr-6 ${actionElements.secondary.buttonClassName}`}
              hierarchy="Secondary"
              label={actionElements.secondary.label}
              size="lg"
              type="button"
              icon={actionElements.secondary.icon}
              onClick={actionElements.secondary.onClick}
            />
          ) : undefined}

          <Button
            hierarchy="Primary"
            label={actionElements.primary.label}
            size="lg"
            type="button"
            icon={actionElements.primary.icon}
            onClick={actionElements.primary.onClick}
            className={` ${actionElements.primary.buttonClassName}`}
          />
        </div>
      </div>
    );
  },
);
