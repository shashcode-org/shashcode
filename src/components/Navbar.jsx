import React, { useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom'
import { navItemsData } from '../data/nav-items';
import logo from '../assets/black-logo.png';

const Navbar = () => {

    // State to manage the navbar's visibility
    const [nav, setNav] = useState(false);

    // Toggle function to handle the navbar's display
    const handleNav = () => {
        setNav(!nav);
    };

    return (
        <div className='bg-signature_dark flex justify-between items-center h-16 mx-auto px-4 sm:px-10 text-vite_light'>
            
            {/* Logo */}
            <Link to='/'>
                <img src={logo} alt="ShashCode Logo" className="h-10 w-auto" />
            </Link>

            {/* Desktop Navigation */}
            <ul className='hidden md:flex'>
                
                {navItemsData.map(navItem => (
                    <Link key={navItem.id} to={navItem.url}> 
                        <li
                            className='p-4 hover:bg-signature_yellow rounded-xl m-2 cursor-pointer duration-300 hover:text-signature_dark flex gap-2 items-center leading-none'
                        >
                        
                            <span className="flex items-center justify-center h-full">
                                <navItem.icon className="h-full w-auto" />
                            </span>
                            {navItem.title} 
                        </li>
                    </Link>
                ))}
            </ul>

            {/* Mobile Navigation Icon */}
            <div onClick={handleNav} className='block md:hidden cursor-pointer'>
                {nav ? <AiOutlineClose className='w-[25px] h-auto' /> : <AiOutlineMenu className='w-[25px] h-auto' />}
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
                <div className='flex justify-between items-center px-4 py-10 h-16'>
                    <Link to="/">
                        <img src={logo} alt="ShashCode Logo" className="h-10 w-auto" />
                    </Link>
                    <span onClick={handleNav} className='mr-4 cursor-pointer'>
                        <AiOutlineClose className='w-[25px] h-auto' />
                    </span>
                </div>

                {/* Mobile Navigation Items */}
                <ul className='flex flex-col h-full'>
                    {navItemsData.map(navItem => (
                        <Link key={navItem.id} to={navItem.url} onClick={() => setNav(false)}> 
                            <li
                                className='py-10 px-8 border-b hover:bg-signature_yellow duration-300 hover:text-signature_dark cursor-pointer border-gray-600 flex gap-2 items-center justify-start leading-none'
                            >
                                <span className="flex items-center justify-center h-full">
                                    <navItem.icon className="h-full w-auto" />
                                </span>
                                {navItem.title}
                            </li>
                        </Link>
                    ))}
                </ul>
            </ul>
        </div>
    );
};

export default Navbar;