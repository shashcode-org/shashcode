import React from 'react'
import { Link, useNavigate } from 'react-router-dom'


const Navbar = () => {
    return (
        <div>
            <p className='navlinks'>
                <Link to=""> Home </Link>

                <Link to="/about"> About </Link>

            </p>
        </div>
    )
}

export default Navbar