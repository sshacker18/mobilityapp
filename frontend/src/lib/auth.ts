const TOKEN_KEY = 'mobility_token'

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export function decodeToken(token?: string) {
  try {
    const t = token || getToken()
    if (!t) return null
    const parts = t.split('.')
    if (parts.length < 2) return null
    const payload = JSON.parse(atob(parts[1]))
    return payload
  } catch (err) {
    return null
  }
}
