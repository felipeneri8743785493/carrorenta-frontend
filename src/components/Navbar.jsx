import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { USER_ROLE } from '../utils/userRoles'
import { Link } from './Link'

const navigation = [
  { label: 'Inicio', to: '/' },
  { label: 'Vehículos', to: '/vehiculos' },
]

function isSectionActive(pathname, route) {
  return route === '/' ? pathname === route : pathname === route || pathname.startsWith(`${route}/`)
}

export function Navbar({ navigate, pathname }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const headerRef = useRef(null)
  const toggleRef = useRef(null)
  const { isAuthenticated, logout, user } = useAuth()

  useEffect(() => {
    if (!isOpen) return undefined
    function closeOnEscape(event) {
      if (event.key === 'Escape') {
        setIsOpen(false)
        toggleRef.current?.focus()
      }
    }
    function closeOnOutsidePointer(event) {
      if (!headerRef.current?.contains(event.target)) setIsOpen(false)
    }
    document.addEventListener('keydown', closeOnEscape)
    document.addEventListener('pointerdown', closeOnOutsidePointer)
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.removeEventListener('pointerdown', closeOnOutsidePointer)
    }
  }, [isOpen])

  function navigateAndClose(to) {
    setIsOpen(false)
    navigate(to)
  }

  async function handleLogout() {
    setIsLoggingOut(true)
    try {
      await logout()
    } finally {
      navigateAndClose('/')
    }
  }

  return (
    <header className='navbar' ref={headerRef}>
      <div className='container navbar__inner'>
        <Link className='brand' navigate={navigateAndClose} to='/' aria-label='CarroRenta, inicio'>
          <span className='brand__mark' aria-hidden='true'>CR</span><span>CarroRenta</span>
        </Link>
        <button ref={toggleRef} className='navbar__toggle' type='button' aria-controls='main-navigation' aria-expanded={isOpen} onClick={() => setIsOpen((current) => !current)}>
          <span className='sr-only'>{isOpen ? 'Cerrar' : 'Abrir'} menú de navegación</span>
          <span aria-hidden='true'>{isOpen ? '×' : '☰'}</span>
        </button>
        <nav id='main-navigation' className={`navbar__menu ${isOpen ? 'navbar__menu--open' : ''}`} aria-label='Navegación principal'>
          <ul className='navbar__links'>
            {navigation.map((item) => (
              <li key={item.to}><Link className='navbar__link' navigate={navigateAndClose} to={item.to} aria-current={isSectionActive(pathname, item.to) ? 'page' : undefined}>{item.label}</Link></li>
            ))}
          </ul>
          <div className='navbar__actions'>
            {isAuthenticated ? (
              <>
                {user?.role === USER_ROLE.ADMIN && <Link aria-current={isSectionActive(pathname, '/admin') ? 'page' : undefined} className='button button--ghost' navigate={navigateAndClose} to='/admin'>Administración</Link>}
                <Link aria-current={pathname === '/cuenta' || pathname.startsWith('/reservaciones/') ? 'page' : undefined} className='button button--ghost' navigate={navigateAndClose} to='/cuenta'>{user?.name ?? 'Mi cuenta'}</Link>
                <button className='button button--primary' type='button' disabled={isLoggingOut} onClick={handleLogout}>
                  {isLoggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
                </button>
              </>
            ) : (
              <>
                <Link aria-current={pathname === '/login' ? 'page' : undefined} className='button button--ghost' navigate={navigateAndClose} to='/login'>Iniciar sesión</Link>
                <Link aria-current={pathname === '/registro' ? 'page' : undefined} className='button button--primary' navigate={navigateAndClose} to='/registro'>Crear cuenta</Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
