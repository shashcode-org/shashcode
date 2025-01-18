import React from 'react'
import { ColorTest } from '../components'

const About = () => {
  return (
    <div className='mt-10'>
      <h1 className='text-3xl font-semibold uppercase'> About </h1>

      <div className='mx-auto mt-10 bg-vite_dark p-10 text-vite_light flex flex-col gap-10 rounded-2xl'>
        <h1 className='text-3xl font-semibold uppercase border-b pb-5'>Colors of Site</h1>
        <ColorTest />    
      </div>
    </div>
  )
}

export default About