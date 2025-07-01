import React from "react";
import CompanyTabs from "@/components/CompanyTabs";

export default async function CompanyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  return (
    <div className="p-6">
      <CompanyTabs id={params.id} />
      {children}
    </div>
  );
}
