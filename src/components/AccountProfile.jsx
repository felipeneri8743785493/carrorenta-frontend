import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { getProfileNameError, normalizeProfile, PROFILE_EMAIL_MAX_LENGTH, PROFILE_NAME_MAX_LENGTH } from '../utils/profiles'
import { AuthMessage } from './AuthMessage'
import { FormField } from './FormField'

export function AccountProfile() {
  const { updateUser, user } = useAuth()
  const [savedValues, setSavedValues] = useState(() => normalizeProfile(user))
  const [values, setValues] = useState(savedValues)
  const [error, setError] = useState(null)
  const [saved, setSaved] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const normalizedValues = normalizeProfile(values)
  const hasChanges = normalizedValues.name !== savedValues.name
    || normalizedValues.email !== savedValues.email

  function change(event) {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }))
    setError(null)
    setSaved(false)
  }

  async function submit(event) {
    event.preventDefault()
    setError(null)
    setSaved(false)
    const nameError = getProfileNameError(normalizedValues.name)
    if (nameError) {
      setError(new Error(nameError))
      return
    }
    setSubmitting(true)
    try {
      const updatedUser = await updateUser(normalizedValues)
      const nextValues = normalizeProfile(updatedUser)
      setSavedValues(nextValues)
      setValues(nextValues)
      setSaved(true)
    } catch (requestError) {
      setError(requestError)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="settings-card" aria-labelledby="profile-title">
      <h2 id="profile-title">Información personal</h2>
      <p>Actualiza el nombre y correo asociados a tu cuenta.</p>
      <AuthMessage error={error} />
      {saved && <p className="success-message" role="status">Información actualizada.</p>}
      <form className="settings-form" aria-busy={submitting} onSubmit={submit}>
        <FormField autoComplete="name" disabled={submitting} label="Nombre completo" maxLength={PROFILE_NAME_MAX_LENGTH} minLength={2} name="name" required value={values.name} onChange={change} />
        <FormField autoComplete="email" disabled={submitting} label="Correo electrónico" maxLength={PROFILE_EMAIL_MAX_LENGTH} name="email" type="email" required value={values.email} onChange={change} />
        <button className="button button--primary" type="submit" disabled={submitting || !hasChanges}>
          {submitting ? 'Guardando...' : hasChanges ? 'Guardar cambios' : 'Sin cambios'}
        </button>
      </form>
    </section>
  )
}
