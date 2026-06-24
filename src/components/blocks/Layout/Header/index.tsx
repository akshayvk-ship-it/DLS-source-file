export default function HeaderContainer({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <header className="h-18 border-border-border-light bg-fill-fill flex w-full shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="w-full p-4">
        <div className="flex w-full flex-1 items-center">{children}</div>
      </div>
    </header>
  );
}
