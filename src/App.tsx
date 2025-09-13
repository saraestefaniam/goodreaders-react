/* eslint-disable react/react-in-jsx-scope */
import Layout from './components/ui/layout/layout'
import { Routes, Route } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
        </Route>
      </Routes>
    </div>

  )
}

export default App