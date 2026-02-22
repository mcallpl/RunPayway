export default function StandardMain({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1 min-w-0 px-6 lg:px-10" style={{ paddingTop: "48px", paddingBottom: "64px" }}>
      <div className="max-w-[760px]">{children}</div>
    </main>
  );
}
