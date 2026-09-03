export const PROFILE_NAME_MAX_LENGTH = 150
export const PROFILE_EMAIL_MAX_LENGTH = 255

export function normalizeProfile(values) {
  return {
    name: String(values?.name ?? '').trim(),
    email: String(values?.email ?? '').trim(),
  }
}

export function getProfileNameError(value) {
  const name = String(value ?? '').trim()
  const length = Array.from(name).length
  if (length < 2) return 'El nombre debe contener al menos dos caracteres.'
  if (length > PROFILE_NAME_MAX_LENGTH) {
    return `El nombre no puede superar ${PROFILE_NAME_MAX_LENGTH} caracteres.`
  }
  return ''
}
