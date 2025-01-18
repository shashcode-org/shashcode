import { useState } from 'react'
import './App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'
import { Home, About } from './pages'
import { Navbar } from './components'

function App() {


  return (
    <div>
      <Router>
        <div className="container">
          <Navbar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/about' element={<About />} />
          </Routes>
        </div>
      </Router>

    </div>
  )
}

export default App