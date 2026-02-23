import PortalHeader from "@/components/layout/PortalHeader";
import ReturnGuard from "@/components/portal/ReturnGuard";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PortalHeader />
      <ReturnGuard />
      <div className="pt-16 flex-1">{children}</div>
    </>
  );
}
