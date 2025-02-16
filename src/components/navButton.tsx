"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
//import React from 'react';

interface navButtonProps {
  title: string;
  logo_path: string;
  dashboard_path: string;
}

const NavButton: React.FC<navButtonProps> = ({
  title,
  logo_path,
  dashboard_path,
}) => {
  const pathname = usePathname();

  return (
    <li
      className={`bg-white h-20 hover:bg-gray-100 shadow items-center ${pathname === dashboard_path ? "shadow-[inset_0px_4px_4px_0px_rgba(0,0,0,0.25),inset_0px_-4px_4px_0px_rgba(0,0,0,0.25)]" : ""} `}
    >
      <Link
        href={dashboard_path}
        className="flex items-center w-full h-full px-8 gap-8"
      >
        <Image src={logo_path} alt={title} width={50} height={30} />
        {title}
      </Link>
    </li>
  );
};

export default NavButton;
