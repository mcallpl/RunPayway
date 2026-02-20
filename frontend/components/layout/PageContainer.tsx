export default function PageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-[1200px] mx-auto px-6">
      {children}
    </div>
  );
}
