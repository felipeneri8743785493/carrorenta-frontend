import { useRef, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { getPasswordLimitError } from '../utils/passwords'
import { AuthMessage } from './AuthMessage'
import { FormField } from './FormField'

const initial = { currentPassword: '', newPassword: '', confirmation: '' }

export function PasswordForm() {
  const { changePassword } = useAuth()
  const confirmationRef = useRef(null)
  const [values, setValues] = useState(initial)
  const [error, setError] = useState(null)
  const [fieldError, setFieldError] = useState('')
  const [saved, setSaved] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  function change(event) {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }))
    setFieldError('')
    setSaved(false)
  }

  async function submit(event) {
    event.preventDefault()
    setError(null)
    const passwordError = getPasswordLimitError(values.currentPassword, values.newPassword)
    if (passwordError) {
      setError(new Error(passwordError))
      return
    }
    if (values.newPassword !== values.confirmation) {
      setFieldError('Las contraseñas no coinciden.')
      confirmationRef.current?.focus()
      return
    }

    setSubmitting(true)
    try {
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      })
      setValues(initial)
      setSaved(true)
    } catch (requestError) {
      setError(requestError)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="settings-card" aria-labelledby="password-title">
      <h2 id="password-title">Seguridad</h2>
      <p>Cambia tu contraseña. Debe contener al menos ocho caracteres.</p>
      <AuthMessage error={error} />
      {saved && <p className="success-message" role="status">Contraseña actualizada.</p>}
      <form className="settings-form" aria-busy={submitting} onSubmit={submit}>
        <FormField autoComplete="current-password" disabled={submitting} label="Contraseña actual" name="currentPassword" type="password" required value={values.currentPassword} onChange={change} />
        <FormField autoComplete="new-password" disabled={submitting} label="Nueva contraseña" minLength={8} name="newPassword" type="password" required value={values.newPassword} onChange={change} />
        <FormField autoComplete="new-password" disabled={submitting} error={fieldError} inputRef={confirmationRef} label="Confirmar contraseña" minLength={8} name="confirmation" type="password" required value={values.confirmation} onChange={change} />
        <button className="button button--primary" type="submit" disabled={submitting}>
          {submitting ? 'Actualizando...' : 'Cambiar contraseña'}
        </button>
      </form>
    </section>
  )
}
