export function getEntityId(entity) {
  const id = entity?.id ?? entity?._id
  if (typeof id === 'string') return id.trim() || null
  return typeof id === 'number' && Number.isFinite(id) && id > 0 ? id : null
}

export function getRelatedEntityId(entity, relation) {
  const directValue = entity?.[`${relation}Id`]
  const directEntity = directValue && typeof directValue === 'object'
    ? directValue
    : { id: directValue }

  return getEntityId(directEntity) ?? getEntityId(entity?.[relation])
}
