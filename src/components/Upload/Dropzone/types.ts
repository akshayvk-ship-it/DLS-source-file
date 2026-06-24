export interface UploadStatusProps {
  subtext?: string;
  subtextClassName?: string;
  uploadStatusWrapperClassName?: string;
}

export interface ErrorStatusProps {
  errorMessage?: string;
  onReUploadButtonClick?: () => void;
  errorStatusWrapperClassName?: string;
}

export interface LoadingStatusProps {
  percentageTextClassName?: string;
  loadingPercentage?: number;
  time?: { minTime: `${number}s`; maxTime: `${number}s` };
  isFinished?: boolean;
  onDelete?: () => void;
  loadingStatusWrapperClassName?: string;
}

export interface SuccessStatusProps {
  onReUploadButtonClick?: () => void;
  successStatusWrapperClassName?: string;
}
