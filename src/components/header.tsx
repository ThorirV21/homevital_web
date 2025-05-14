import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex p-4 items-center border-b border-black">
      <Link href="/dashboard/clients/list">
        <Image
          src="/homeVital.svg"
          alt="HomeVital logo"
          priority
          width={100}
          height={100}
          className="mr-10"
          loading="eager"
        />
      </Link>
      <h1 className="text-2xl font-bold ml-10">Heimahjúkrun Akureyri</h1>
    </header>
  );
}
