import React, { useState } from 'react'
import { csvData } from '../data/csv-data';
import TopicsTable from './TopicsTable';
import MainTopicDropdown from './MainTopicDropDown';
import CollapsibleTable from './CollapsibleTable';


const DSA = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleDropdown = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className='mt-10'>
            <h1 className='text-3xl font-semibold uppercase'>
                DSA
            </h1>
            {/* <TopicsTable /> */}
            <CollapsibleTable />
        </div>
    )
}

export default DSA