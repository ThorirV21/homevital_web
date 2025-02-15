"use client";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function ClientsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const DynamicDetails = dynamic(
    () => import("@/app/(protected)/dashboard/clients/details/page"),
    { ssr: false }
  );

  return (
    <div className="flex h-full">
      <div className="w-1/2 border-r">{children}</div>
      <div className="w-1/2">
        <Suspense fallback={<p>Loading...</p>}>
          {id ? (
            <DynamicDetails />
          ) : (
            <p className="text-gray-500">Select client</p>
          )}
        </Suspense>
      </div>
    </div>
  );
}
