import { forwardRef } from 'react';
import { Bar, BarProps } from '../../Loaders/Bar';
import { CheckboxBase } from '../../SelectionControls/Checkbox/Base';
import { Size } from '../../SelectionControls/helper';
import {
  CsvIcon,
  JpgIcon,
  PdfIcon,
  PngIcon,
  TxtIcon,
  XlsxIcon,
} from '../../Icons';

type FileType = 'csv' | 'xlsx' | 'pdf' | 'png' | 'jpg' | 'txt' | '';

export interface UploadProgressProps extends Omit<BarProps, 'progressValue'> {
  className?: string;
  fileName: string;
  fileSize: string;
  status: 'done' | 'selection' | 'default' | 'error';
  errorText?: string;
  fileIconClassName?: string;
  percentageTextClassName?: string;
  percentageValue: number;
  checkboxOnChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  deleteIconHandler: () => void;
  checkBoxSize?: Size;
  checkboxChecked?: boolean;
  fileType: FileType;
  customFileIcon?: JSX.Element;
  statusStateClassName?: string;
  fileSizeClassName?: string;
  fileNameClassName?: string;
}

export const UploadProgress = forwardRef<HTMLDivElement, UploadProgressProps>(
  (
    {
      className = '',
      fileName,
      fileSize,
      status = 'default',
      barColor,
      containerColor,
      height,
      maxWidth,
      time,
      fileIconClassName = '',
      percentageTextClassName = '',
      percentageValue,
      checkboxOnChange = () => {},
      deleteIconHandler,
      checkBoxSize = 'sm',
      checkboxChecked = false,
      fileType,
      customFileIcon,
      statusStateClassName = '',
      fileNameClassName = '',
      fileSizeClassName = '',
      isFinished,
      errorText,
    },
    ref,
  ) => {
    const deleteIcon = (
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
          d="M8.92308 2C8.49824 2 8.15385 2.3444 8.15385 2.76923C8.15385 3.19407 8.49824 3.53846 8.92308 3.53846H15.0769C15.5018 3.53846 15.8462 3.19407 15.8462 2.76923C15.8462 2.3444 15.5018 2 15.0769 2H8.92308ZM2 6.10256C2 5.67773 2.3444 5.33333 2.76923 5.33333H21.2308C21.6556 5.33333 22 5.67773 22 6.10256C22 6.5274 21.6556 6.87179 21.2308 6.87179H19.8853L18.1345 19.5649C17.942 20.9605 16.7492 22 15.3404 22H8.65957C7.25076 22 6.058 20.9605 5.86551 19.5649L4.11474 6.87179H2.76923C2.3444 6.87179 2 6.5274 2 6.10256ZM5.66777 6.87179H18.3322L16.6105 19.3547C16.523 19.989 15.9808 20.4615 15.3404 20.4615H8.65957C8.0192 20.4615 7.47704 19.989 7.38954 19.3547L5.66777 6.87179ZM9.94873 9.17949C10.3736 9.17949 10.718 9.52388 10.718 9.94872V16.1026C10.718 16.5274 10.3736 16.8718 9.94873 16.8718C9.52389 16.8718 9.17949 16.5274 9.17949 16.1026V9.94872C9.17949 9.52388 9.52389 9.17949 9.94873 9.17949ZM14.8205 9.94872C14.8205 9.52388 14.4761 9.17949 14.0513 9.17949C13.6264 9.17949 13.282 9.52388 13.282 9.94872V16.1026C13.282 16.5274 13.6264 16.8718 14.0513 16.8718C14.4761 16.8718 14.8205 16.5274 14.8205 16.1026V9.94872Z"
          fill="#3B475B"
        />
      </svg>
    );

    const tickIcon = (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 0C3.5907 0 0 3.5907 0 8C0 12.4093 3.5907 16 8 16C12.4093 16 16 12.4093 16 8C16 3.5907 12.4093 0 8 0ZM11.7209 6.54884L7.25581 11.014C7.10698 11.1628 6.92093 11.2372 6.73488 11.2372C6.54884 11.2372 6.36279 11.1628 6.21395 11.014L3.90698 8.74419C3.6093 8.44651 3.6093 7.9814 3.90698 7.68372C4.20465 7.38605 4.66977 7.38605 4.96744 7.68372L6.71628 9.43256L10.6605 5.48837C10.9581 5.1907 11.4233 5.1907 11.7209 5.48837C12 5.78605 12 6.25116 11.7209 6.54884Z"
          fill="#0D653C"
        />
      </svg>
    );

    const closeIcon = (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="fill-icon-error"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM11.8139 11.8142C11.6102 12.0179 11.2799 12.0179 11.0761 11.8142L7.96705 8.70503L4.85796 11.8142C4.65421 12.018 4.32388 12.018 4.12014 11.8142C3.91639 11.6105 3.91639 11.2801 4.12014 11.0764L7.22923 7.96718L4.11985 4.8577C3.9161 4.65395 3.91611 4.32361 4.11985 4.11985C4.32359 3.9161 4.65393 3.9161 4.85767 4.11985L7.96705 7.22933L11.0764 4.11988C11.2802 3.91613 11.6105 3.91613 11.8142 4.11988C12.018 4.32363 12.018 4.65398 11.8142 4.85773L8.70488 7.96718L11.8139 11.0763C12.0177 11.2801 12.0177 11.6104 11.8139 11.8142Z"
        />
      </svg>
    );

    const checkboxComponent = (
      <CheckboxBase
        onChange={checkboxOnChange}
        size={checkBoxSize}
        dataTestId="progress-checkbox"
        checked={checkboxChecked}
      />
    );

    const statusValue = {
      done: tickIcon,
      selection: checkboxComponent,
      default: (
        <button type="button" onClick={deleteIconHandler}>
          {deleteIcon}
        </button>
      ),
      error: closeIcon,
    };

    const FileIcons: Record<FileType, JSX.Element | undefined> = {
      csv: <CsvIcon />,
      xlsx: <XlsxIcon />,
      pdf: <PdfIcon />,
      png: <PngIcon />,
      jpg: <JpgIcon />,
      txt: <TxtIcon />,
      '': undefined,
    };

    return (
      <div ref={ref} className={`${className} flex`}>
        <div className="mr-2">
          {customFileIcon || (
            <div className={fileIconClassName}>{FileIcons[fileType]} </div>
          )}
        </div>
        <div className="flex flex-1 flex-col">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <p
                className={`${fileNameClassName} label-medium text-text-text font-medium`}
              >
                {fileName}
              </p>
              {status === 'error' ? (
                <p className="label-small text-text-error mt-0.5">
                  {errorText}
                </p>
              ) : (
                <p
                  className={`${fileSizeClassName} label-small text-text-text mt-0.5`}
                >
                  {fileSize}
                </p>
              )}
            </div>
            <div className={statusStateClassName}>{statusValue[status]}</div>
          </div>
          {status !== 'done' && status !== 'error' ? (
            <div className="mt-1 flex items-center">
              <Bar
                isFinished={isFinished}
                time={{
                  minTime: time?.minTime || '2s',
                  maxTime: time?.maxTime || '2s',
                }}
                height={height || 'h-1'}
                maxWidth={maxWidth || 'max-w-full'}
                barColor={barColor}
                containerColor={containerColor}
                progressValue={percentageValue}
              />
              <div
                className={`${percentageTextClassName || ''} label-extra-small text-text-text ml-4 w-7 text-right`}
              >
                {percentageValue}%
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    );
  },
);
