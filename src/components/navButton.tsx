"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/services/session";
import { Badge } from "./ui/badge";
import { useWarnings } from "@/hooks/useWarnings";
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
  const { data: warnings } = useWarnings();

  return (
    <li
      className={`bg-background h-20 hover:bg-gray-100 shadow items-center ${pathname === dashboard_path ? "shadow-[inset_0px_4px_4px_0px_rgba(0,0,0,0.25),inset_0px_-4px_4px_0px_rgba(0,0,0,0.25)]" : ""} `}
    >
      {title === "Útskrá" ? (
        <button
          className="flex items-center w-full h-full px-8 gap-8"
          onClick={logout}
        >
          <div className="relative w-8 h-8">
            <Image src={logo_path} alt={title} fill={true} />
          </div>
          {title}
        </button>
      ) : title === "Leiðbeiningar" ? (
        <a
          href="/Notendahandbok.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center w-full h-full px-8 gap-8"
        >
          <div className="relative w-8 h-8">
            <Image src={logo_path} alt={title} fill={true} />
          </div>
          {title}
        </a>
      ) : (
        <Link
          href={dashboard_path}
          className="flex items-center w-full h-full px-8 gap-8"
        >
          <div className="relative w-8 h-8">
            <Image src={logo_path} alt={title} fill={true} />
          </div>
          {title}
          {title === "Viðvaranir" && (
            <Badge className="ml-auto text-sm">{warnings?.totalCount}</Badge>
          )}
        </Link>
      )}
    </li>
  );
};

export default NavButton;
