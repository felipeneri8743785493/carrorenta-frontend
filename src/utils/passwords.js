export const PASSWORD_MAX_BYTES = 72

export function getPasswordLimitError(...passwords) {
  const exceedsLimit = passwords.some((password) => (
    typeof password === 'string'
    && new TextEncoder().encode(password).byteLength > PASSWORD_MAX_BYTES
  ))

  return exceedsLimit
    ? `La contraseña no puede superar ${PASSWORD_MAX_BYTES} bytes.`
    : ''
}
