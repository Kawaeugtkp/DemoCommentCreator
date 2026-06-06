// ログイン画面以外は、サーバーのセッション確認を通過しないと表示できない。
// 直接URLを叩いても、セッションが無ければログイン画面へリダイレクトされる。
export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/login') return

  const requestFetch = useRequestFetch() // SSR時にCookieを引き継ぐ
  try {
    const res = await requestFetch<{ authenticated: boolean }>('/api/session')
    if (!res.authenticated) {
      return navigateTo('/login')
    }
  } catch {
    return navigateTo('/login')
  }
})
