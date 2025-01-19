import React, { useState } from 'react'
import {
    Routes,
    Route,
    Outlet, Link
} from 'react-router-dom'
import { CSV_UI_1, CSV_UI_1_All, CSV_UI_2, CSV_UI_2_All,  } from '../components'

const DSA = () => {
   
    return (
        <div className='my-10'>
            <h1 className='text-3xl font-semibold uppercase flex justify-between items-center'>
                DSA
                <div className='flex gap-5 text-xl'>
                    <Link to='/dsa/csv_ui_1' className='text-blue-500'>UI 1</Link>
                    <Link to='/dsa/csv_ui_2' className='text-purple-500'>UI 2</Link>
                    <Link to='/dsa/csv_ui_1_all' className='text-blue-500'>UI 1 All</Link>
                    <Link to='/dsa/csv_ui_2_all' className='text-purple-500'>UI 2 All</Link>
                </div>
            </h1>
            
            <Outlet />
            
            <Routes>
                <Route path="/csv_ui_1" element={<CSV_UI_1 />} />
                <Route path="/csv_ui_2" element={<CSV_UI_2 />} />
                <Route path="/csv_ui_1_all" element={<CSV_UI_1_All />} />
                <Route path="/csv_ui_2_all" element={<CSV_UI_2_All />} />
            </Routes>
        </div>
    )
}

export default DSA