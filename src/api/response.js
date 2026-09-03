export function unwrapData(response) {
  return response?.data ?? response
}

export function unwrapList(response) {
  const data = unwrapData(response)
  return Array.isArray(data) ? data : []
}
