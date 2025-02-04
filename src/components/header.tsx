import Image from 'next/image';

export default function Header() {
  return (
    <header className="flex p-4 items-center border-b border-black">
      <Image
        src="/homeVital.svg"
        alt="HomeVital logo"
        width={100}
        height={100}
        className="mr-10"
      />
      <h1 className="text-2xl font-bold ml-10">Heimahjúkrun Akureyri</h1>
    </header>
  );
}
