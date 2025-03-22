import React, { useState } from 'react'
import { CSV_TABLE_UI } from '../components'


const DSA = () => {

    return (
        
        <div className='my-4 sm:my-6'>

            <h1 className='text-3xl font-semibold uppercase flex justify-between items-center'>
                DSA
            </h1>
            
            <CSV_TABLE_UI />
        </div>
    )
}

export default DSA