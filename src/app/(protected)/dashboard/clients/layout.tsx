"use client";
import Loading from "@/components/loading";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

// Move dynamic import outside component to prevent recreation on each render
const DynamicDetails = dynamic(
  () =>
    import("@/app/(protected)/dashboard/clients/details/page").then(
      (mod) => mod.default
    ),
  { ssr: false }
);

// Create a separate component that uses useSearchParams
const ClientsLayoutContent = ({ children }: { children: React.ReactNode }) => {
  const searchParams = useSearchParams();
  const clientId = searchParams.get("id");
  const hasPatient = Boolean(clientId);

  return (
    <div className="flex h-full bg-background">
      <div className="flex-1 overflow-hidden min-w-64 border-r">{children}</div>
      <div
        className={
          hasPatient
            ? "w-[calc(100vh-20rem)] overflow-hidden"
            : "w-0 overflow-hidden"
        }
      >
        <Suspense fallback={<Loading />}>
          <DynamicDetails />
        </Suspense>
      </div>
    </div>
  );
};

export default function ClientsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<Loading />}>
      <ClientsLayoutContent>{children}</ClientsLayoutContent>
    </Suspense>
  );
}
