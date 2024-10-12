import dynamic from 'next/dynamic'
import Footer from '@/components/Footer'

// Importar PaginaInicio dinámicamente con SSR desactivado
const PaginaInicio = dynamic(() => import('@/components/pagina-inicio'), { ssr: false })

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-stone-50">
      <main className="flex-grow">
        <PaginaInicio />
      </main>
      <Footer />
    </div>
  )
}
