export type Position =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'right-top'
  | 'right-center'
  | 'right-bottom'
  | 'left-top'
  | 'left-center'
  | 'left-bottom'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface ToolTipBaseProps {
  titleToolTip?: string;
  classNameToolTip?: string;
  contentToolTip?: JSX.Element | string;
  placementToolTip: Position;
  renderCustomContentToolTip?: JSX.Element;
  toolTipType?: 'plain' | 'contextual';
  suffixIcon?: JSX.Element;
}

export function ToolTipBase({
  titleToolTip = '',
  contentToolTip = '',
  placementToolTip,
  classNameToolTip = '',
  renderCustomContentToolTip,
  toolTipType = 'plain',
  suffixIcon,
}: ToolTipBaseProps) {
  const placementClassName = {
    'top-left': 'bottom-full left-0 -translate-y-2',
    'top-center': 'bottom-full left-1/2 -translate-y-2 -translate-x-1/2',
    'top-right': 'bottom-full right-0 -translate-y-2',
    'right-top': 'left-full top-0 translate-x-2',
    'right-center': 'left-full top-1/2 translate-x-2 -translate-y-1/2',
    'right-bottom': 'left-full bottom-0 translate-x-2',
    'left-top': 'right-full top-0 -translate-x-2',
    'left-center': 'right-full top-1/2 -translate-x-2 -translate-y-1/2',
    'left-bottom': 'right-full bottom-0 -translate-x-2',
    'bottom-left': 'top-full left-0 translate-y-3',
    'bottom-center': 'top-full left-1/2 translate-y-3 -translate-x-1/2',
    'bottom-right': 'top-full right-0 translate-y-3',
  };

  const tooltipArrowClassName = {
    'top-left': '-bottom-1.5 left-0 translate-x-4 rotate-[45deg]',
    'top-center': '-bottom-1.5 right-1/2 translate-x-1/2 rotate-[45deg]',
    'top-right': '-bottom-1.5 right-0 -translate-x-4 rotate-[45deg]',
    'right-top': '-left-1.5 top-0 translate-y-3 rotate-[135deg]',
    'right-center': '-left-1.5 top-1/2 -translate-y-1/2 rotate-[135deg]',
    'right-bottom': '-left-1.5 bottom-0 -translate-y-3 rotate-[135deg]',
    'left-top': '-right-1.5 top-0 translate-y-3 rotate-[45deg]',
    'left-center': '-right-1.5 top-1/2 -translate-y-1/2 rotate-[45deg]',
    'left-bottom': '-right-1.5 bottom-0 -translate-y-3 rotate-[45deg]',
    'bottom-left': '-top-1.5 left-0 translate-x-4 rotate-[135deg]',
    'bottom-center': '-top-1.5 right-1/2 translate-x-1/2 rotate-[135deg]',
    'bottom-right': '-top-1.5 right-0 -translate-x-4 rotate-[135deg]',
  };

  return (
    <div
      className={`bg-fill-info-dark absolute rounded-md p-2 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(27,32,41,0.06)] ${classNameToolTip} ${placementClassName[placementToolTip]}`}
    >
      {toolTipType === 'contextual' && (
        <span
          className={`bg-fill-info-dark border-fill-info-dark absolute -z-10 h-3 w-3 border-b border-r ${tooltipArrowClassName[placementToolTip]}`}
        />
      )}
      {renderCustomContentToolTip || (
        <>
          <div className="label-small text-text-on-fill flex whitespace-nowrap font-semibold">
            {titleToolTip}
            {suffixIcon}
          </div>

          <div className="label-small text-text-on-fill">{contentToolTip}</div>
        </>
      )}
    </div>
  );
}
