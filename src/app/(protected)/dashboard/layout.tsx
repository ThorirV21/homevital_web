import Header from "@/components/header";
import Navigation from "@/components/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="overflow-hidden">
        <Header />
      </div>
      <section className="flex flex-row flex-1 overflow-hidden">
        <div className="border-r border-black w-1/6 min-w-fit overflow-hidden">
          <Navigation />
        </div>
        <div className="w-5/6 overflow-hidden">{children}</div>
      </section>
    </>
  );
}
