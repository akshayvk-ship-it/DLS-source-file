import React, { forwardRef, useEffect, useRef, useState } from 'react';
import {
  CsvIcon,
  DeleteIcon,
  DownloadIcon,
  EmptyUploadFileIllustration,
  JpgIcon,
  PdfIcon,
  PngIcon,
  TxtIcon,
  UploadFileIllustration,
  UploadIcon,
  XlsxIcon,
  ZipIcon,
} from '../../Icons';
import { Button } from '../../Button';
import SuccessIcon from '../icons/SuccessIcon';
import ErrorFileIcon from '../icons/ErrorFileIcon';
import FailureIcon from '../icons/FailureIcon';
import { Bar } from '../../Loaders/Bar';
import {
  ErrorStatusProps,
  LoadingStatusProps,
  SuccessStatusProps,
  UploadStatusProps,
} from './types';

export type FileType = 'csv' | 'pdf' | 'png' | 'jpg' | 'xlsx' | 'txt' | 'zip';

export type NewDropZoneProps = {
  className?: string;
  dataTestId?: string;
  disabled?: boolean;
  fileSupportText?: string;
  fileSupportTextClassName?: string;
  clickableText?: string;
  clickableTextClassName?: string;
  multipleUpload?: boolean;
  setFilesHandler: (files: File | FileList) => void;
  includeCTASection?: boolean;
  ctaText?: string;
  ctaButtonText?: string;
  ctaButtonOnClick?: () => void;
  status?: 'upload' | 'success' | 'error' | 'loading';
  fileName?: string;
  fileType?: FileType;
  customFileIcon?: JSX.Element;
  fileSize?: string;
  successStatusProps?: SuccessStatusProps;
  uploadStatusProps?: UploadStatusProps;
  loadingStatusProps?: LoadingStatusProps;
  errorStatusProps?: ErrorStatusProps;
  clickableHelperText?: string;
  ctaWrapperClassName?: string;
};

