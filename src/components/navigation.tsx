import React from 'react';
import NavButton from './navButton';

const elem = [
    {
        name: 'Skjólstæðingar',
        logo_path: '/nav_icons/People.svg',
    },
    {
        name: 'Viðvaranir',
        logo_path: '/nav_icons/Alarm.svg',
    },
    {
        name: 'Stillingar',
        logo_path: '/nav_icons/Settings.svg',
    },
    {
        name: 'Leiðbeiningar',
        logo_path: '/nav_icons/Info.svg',
    },
    {
        name: 'Útskrá',
        logo_path: '/nav_icons/Shutdown.svg',
    },
]

const Navigation: React.FC = () => {
    return (
        <nav className='flex justify-between flex-col h-full'>
            <ul>
                {elem.map((item, index) => {
                    return <NavButton key={index} title={item.name} logo_path={item.logo_path} />
                })}
            </ul>
            <div className='p-8 flex flex-col gap-6'>
                <div>
                    <h6 className='font-bold'>Innskráður notandi:</h6>
                    <p>Þórir Gunnar Valgeirsson</p>
                </div>
                <div>
                    <h6 className='font-bold'>Teymi:</h6>
                    <p>Sárateymi, Teymi 2</p>
                </div>
            </div>
        </nav>
    );
}

export default Navigation;