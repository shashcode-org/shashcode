import React, { useState } from 'react'
import {
    Routes,
    Route,
    Outlet, Link
} from 'react-router-dom'
import { CSV_UI_1, CSV_UI_1_All, CSV_UI_2, CSV_UI_2_All, CSV_UI_V2_Data_1, CSV_UI_V2_Data_2, CSV_UI_3_1_Dropdown, CSV_UI_3_2_Tags } from '../components'
import { useNavigate } from "react-router-dom";


const DSA = () => {

    const navigate = useNavigate();

    const handleMainTopicChange = (e) => {
        const selectedValue = e.target.value;
        if (selectedValue) {
            navigate(selectedValue);
        }
    };
   
    return (
        <div className='my-10'>
            <h1 className='text-3xl font-semibold uppercase flex justify-between items-center'>
                DSA
                <div className='flex gap-5 text-xl'>
                    <select
                        id="mainTopic"
                        className="border border-gray-300 px-2 py-1"
                        onChange={handleMainTopicChange}
                    >
                        <option value="">-- Select --</option>
                        <option value="/dsa/csv_ui_1">UI 1</option>
                        <option value="/dsa/csv_ui_2">UI 2</option>
                        <option value="/dsa/csv_ui_1_all">UI 1 All</option>
                        <option value="/dsa/csv_ui_2_all">UI 2 All</option>
                        <option value="/dsa/csv_ui_v2_data_1">UI V2 Data 1(Details/Questions Separated)</option>
                        <option value="/dsa/csv_ui_v2_data_2">UI V2 Data 2(Details/Questions Combined)</option>
                        <option value="/dsa/csv_ui_3_dropdown">UI 3 Dropdown</option>
                        <option value="/dsa/csv_ui_3_tags">UI 3 Tags</option>

                    </select>
                </div>
            </h1>
            
            <Outlet />
            
            <Routes>
                <Route path="/csv_ui_1" element={<CSV_UI_1 />} />
                <Route path="/csv_ui_2" element={<CSV_UI_2 />} />
                <Route path="/csv_ui_1_all" element={<CSV_UI_1_All />} />
                <Route path="/csv_ui_2_all" element={<CSV_UI_2_All />} />
                <Route path="/csv_ui_v2_data_1" element={<CSV_UI_V2_Data_1 />} />
                <Route path="/csv_ui_v2_data_2" element={<CSV_UI_V2_Data_2 />} />
                <Route path="/csv_ui_3_dropdown" element={<CSV_UI_3_1_Dropdown />} />
                <Route path="/csv_ui_3_tags" element={<CSV_UI_3_2_Tags />} />
            </Routes>
        </div>
    )
}

export default DSA