const STORAGE_KEY = 'aerion.secure.session'

export const roles = {
  director: {
    label: 'Lab Director',
    permissions: ['missions:write', 'agents:configure', 'evidence:approve', 'manuscript:export', 'publication:manage']
  },
  researcher: {
    label: 'Researcher',
    permissions: ['missions:write', 'agents:run', 'evidence:read', 'manuscript:write']
  },
  reviewer: {
    label: 'Scientific Reviewer',
    permissions: ['missions:read', 'evidence:review', 'manuscript:comment']
  },
  student: {
    label: 'Student',
    permissions: ['missions:read', 'evidence:read']
  }
}

export const authMode = import.meta.env.VITE_AUTH_MODE || 'preview'

export function restoreSession() {
  if (authMode !== 'preview') return null
  try {
    const session = JSON.parse(sessionStorage.getItem(STORAGE_KEY))
    return session?.expiresAt > Date.now() ? session : null
  } catch {
    return null
  }
}

export function createPreviewSession({ email, role }) {
  const session = {
    user: {
      id: crypto.randomUUID(),
      email,
      name: email.split('@')[0].replace(/[._-]/g, ' '),
      role,
    },
    issuedAt: Date.now(),
    expiresAt: Date.now() + 4 * 60 * 60 * 1000,
    mode: 'preview'
  }
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  return session
}

export function clearSession() {
  sessionStorage.removeItem(STORAGE_KEY)
}

export function can(session, permission) {
  return roles[session?.user?.role]?.permissions.includes(permission) ?? false
}
