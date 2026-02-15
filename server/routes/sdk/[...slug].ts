export default eventHandler((event) => {
  const params = getRouterParams(event)
  const slug = params.slug as string | string[] | undefined
  const rest = Array.isArray(slug) ? slug.join('/') : (slug || '')
  return sendRedirect(event, `/${rest}`, 308)
})
