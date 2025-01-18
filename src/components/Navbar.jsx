import React, { useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom'
import { navItemsData } from '../data/nav-items';

const Navbar = () => {

    // State to manage the navbar's visibility
    const [nav, setNav] = useState(false);

    // Toggle function to handle the navbar's display
    const handleNav = () => {
        setNav(!nav);
    };

    // Array containing navigation items
    const navItems = [
        { id: 1, text: 'Home' },
        { id: 2, text: 'About' },
        { id: 3, text: 'DSA' },
        { id: 4, text: 'Contact' },
    ];

    return (
        <div className='bg-signature_dark    flex justify-between items-center h-24 mx-auto px-10 text-vite_light'>
            
            {/* Logo */}
            <h1 className='text-3xl font-bold text-signature_yellow'>Shash Code</h1>

            {/* Desktop Navigation */}
            <ul className='hidden md:flex'>
                
                {navItemsData.map(navItem => (
                    <li
                        key={navItem.id}
                        className='p-4 hover:bg-signature_yellow rounded-xl m-2 cursor-pointer duration-300 hover:text-signature_dark flex gap-2 items-center'
                    >
                       
                        <span className="flex items-center justify-center h-full">
                            <navItem.icon className="h-full w-auto" />
                        </span>
                     
                        <Link to={navItem.url} className='leading-none'> {navItem.title} </Link>
                    </li>
                ))}
            </ul>

            {/* Mobile Navigation Icon */}
            <div onClick={handleNav} className='block md:hidden cursor-pointer'>
                {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
            </div>

            {/* Mobile Navigation Menu */}
            <ul
                className={
                    nav
                        ? 'fixed md:hidden left-0 top-0 w-full h-full bg-vite_dark ease-in-out duration-500'
                        : 'ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%]'
                }
            >
                {/* Mobile Logo */}
                <div className='flex justify-between items-center p-4'>
                    <h1 className='w-full text-3xl font-bold text-signature_yellow m-4'> Shash Code </h1>
                    <span onClick={handleNav} className='absolute right-5 cursor-pointer'>
                        <AiOutlineClose size={20} />
                    </span>
                </div>

                {/* Mobile Navigation Items */}
                <ul className='flex flex-col h-full'>
                    {navItems.map(item => (
                        <li
                            key={item.id}
                            className='p-10 border-b hover:bg-signature_yellow duration-300 hover:text-signature_dark cursor-pointer border-gray-600'
                        >
                            {item.text}
                        </li>
                    ))}
                </ul>
            </ul>
        </div>
    );
};

export default Navbar;