export default function ContentPanel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-8 text-[16px] md:text-[18px] text-gray-700 leading-[1.6]">
      {children}
    </div>
  );
}
