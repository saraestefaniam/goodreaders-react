/* eslint-disable react/react-in-jsx-scope */
import Layout from './components/ui/layout/layout'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import CreateUserPage from './pages/auth/create-user-page'

function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
        <Route path="new-user" element={<CreateUserPage />}/>
        </Route>
      </Routes>
    </div>

  )
}

export default App