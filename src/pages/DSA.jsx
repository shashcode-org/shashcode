import React, { useState } from 'react'
import {
    Routes,
    Route,
    Outlet, Link
} from 'react-router-dom'
import { CSV_UI_1, CSV_UI_2 } from '../components'

const DSA = () => {
   
    return (
        <div className='mt-10'>
            <h1 className='text-3xl font-semibold uppercase flex justify-between'>
                DSA
                <div className='flex gap-5'>
                    <Link to='/dsa/csv_ui_1' className='text-blue-500'>UI 1</Link>
                    <Link to='/dsa/csv_ui_2' className='text-blue-500'>UI 2</Link>


                </div>
            </h1>
            
            <Outlet />
            
            <Routes>
                <Route path="/csv_ui_1" element={<CSV_UI_1 />} />
                <Route path="/csv_ui_2" element={<CSV_UI_2 />} />
            </Routes>
        </div>
    )
}

export default DSA