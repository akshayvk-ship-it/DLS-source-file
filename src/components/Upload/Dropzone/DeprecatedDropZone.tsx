// TODO: Remove this file in next major release

import React, { forwardRef, useRef, useState } from 'react';
import { IconCloudSvg } from './IconCloudSvg';

export interface DeprecatedDropZoneProps {
  className?: string;
  dataTestId?: string;
  disabled?: boolean;
  uploadText?: string;
  uploadTextClassName?: string;
  fileSupportText?: string;
  fileSupportTextClassName?: string;
  clickableText?: string;
  clickableTextClassName?: string;
  multipleUpload?: boolean;
  setFilesHandler: (files: File | FileList) => void;
}

export const DeprecatedDropZone = forwardRef<
  HTMLDivElement,
  DeprecatedDropZoneProps
>(
  (
    {
      className = '',
      dataTestId = 'dropzone',
      disabled = false,
      uploadText,
      uploadTextClassName = '',
      fileSupportText = '',
      fileSupportTextClassName = '',
      clickableText,
      clickableTextClassName = '',
      multipleUpload = false,
      setFilesHandler,
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isHover, setIsHover] = useState(false);

    const handleFileInput = async (inputFile?: File | FileList) => {
      if (!inputFile) {
        return;
      }

      setFilesHandler(inputFile);
    };

    // handle drag enter and exit
    const handleDragHover = (
      isEnter: boolean,
      e: React.DragEvent<HTMLDivElement>,
    ) => {
      e.preventDefault();

      if (e.currentTarget.contains(e.target as Node) && isEnter) {
        setIsHover(true);
      }

      if (!e.currentTarget.contains(e.target as Node) && !isEnter) {
        setIsHover(false);
      }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (disabled) return;

      setIsHover(false);

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

    const renderContent = (
      <>
        <IconCloudSvg className="max-w-[4.375rem]" />
        <div className="mt-2 flex flex-col items-center">
          {uploadText && (
            <p className={`${uploadTextClassName} mb-1`}>{uploadText}</p>
          )}
          <span className="label-medium text-text-light">
            <span
              className={`${disabled ? '!text-text-disabled !cursor-default' : ''} text-fill-action mr-1 cursor-pointer font-semibold ${clickableTextClassName} `}
              onClick={!disabled ? handlePickFile : undefined}
              onKeyDown={
                !disabled
                  ? (e) => {
                      if (e.key === 'Enter') {
                        handlePickFile();
                      }
                    }
                  : undefined
              }
              role="button"
              tabIndex={-1}
            >
              {clickableText || 'Click to upload'}
            </span>
            {!clickableText ? 'or drag and drop' : ''}
          </span>
          <p
            className={`${fileSupportTextClassName} label-small text-text-light mt-0.5`}
          >
            {fileSupportText || 'We support CSV, PDF, excel format'}
          </p>
        </div>
      </>
    );

    return (
      <div
        className={` ${className} relative h-[11.25rem] w-[28.5625rem] rounded-lg ${isHover ? '!bg-fill-action-lighter !border-border-action !border-solid' : 'bg-surface-surface'} border-border-border flex flex-col items-center justify-center border border-dashed px-10 py-4 ${disabled ? '!bg-fill-hover-light !border-border-border-light' : ''}`}
        onDragEnter={!disabled ? (e) => handleDragHover(true, e) : undefined}
        onDragLeave={!disabled ? (e) => handleDragHover(false, e) : undefined}
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
          multiple
        />
        {renderContent}
      </div>
    );
  },
);