export const NewDropZone = forwardRef<HTMLDivElement, NewDropZoneProps>(
  (
    {
      className,
      dataTestId = 'dropzone',
      disabled = false,
      fileSupportText,
      fileSupportTextClassName = '',
      clickableText,
      clickableTextClassName = '',
      multipleUpload = false,
      setFilesHandler,
      includeCTASection = false,
      ctaText,
      ctaButtonText,
      ctaButtonOnClick,
      status = 'upload',
      fileName,
      fileType,
      fileSize,
      customFileIcon,
      loadingStatusProps,
      successStatusProps,
      uploadStatusProps,
      errorStatusProps,
      clickableHelperText,
      ctaWrapperClassName = '',
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isHover, setIsHover] = useState(false);
    const dragCounterRef = useRef(0);

    const dragHasFiles = (
      e: React.DragEvent<HTMLDivElement | HTMLInputElement>,
    ) => {
      const types = e.dataTransfer?.types ?? [];
      return Array.from(types).includes('Files');
    };

    const handleFileInput = async (inputFile?: File | FileList) => {
      if (!inputFile) {
        return;
      }

      setFilesHandler(inputFile);
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (disabled) return;
      if (!dragHasFiles(e)) return;
      dragCounterRef.current += 1;
      setIsHover(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (disabled) return;
      if (!dragHasFiles(e)) return;
      dragCounterRef.current = Math.max(0, dragCounterRef.current - 1);
      if (dragCounterRef.current === 0) {
        setIsHover(false);
      }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (disabled) return;

      setIsHover(false);
      dragCounterRef.current = 0;

      if (multipleUpload) {
        handleFileInput(e.dataTransfer.files).catch(() => {});
      } else {
        handleFileInput(e.dataTransfer.files[0]).catch(() => {});
      }
    };

    // trigger file browser dialog
    const handlePickFile = () => {
      inputRef.current?.click();
    };

    const handleInputFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (multipleUpload) {
        handleFileInput(e.target.files ? e.target.files : undefined).catch(
          () => {},
        );
      } else {
        handleFileInput(e.target.files ? e.target.files[0] : undefined).catch(
          () => {},
        );
      }
    };

    // Ensure re-upload of the same file triggers onChange by clearing the input when returning to 'upload'
    useEffect(() => {
      if (status === 'upload' && inputRef.current) {
        inputRef.current.value = '';
      }
    }, [status]);

    const containerWidthClass = 'w-[46.688rem]';

    const baseContainerClass = `bg-fill-fill-dark relative h-[11.25rem] ${containerWidthClass} border-border-border flex flex-col items-center justify-center rounded-lg border border-dashed px-4 py-4`;
    const getContainerClassNames = () => {
      let hoverOrBase = '';
      if (status === 'upload') {
        hoverOrBase = isHover
          ? '!bg-fill-action-lighter !border-border-action !border-solid'
          : '!bg-fill-fill';
      }
      const disabledClassName = disabled
        ? '!bg-fill-hover-light !border-border-border-light !cursor-not-allowed'
        : '';
      return `${baseContainerClass} ${hoverOrBase} ${disabledClassName} ${className ?? ''}`;
    };

    const renderUpload = () => (
      <div className="flex w-full flex-col items-center justify-center">
        {disabled ? (
          <EmptyUploadFileIllustration className="size-18 block self-center" />
        ) : (
          <UploadFileIllustration className="size-18 block self-center" />
        )}
        <div className="mt-2 flex flex-col items-center">
          <span
            className={`label-large ${disabled ? 'text-text-disabled' : 'text-text-text'} font-medium`}
          >
            <button
              type="button"
              className={`${disabled ? '!text-text-disabled !cursor-default' : 'text-fill-action cursor-pointer'} mr-1 font-semibold ${clickableTextClassName}`}
              onClick={handlePickFile}
              disabled={disabled}
            >
              {clickableText ?? 'Click to upload'}
            </button>
            {clickableHelperText ?? 'or drag and drop'}
          </span>
          {uploadStatusProps?.subtext && (
            <p
              className={`label-small mt-0.5 ${disabled ? 'text-text-disabled' : 'text-text-light'} ${uploadStatusProps?.subtextClassName ?? ''}`}
            >
              {uploadStatusProps?.subtext}
            </p>
          )}
          <p
            className={`label-small ${disabled ? 'text-text-disabled' : 'text-text-light'} mt-0.5 ${fileSupportTextClassName}`}
          >
            {fileSupportText ?? 'We support CSV, PDF, excel format'}
          </p>
        </div>
      </div>
    );

    const fileIcons: Record<FileType, JSX.Element> = {
      csv: <CsvIcon />,
      xlsx: <XlsxIcon />,
      pdf: <PdfIcon />,
      png: <PngIcon />,
      jpg: <JpgIcon />,
      txt: <TxtIcon />,
      zip: <ZipIcon />,
    };

    const renderSuccess = () => (
      <div
        className={`flex w-full justify-between ${successStatusProps?.successStatusWrapperClassName ?? ''}`}
      >
        <div className="flex items-center">
          {customFileIcon ?? (fileType && fileIcons[fileType])}
          <div className="ml-2 flex flex-col gap-0.5">
            <p className="label-medium text-text-text font-medium">
              {fileName}
            </p>
            <p className="label-small text-text-text">{fileSize}</p>
          </div>
        </div>
        <div className="flex items-center">
          <SuccessIcon />
          <Button
            disabled={disabled}
            hierarchy="Secondary"
            className="!border-border-border !mr-0 ml-4 flex-row-reverse gap-1 !py-[0.438rem] !pl-4 !pr-3 [&>span]:!mx-0"
            size="sm"
            type="button"
            onClick={successStatusProps?.onReUploadButtonClick}
            icon={<UploadIcon className="size-[1.125rem]" />}
            label="Re-Upload"
          />
        </div>
      </div>
    );

    const renderError = () => (
      <div
        className={`flex w-full justify-between ${errorStatusProps?.errorStatusWrapperClassName ?? ''}`}
      >
        <div className="flex items-center">
          <ErrorFileIcon />
          <div className="ml-2 flex flex-col">
            <p className="label-medium text-text-text font-medium">
              {fileName}
            </p>
            <p className="label-small text-text-error">
              {errorStatusProps?.errorMessage}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <FailureIcon />
          <Button
            hierarchy="Secondary"
            className="!mr-0 ml-4 flex-row-reverse gap-1 !py-[0.438rem] !pl-4 !pr-3 [&>span]:!mx-0"
            size="sm"
            type="button"
            onClick={errorStatusProps?.onReUploadButtonClick}
            icon={<UploadIcon className="size-[1.125rem]" />}
            label="Re-Upload"
          />
        </div>
      </div>
    );

    const renderLoading = () => (
      <div className="flex w-full">
        <div className="mr-2">
          {customFileIcon || <div>{fileType && fileIcons[fileType]}</div>}
        </div>
        <div className="flex flex-1 flex-col">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <p className="label-medium text-text-text font-medium">
                {fileName}
              </p>
              <p className="label-small text-text-text mt-0.5">{fileSize}</p>
            </div>
            <DeleteIcon onClick={loadingStatusProps?.onDelete} />
          </div>

          <div className="mt-1 flex items-center">
            <Bar
              isFinished={loadingStatusProps?.isFinished ?? false}
              time={{
                minTime: loadingStatusProps?.time?.minTime ?? '2s',
                maxTime: loadingStatusProps?.time?.maxTime ?? '2s',
              }}
              height="h-1"
              maxWidth="max-w-full"
              barColor="bg-fill-action"
              containerColor="bg-fill-pressed-dark"
              progressValue={loadingStatusProps?.loadingPercentage ?? 0}
            />
            <div className="label-extra-small text-text-text ml-4 w-7 text-right">
              {loadingStatusProps?.loadingPercentage ?? 0}%
            </div>
          </div>
        </div>
      </div>
    );

    const renderContent = () => {
      switch (status) {
        case 'success':
          return renderSuccess();
        case 'error':
          return renderError();
        case 'loading':
          return renderLoading();
        default:
          return renderUpload();
      }
    };

    return (
      <>
        <div
          className={getContainerClassNames()}
          onDragEnter={!disabled ? handleDragEnter : undefined}
          onDragLeave={!disabled ? handleDragLeave : undefined}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          data-testid={dataTestId}
          ref={ref}
        >
          <input
            type="file"
            name="drop-zone"
            id="drop-zone"
            className="hidden"
            ref={inputRef}
            onChange={handleInputFileChange}
            data-testid="dropzone-input"
            multiple={multipleUpload}
          />
          {renderContent()}
        </div>
        {includeCTASection && (
          <div
            className={`bg-fill-fill-dark mt-2 ${containerWidthClass} flex h-[4.25rem] items-center rounded-lg px-[1.875rem] ${ctaWrapperClassName}`}
          >
            <p className="label-medium text-text-text font-normal">{ctaText}</p>
            <Button
              disabled={disabled}
              className="ml-6"
              hierarchy="Secondary"
              size="sm"
              type="button"
              onClick={ctaButtonOnClick}
              icon={<DownloadIcon className="size-[1.125rem]" />}
              label={ctaButtonText}
            />
          </div>
        )}
      </>
    );
  },
);
