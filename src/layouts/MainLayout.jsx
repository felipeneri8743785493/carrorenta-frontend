import { useEffect, useRef } from 'react'
import { Footer } from '../components/Footer'
import { Navbar } from '../components/Navbar'

function getTitle(pathname) {
  if (pathname.startsWith('/admin')) return 'Administración | CarroRenta'
  if (pathname.startsWith('/reservaciones/')) return 'Detalle de reservación | CarroRenta'
  if (pathname.startsWith('/vehiculos/')) return 'Detalle del vehículo | CarroRenta'
  if (pathname === '/vehiculos') return 'Vehículos | CarroRenta'
  if (pathname === '/login') return 'Iniciar sesión | CarroRenta'
  if (pathname === '/registro') return 'Crear cuenta | CarroRenta'
  if (pathname === '/cuenta') return 'Mi cuenta | CarroRenta'
  if (pathname === '/') return 'CarroRenta | Renta de vehículos'
  return 'Página no encontrada | CarroRenta'
}

export function MainLayout({ children, navigate, pathname }) {
  const mainRef = useRef(null)
  const previousPath = useRef(pathname)

  useEffect(() => {
    document.title = getTitle(pathname)
    if (previousPath.current !== pathname) {
      mainRef.current?.focus({ preventScroll: true })
      previousPath.current = pathname
    }
  }, [pathname])

  return (
    <div className='site-shell'>
      <a className='skip-link' href='#main-content'>Saltar al contenido</a>
      <Navbar key={pathname} navigate={navigate} pathname={pathname} />
      <main id='main-content' className='site-main' ref={mainRef} tabIndex='-1'>{children}</main>
      <Footer navigate={navigate} />
    </div>
  )
}
