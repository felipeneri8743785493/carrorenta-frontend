function positiveInteger(value, fallback) {
  const number = Number(value)
  return Number.isInteger(number) && number > 0 ? number : fallback
}

function nonNegativeInteger(value) {
  const number = Number(value)
  return Number.isInteger(number) && number >= 0 ? number : 0
}

export function normalizePagination(meta, fallbackPage = 1) {
  return {
    currentPage: positiveInteger(meta?.page ?? meta?.currentPage, fallbackPage),
    totalItems: nonNegativeInteger(meta?.total ?? meta?.totalItems),
    totalPages: positiveInteger(meta?.totalPages, 1),
  }
}

export function getLastPage(pagination) {
  return positiveInteger(pagination?.totalPages, 1)
}
