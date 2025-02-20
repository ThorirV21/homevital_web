"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";

export default function ClientsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const DynamicDetails = dynamic(
    () =>
      import("@/app/(protected)/dashboard/clients/details/page").then(
        (mod) => mod.default
      ),
    { ssr: false }
  );

  return (
    <div className="flex h-full bg-white">
      <div className="w-1/2 border-r">{children}</div>
      <div className="w-1/2">
        <Suspense fallback={<div>Loading...</div>}>
          <DynamicDetails />
        </Suspense>
      </div>
    </div>
  );
}
