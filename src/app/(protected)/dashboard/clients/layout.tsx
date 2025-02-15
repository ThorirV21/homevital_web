"use client";
import dynamic from "next/dynamic";

export default function ClientsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const DynamicDetails = dynamic(
    () => import("@/app/(protected)/dashboard/clients/details/page"),
    { ssr: false }
  );

  return (
    <div className="flex h-full">
      <div className="w-1/2 border-r">{children}</div>
      <div className="w-1/2">
        <DynamicDetails /> : <p className="text-gray-500">Select client</p>
      </div>
    </div>
  );
}
