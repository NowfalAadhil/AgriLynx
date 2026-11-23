import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
const About = lazy(() => import('./pages/About'))
const Alerts = lazy(() => import('./pages/Alerts'))
const Architecture = lazy(() => import('./pages/Architecture'))
const CropIntelligence = lazy(() => import('./pages/CropIntelligence'))
const Monitoring = lazy(() => import('./pages/Monitoring'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Overview = lazy(() => import('./pages/Overview'))
const PestAnalysis = lazy(() => import('./pages/PestAnalysis'))

export default function App() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-muted">Loading…</div>}>
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Overview />} />
        <Route path="monitoring" element={<Monitoring />} />
        <Route path="crops" element={<CropIntelligence />} />
        <Route path="pest-analysis" element={<PestAnalysis />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="architecture" element={<Architecture />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
    </Suspense>
  )
}
