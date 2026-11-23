import { Link } from 'react-router-dom'
import { Card, EmptyState } from '../components/ui/primitives'
import { Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <Card><h1 className="sr-only">Page not found</h1><EmptyState icon={<Compass className="h-5 w-5" />} title="Page not found" body="That page doesn't exist in AgriLynx." action={<Link to="/" className="btn-primary">Back to Overview</Link>} /></Card>
  )
}
