import Header from '@/components/header';
import Navigation from '@/components/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="">
        <Header />
      </div>
      <section className="flex flex-row flex-grow">
        <div className="border-r border-black w-1/6 min-w-fit">
          <Navigation />
        </div>
        <div className=" w-5/6">{children}</div>
      </section>
    </>
  );
}
