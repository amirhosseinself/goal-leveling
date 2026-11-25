"use client";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="pt-14">{children}</div>;
}
