import { forwardRef } from 'react';

export interface UploadListHeaderProps {
  className?: string;
  showExpandedVersion: boolean;
  showBackButton: boolean;
  backButtonClickHandler?: () => void;
  backButtonClassname?: string;
  showUploadIcon?: boolean;
  fileUploadText?: string;
  fileUploadSubText?: string;
  closeClickHandler: () => void;
  titleClassName?: string;
  subTitleClassName?: string;
}

export const UploadListHeader = forwardRef<
  HTMLDivElement,
  UploadListHeaderProps
>(
  (
    {
      className = '',
      showExpandedVersion,
      showUploadIcon = false,
      fileUploadSubText = '',
      fileUploadText = '',
      closeClickHandler,
      subTitleClassName = '',
      titleClassName = '',
      showBackButton = false,
      backButtonClickHandler = () => {},
      backButtonClassname = '',
    },
    ref,
  ) => {
    const uploadIcon = (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.2382 16C11.2382 16.4734 11.5793 16.8571 12 16.8571C12.4207 16.8571 12.7618 16.4734 12.7618 16L12.7618 4.78174L16.5691 8.63711C16.8818 8.95379 17.3635 8.92526 17.6449 8.5734C17.9264 8.22153 17.901 7.67957 17.5883 7.36289L12.5096 2.22003C12.2199 1.92666 11.7801 1.92666 11.4904 2.22003L6.41175 7.36289C6.09902 7.67957 6.07367 8.22153 6.35512 8.5734C6.63658 8.92526 7.11826 8.95379 7.43098 8.63711L11.2382 4.78174L11.2382 16ZM3.63975 14.4266C3.70891 13.9597 3.42856 13.5181 3.01355 13.4402C2.59855 13.3624 2.20605 13.6779 2.13688 14.1448C1.95647 15.3627 1.8927 17.2247 2.33912 18.8277C2.56465 19.6376 2.93538 20.4347 3.53458 21.0337C4.14812 21.6469 4.94971 22 5.93551 22H18.6322C18.9435 22 20.0071 21.9967 20.868 20.8345C21.695 19.7178 22.1904 17.7221 21.9307 14.2145C21.8957 13.7428 21.5275 13.3922 21.1082 13.4315C20.6889 13.4709 20.3774 13.8852 20.4123 14.3569C20.6604 17.7065 20.1401 19.1394 19.6975 19.737C19.291 20.2858 18.8341 20.2857 18.6356 20.2857H5.93551C5.29613 20.2857 4.86191 20.0674 4.54648 19.7521C4.21671 19.4224 3.96531 18.9339 3.79301 18.3152C3.44378 17.0611 3.48158 15.4944 3.63975 14.4266Z"
          fill="#3B475B"
        />
      </svg>
    );

    const closeIcon = (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M22.341 19.1659C22.7205 19.5454 23.3358 19.5454 23.7154 19.1659C24.0949 18.7864 24.0949 18.1711 23.7154 17.7916L17.9238 12L23.7153 6.20843C24.0949 5.82891 24.0949 5.2136 23.7153 4.83408C23.3358 4.45457 22.7205 4.45457 22.341 4.83408L16.5494 10.6256L10.7579 4.83408C10.3784 4.45456 9.76304 4.45456 9.38352 4.83408C9.00401 5.21359 9.00401 5.82891 9.38352 6.20842L15.1751 12L9.38351 17.7916C9.004 18.1711 9.004 18.7864 9.38351 19.1659C9.76303 19.5454 10.3783 19.5454 10.7579 19.1659L16.5494 13.3743L22.341 19.1659Z"
          fill="#3B475B"
        />
      </svg>
    );

    const backButton = (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_6683_1408)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.32038 6.32775C8.65511 6.02401 8.65511 5.53155 8.32038 5.22781C7.98564 4.92406 7.44293 4.92406 7.10819 5.22781L0.251051 11.45C-0.0836837 11.7538 -0.0836837 12.2462 0.251051 12.55L7.10819 18.7722C7.44293 19.0759 7.98564 19.0759 8.32038 18.7722C8.65511 18.4685 8.65511 17.976 8.32038 17.6723L2.92648 12.7778H19.1429C19.6162 12.7778 20 12.4296 20 12C20 11.5705 19.6162 11.2222 19.1429 11.2222H2.92646L8.32038 6.32775Z"
            fill="#3B475B"
          />
        </g>
        <defs>
          <clipPath id="clip0_6683_1408">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
    );

    return (
      <div
        className={`${className} flex px-6 ${!showExpandedVersion ? 'border-border-border-light h-14 items-center border-b border-solid' : ''}`}
        ref={ref}
      >
        {(showUploadIcon || showExpandedVersion) && (
          <div className="border-border-border-light bg-fill-fill mr-4 h-fit rounded-lg border border-solid p-2 shadow-[0px_1px_2px_0px_rgba(27,32,41,0.05)]">
            {uploadIcon}
          </div>
        )}

        {showBackButton && !showExpandedVersion ? (
          <button
            type="button"
            onClick={backButtonClickHandler}
            className={backButtonClassname}
          >
            {backButton}
          </button>
        ) : undefined}

        <div className="flex flex-col">
          <div
            className={`${titleClassName} heading-3-semibold text-text-dark ${showBackButton && !showExpandedVersion ? 'ml-2' : ''}`}
          >
            {fileUploadText || 'File uploads'}
          </div>
          {showExpandedVersion && (
            <p
              className={`${subTitleClassName} paragraph-small text-text-text mt-0.5`}
            >
              {fileUploadSubText ||
                'All files recently uploaded will be view here. you can manage and controls the upload'}
            </p>
          )}
        </div>
        <div className={`${showExpandedVersion ? 'pl-4' : 'ml-auto'}`}>
          <button type="button" onClick={closeClickHandler} className="block">
            {closeIcon}
          </button>
        </div>
      </div>
    );
  },
);
