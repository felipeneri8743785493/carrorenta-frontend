import { Component } from 'react'

export class AppErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch() {
    document.title = 'Ocurrió un problema | CarroRenta'
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <main className='fatal-error' id='main-content'>
        <section className='state-panel state-panel--error' role='alert'>
          <span className='state-panel__icon' aria-hidden='true'>!</span>
          <h1>La aplicación encontró un problema</h1>
          <p>Recarga la página para volver a intentarlo. Tus contraseñas y datos sensibles no se muestran en este mensaje.</p>
          <button className='button button--primary' type='button' onClick={() => window.location.reload()}>
            Recargar página
          </button>
        </section>
      </main>
    )
  }
}
