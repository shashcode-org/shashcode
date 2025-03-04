import React from 'react'

const ColorTest = () => {
  return (
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          
          <div className='flex flex-col space-y-4'>
              <h1 className='text-2xl font-semibold'>Signature Colors</h1>
              <p className='text-lg bg-signature_yellow'>Color Signature Yellow</p>
              <p className='text-lg bg-signature_gray'>Color Signature Gray</p>
              <p className='text-lg bg-signature_light text-vite_dark'>Color Signature Light</p>
              <p className='text-lg bg-signature_dark'>Color Signature Dark</p>
          </div>

          <div className='flex flex-col space-y-4'>
              <h1 className='text-2xl font-semibold'>Vite Colors</h1>
              <p className='text-lg bg-vite_light text-vite_dark'>Color Vite Light</p>
              <p className='text-lg bg-vite_dark'>Color Vite Dark</p>
          </div>

          <div className='flex flex-col space-y-4'>
              <h1 className='text-2xl font-semibold'>Theme Colors</h1>
              <p className='text-lg bg-primary'>Color Primary</p>
              <p className='text-lg bg-accent text-vite_dark'>Color Accent</p>
              <p className='text-lg bg-warning text-vite_dark'>Color Warning</p>
              <p className='text-lg bg-success'>Color Success</p>
              <p className='text-lg bg-danger'>Color Danger</p>
          </div>
      </div>
  )
}

export default ColorTest;