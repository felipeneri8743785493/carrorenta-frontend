import { useRef, useState } from 'react'
import { AuthMessage } from '../components/AuthMessage'
import { FormField } from '../components/FormField'
import { Link } from '../components/Link'
import { useAuth } from '../hooks/useAuth'
import { getSafeReturnPath } from '../utils/routes'
import { getPasswordLimitError } from '../utils/passwords'
import { getProfileNameError, PROFILE_EMAIL_MAX_LENGTH, PROFILE_NAME_MAX_LENGTH } from '../utils/profiles'

const initial = { name: '', email: '', password: '', confirmPassword: '' }

export function RegisterPage({ navigate }) {
  const { register } = useAuth()
  const returnTo = getSafeReturnPath(window.history.state?.returnTo)
  const returnState = window.history.state?.returnState
  const confirmationRef = useRef(null)
  const [values, setValues] = useState(initial)
  const [error, setError] = useState(null)
  const [fieldError, setFieldError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function change(event) {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }))
    setError(null)
    if (['password', 'confirmPassword'].includes(event.target.name)) setFieldError('')
  }

  async function submit(event) {
    event.preventDefault()
    setError(null)
    const name = values.name.trim()
    const email = values.email.trim()
    const nameError = getProfileNameError(name)
    if (nameError) {
      setError(new Error(nameError))
      return
    }
    const passwordError = getPasswordLimitError(values.password)
    if (passwordError) {
      setError(new Error(passwordError))
      return
    }
    if (values.password !== values.confirmPassword) {
      setFieldError('Las contraseñas no coinciden.')
      confirmationRef.current?.focus()
      return
    }
    setSubmitting(true)
    try {
      const result = await register({
        name,
        email,
        password: values.password,
      })
      navigate(result.token ? returnTo : '/login', {
        replace: true,
        state: result.token ? returnState : { returnState, returnTo },
      })
    } catch (requestError) {
      setError(requestError)
      setSubmitting(false)
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">Únete a CarroRenta</p><h1>Crea tu cuenta</h1>
        <p className="auth-card__intro">Completa tus datos para empezar a reservar.</p>
        <AuthMessage error={error} />
        <form className="auth-form" aria-busy={submitting} onSubmit={submit}>
          <FormField autoComplete="name" disabled={submitting} label="Nombre completo" maxLength={PROFILE_NAME_MAX_LENGTH} minLength={2} name="name" required value={values.name} onChange={change} />
          <FormField autoComplete="email" disabled={submitting} label="Correo electrónico" maxLength={PROFILE_EMAIL_MAX_LENGTH} name="email" type="email" required value={values.email} onChange={change} />
          <FormField autoComplete="new-password" disabled={submitting} label="Contraseña" minLength={8} name="password" type="password" required value={values.password} onChange={change} />
          <FormField autoComplete="new-password" disabled={submitting} error={fieldError} inputRef={confirmationRef} label="Confirmar contraseña" minLength={8} name="confirmPassword" type="password" required value={values.confirmPassword} onChange={change} />
          <button className="button button--primary" type="submit" disabled={submitting}>{submitting ? 'Creando cuenta...' : 'Crear cuenta'}</button>
        </form>
        <p className="auth-card__footer">¿Ya tienes cuenta? <Link className="text-link" navigate={navigate} state={{ returnState, returnTo }} to="/login">Inicia sesión</Link></p>
      </div>
    </section>
  )
}
