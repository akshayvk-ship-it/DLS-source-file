export interface SubHeaderPros {
  className?: string;
  title: string;
  isSidebarVisible: boolean;
}

export function SubHeader({
  title,
  className = '',
  isSidebarVisible,
}: SubHeaderPros) {
  return (
    <p
      className={`${className} label-small text-text-light flex h-6 items-center pl-6 pr-10 font-medium ${!isSidebarVisible ? 'hidden' : ''}`}
    >
      {title}
    </p>
  );
}
