/**
 * Role Definitions for VOZAZI
 */

import type { Role, RolePermissions } from './types'

export const ROLES: Role[] = ['user', 'premium', 'enterprise', 'admin']

export const ROLE_NAMES: Record<Role, string> = {
  user: 'Usuario',
  premium: 'Premium',
  enterprise: 'Enterprise',
  admin: 'Administrador'
}

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  user: 'Usuario básico con acceso limitado',
  premium: 'Usuario premium con todas las características',
  enterprise: 'Usuario enterprise con acceso completo y API',
  admin: 'Administrador con control total'
}
