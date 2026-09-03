import { useState } from 'react'
import { AuthMessage } from '../components/AuthMessage'
import { FormField } from '../components/FormField'
import { Link } from '../components/Link'
import { useAuth } from '../hooks/useAuth'
import { getSafeReturnPath } from '../utils/routes'
import { getPasswordLimitError } from '../utils/passwords'
import { PROFILE_EMAIL_MAX_LENGTH } from '../utils/profiles'

const initialValues = { email: '', password: '' }

export function LoginPage({ navigate }) {
  const { login } = useAuth()
  const returnTo = getSafeReturnPath(window.history.state?.returnTo)
  const returnState = window.history.state?.returnState
  const [values, setValues] = useState(initialValues)
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    setValues((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
    setError(null)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    const passwordError = getPasswordLimitError(values.password)
    if (passwordError) {
      setError(new Error(passwordError))
      return
    }
    setIsSubmitting(true)

    try {
      await login({ email: values.email.trim(), password: values.password })
      navigate(returnTo, { replace: true, state: returnState })
    } catch (requestError) {
      setError(requestError)
      setIsSubmitting(false)
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">Bienvenido de nuevo</p>
        <h1>Inicia sesión</h1>
        <p className="auth-card__intro">Accede para gestionar tus reservaciones.</p>
        <AuthMessage error={error} />
        <form className="auth-form" aria-busy={isSubmitting} onSubmit={handleSubmit}>
          <FormField
            autoComplete="email"
            disabled={isSubmitting}
            label="Correo electrónico"
            maxLength={PROFILE_EMAIL_MAX_LENGTH}
            name="email"
            type="email"
            required
            value={values.email}
            onChange={handleChange}
          />
          <FormField
            autoComplete="current-password"
            disabled={isSubmitting}
            label="Contraseña"
            name="password"
            type="password"
            required
            value={values.password}
            onChange={handleChange}
          />
          <button className="button button--primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>
        <p className="auth-card__footer">
          ¿Aún no tienes cuenta?{' '}
          <Link className="text-link" navigate={navigate} state={{ returnState, returnTo }} to="/registro">Regístrate</Link>
        </p>
      </div>
    </section>
  )
}
