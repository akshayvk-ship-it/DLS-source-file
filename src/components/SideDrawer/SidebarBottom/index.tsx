import { Divider } from '../Divider';
import { DividerType } from '../types';

export interface SidebarBottomProps {
  className?: string;
  customSidebarBottom: (showSidebar?: boolean) => JSX.Element;
  divider?: DividerType;
}

export function SidebarBottom({
  className = '',
  customSidebarBottom,
  divider,
}: SidebarBottomProps) {
  return (
    <>
      {divider && divider?.showDivider && (
        <Divider
          className={divider.className}
          orientation={divider.orientation}
        />
      )}
      <div className={`${className}`}>{customSidebarBottom()}</div>
    </>
  );
}
