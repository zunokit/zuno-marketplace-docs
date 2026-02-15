export default defineNuxtRouteMiddleware((to) => {
  // Redirect any /sdk or /sdk/* URL to the public path without the /sdk prefix
  if (to.path === '/sdk') {
    return navigateTo('/', { redirectCode: 308 })
  }
  if (to.path.startsWith('/sdk/')) {
    // Preserve query and hash by slicing fullPath
    const target = to.fullPath.startsWith('/sdk/') ? to.fullPath.slice(4) : to.path.slice(4)
    return navigateTo(target || '/', { redirectCode: 308 })
  }
})
