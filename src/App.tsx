import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import BrowseGrants from './pages/BrowseGrants'
import Apply from './pages/Apply'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import Login from './pages/Login'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/browse" element={<BrowseGrants />} />
      <Route path="/apply/:grantId" element={<Apply />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
