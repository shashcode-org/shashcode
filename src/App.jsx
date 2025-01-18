import { useState } from 'react'
import './App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'
import { Home, About, DSA, Contact } from './pages'
import { Navbar } from './components'

function App() {


  return (
    <div className=''>
      <Router>
        <Navbar />
        <div className="w-3/4 mx-auto">
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route path='/dsa/*' element={<DSA />} />
            <Route path='/contact' element={<Contact />} />
          </Routes>
        </div>
      </Router>

    </div>
  )
}

export default App