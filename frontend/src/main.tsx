import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import Test from './components/pages/test.tsx'
import Scenery from './components/scenery/Scenery.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Test />} />
          <Route path='/test' element={<Test />} />
          <Route path='/scenery' element={<Scenery />} />
        </Routes>
      </BrowserRouter>
  </StrictMode>,

)
