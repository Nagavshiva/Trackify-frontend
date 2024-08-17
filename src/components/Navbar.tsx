import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RiMenu3Line } from "react-icons/ri";
import { IoMdClose } from 'react-icons/io';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const Links = [
        { name: 'PROJECTS', link: '/' },
        { name: 'TIME TRACKING', link: '/time-tracking' },
    ];

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="bg-blue-600 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white text-2xl font-bold">
                    <Link to="/">Trackify</Link>
                </div>
                <div className="md:hidden">
                    <button
                        onClick={toggleMenu}
                        className="text-white focus:outline-none"
                    >
                        {isOpen ? <IoMdClose className='font-bold'/> : <RiMenu3Line />}
                    </button>
                </div>
                <ul
                    className={`md:flex md:items-center md:pb-0 pb-12 bg-blue-600 absolute md:static md:z-auto z-10 left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${isOpen ? 'top-16' : 'top-[-400px]'}`}
                >
                    {Links.map((link) => (
                        <li key={link.name} className='md:ml-8 md:my-0 my-7 font-semibold'>
                            <Link to={link.link} className='block text-white px-1 py-2 rounded hover:bg-blue-700 duration-500'>{link.name}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
