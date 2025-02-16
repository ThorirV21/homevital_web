import Image from "next/image";

export default function login() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center">
        <Image
          src="/homeVital.svg"
          alt="Logo"
          width={400}
          height={400}
          className="pb-40"
        />
        <button className="bg-[#3A7283] text-white font-bold py-2 px-20 rounded">
          <a href="/dashboard/clients">Innskráning</a>
        </button>
      </div>
    </div>
  );
}
