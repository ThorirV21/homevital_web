import Image from 'next/image';
//import React from 'react';

interface navButtonProps {
  title: string;
  logo_path: string;
}

const NavButton: React.FC<navButtonProps> = ({ title, logo_path }) => {
  return (
    <li className="bg-white h-20 hover:bg-gray-100 shadow items-center flex px-8 gap-8">
      <Image src={logo_path} alt={title} width={30} height={30} />
      <a href={logo_path}>{title}</a>
    </li>
  );
};

export default NavButton;
