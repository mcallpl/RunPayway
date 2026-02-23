import Header from "@/components/layout/Header";
import BlueBar from "@/components/layout/BlueBar";
import Footer from "@/components/layout/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <BlueBar />
      <div className="flex-1">{children}</div>
      <Footer />
    </>
  );
}
