import { useState } from 'react'
import './App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'
// import { Home, About, DSA, Contact } from './pages'
import { Home, DSA } from './pages'
import { Navbar, Footer } from './components'

// Import the legal pages
import Terms from './pages/Terms.jsx'
import Privacy from './pages/Privacy.jsx'
import NotFound from './pages/NotFound.jsx'

function App() {
  return (
    <div className='bg-gray-900 min-h-screen'>
      <Router>
        <Navbar />
        <div className="w-[90%] md:w-3/4 mx-auto">
          <Routes>
            <Route path='/' element={<Home />} />
            {/* <Route path='/about' element={<About />} /> */}
            <Route path='/dsa/*' element={<DSA />} />
            {/* <Route path='/contact' element={<Contact />} /> */}
            <Route path='/terms' element={<Terms />} />
            <Route path='/privacy' element={<Privacy />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  )
}

export default App
