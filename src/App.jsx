import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import DocsLayout from './components/DocsLayout'
import Home from './pages/Home'
import DocsIndex from './pages/DocsIndex'
import Installation from './pages/Installation'
import QuickStart from './pages/QuickStart'
import CliReference from './pages/CliReference'
import SecurityChecks from './pages/SecurityChecks'
import Examples from './pages/Examples'
import Changelog from './pages/Changelog'
import Contributing from './pages/Contributing'
import About from './pages/About'
import NotFound from './pages/NotFound'

import './styles/tokens.css'
import './styles/base.css'
import './styles/chrome.css'
import './styles/home.css'
import './styles/docs.css'
import './styles/pages.css'
import './styles/terminal.css'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />

        <Route path="docs" element={<DocsLayout />}>
          <Route index element={<DocsIndex />} />
          <Route path="installation" element={<Installation />} />
          <Route path="quickstart" element={<QuickStart />} />
          <Route path="cli-reference" element={<CliReference />} />
          <Route path="security-checks" element={<SecurityChecks />} />
          <Route path="examples" element={<Examples />} />
        </Route>

        <Route path="changelog" element={<Changelog />} />
        <Route path="contributing" element={<Contributing />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
