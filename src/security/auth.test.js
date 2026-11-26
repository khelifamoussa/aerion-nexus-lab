import { describe, expect, it } from 'vitest'
import { can, roles } from './auth'

describe('role permissions',()=>{
  it('keeps publication management director-only',()=>{
    expect(roles.director.permissions).toContain('publication:manage')
    expect(roles.researcher.permissions).not.toContain('publication:manage')
  })
  it('rejects missing sessions',()=>expect(can(null,'missions:read')).toBe(false))
})
