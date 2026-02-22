import StandardShell from "@/components/standard/StandardShell";

export default function StandardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StandardShell>{children}</StandardShell>;
}
