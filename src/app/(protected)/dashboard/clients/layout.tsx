"use client";
import Loading from "@/components/loading";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Move dynamic import outside component to prevent recreation on each render
const DynamicDetails = dynamic(
  () =>
    import("@/app/(protected)/dashboard/clients/details/page").then(
      (mod) => mod.default
    ),
  { ssr: false }
);

export default function ClientsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full bg-background">
      <div className="flex-1 overflow-hidden min-w-64 border-r">{children}</div>
      <div className="max-w-[100%] overflow-hidden">
        <Suspense fallback={<Loading />}>
          <DynamicDetails />
        </Suspense>
      </div>
    </div>
  );
}
