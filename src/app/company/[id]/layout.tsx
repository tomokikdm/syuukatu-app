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
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <CompanyTabs id={params.id} />
      {children}
    </div>
  );
}
