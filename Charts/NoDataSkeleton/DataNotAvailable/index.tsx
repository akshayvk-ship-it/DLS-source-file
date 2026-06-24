import { EmptyNoDataFoundIllustration } from '../../../Icons';

export interface DataNotAvailableProps {
  label?: string;
  wrapperClassName?: string;
  icon?: JSX.Element;
  iconClassName?: string;
  labelClassName?: string;
}

interface DataNotAvailableImplProps extends DataNotAvailableProps {
  children: JSX.Element;
  width: number | string;
  height: number;
}

function DataNotAvailable({
  width,
  height,
  children,
  label = 'Data not available',
  icon,
  iconClassName = '',
  wrapperClassName = '',
  labelClassName = '',
}: Readonly<DataNotAvailableImplProps>) {
  const renderNotAvailable = (
    <div
      className={`border-border-border-light bg-fill-fill absolute left-1/2 top-1/2 z-50 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4 rounded-2xl border p-4 ${wrapperClassName}`}
    >
      {icon ?? (
        <EmptyNoDataFoundIllustration
          className={`h-20 w-20 ${iconClassName}`}
        />
      )}
      <h5
        className={`text-text-text whitespace-nowrap font-semibold ${labelClassName}`}
      >
        {label}
      </h5>
    </div>
  );

  return (
    <div
      className="relative"
      style={{
        width: typeof width === 'string' ? width : `${width}px`,
        height: `${height}px`,
      }}
    >
      {children}
      {renderNotAvailable}
    </div>
  );
}

export default DataNotAvailable;
