import { forwardRef } from 'react';
import { DeprecatedDropZone } from './DeprecatedDropZone';
import { FileType, NewDropZone } from './NewDropZone';
import {
  ErrorStatusProps,
  LoadingStatusProps,
  SuccessStatusProps,
  UploadStatusProps,
} from './types';

export type DropZoneProps = {
  className?: string;
  dataTestId?: string;
  disabled?: boolean;
  fileSupportText?: string;
  fileSupportTextClassName?: string;
  clickableText?: string;
  clickableTextClassName?: string;
  multipleUpload?: boolean;
  uploadText?: string;
  uploadTextClassName?: string;
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
  isNewDropZone?: boolean;
};

export const DropZone = forwardRef<HTMLDivElement, DropZoneProps>(
  (props, ref) => {
    if (props.isNewDropZone) {
      return <NewDropZone {...props} ref={ref} />;
    }

    return <DeprecatedDropZone {...props} ref={ref} />;
  },
);
