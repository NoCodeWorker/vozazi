/**
 * Authorization Guards for VOZAZI
 * 
 * Guards para verificar permisos y roles.
 */

import type { User, Role, Permission, RolePermissions } from './types'

// ============================================================================
// Role Definitions
// ============================================================================

export const ROLE_PERMISSIONS: RolePermissions = {
  admin: [
    // All user permissions
    'user:read', 'user:write', 'user:delete',
    // All session permissions
    'session:read', 'session:write', 'session:revoke',
    // All audio permissions
    'audio:read', 'audio:write', 'audio:delete', 'audio:process',
    // All practice permissions
    'practice:read', 'practice:write', 'practice:analyze',
    // All library permissions
    'library:read', 'library:write', 'library:admin',
    // All billing permissions
    'billing:read', 'billing:write', 'billing:admin',
    // All admin permissions
    'admin:read', 'admin:write', 'admin:users', 'admin:settings'
  ],
  premium: [
    // User permissions
    'user:read', 'user:write',
    // Session permissions
    'session:read', 'session:write',
    // Audio permissions
    'audio:read', 'audio:write', 'audio:process',
    // Practice permissions
    'practice:read', 'practice:write', 'practice:analyze',
    // Library permissions
    'library:read', 'library:write',
    // Billing permissions
    'billing:read', 'billing:write'
  ],
  enterprise: [
    // User permissions
    'user:read', 'user:write',
    // Session permissions
    'session:read', 'session:write',
    // Audio permissions
    'audio:read', 'audio:write', 'audio:delete', 'audio:process',
    // Practice permissions
    'practice:read', 'practice:write', 'practice:analyze',
    // Library permissions
    'library:read', 'library:write', 'library:admin',
    // Billing permissions
    'billing:read', 'billing:write',
    // API access
    'admin:read'
  ],
  user: [
    // User permissions
    'user:read',
    // Session permissions
    'session:read', 'session:write',
    // Audio permissions
    'audio:read', 'audio:write', 'audio:process',
    // Practice permissions
    'practice:read', 'practice:write',
    // Library permissions
    'library:read',
    // Billing permissions
    'billing:read'
  ]
}

// ============================================================================
// Guard Functions
// ============================================================================

/**
 * Check if user has a specific role
 */
export function hasRole(user: User | null | undefined, role: Role): boolean {
  if (!user) return false
  return user.role === role
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(user: User | null | undefined, roles: Role[]): boolean {
  if (!user) return false
  return roles.includes(user.role)
}

/**
 * Check if user has all of the specified roles
 */
export function hasAllRoles(user: User | null | undefined, roles: Role[]): boolean {
  if (!user) return false
  return roles.every(role => user.role === role)
}

/**
 * Check if user has a specific permission
 */
export function hasPermission(user: User | null | undefined, permission: Permission): boolean {
  if (!user) return false
  
  const userPermissions = ROLE_PERMISSIONS[user.role] || []
  return userPermissions.includes(permission)
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(user: User | null | undefined, permissions: Permission[]): boolean {
  if (!user) return false
  
  const userPermissions = ROLE_PERMISSIONS[user.role] || []
  return permissions.some(permission => userPermissions.includes(permission))
}

/**
 * Check if user has all of the specified permissions
 */
export function hasAllPermissions(user: User | null | undefined, permissions: Permission[]): boolean {
  if (!user) return false
  
  const userPermissions = ROLE_PERMISSIONS[user.role] || []
  return permissions.every(permission => userPermissions.includes(permission))
}

// ============================================================================
// Higher-Order Guards
// ============================================================================

/**
 * Check if user can access audio features
 */
export function canAccessAudio(user: User | null | undefined): boolean {
  return hasAnyPermission(user, ['audio:read', 'audio:write'])
}

/**
 * Check if user can process audio
 */
export function canProcessAudio(user: User | null | undefined): boolean {
  return hasPermission(user, 'audio:process')
}

/**
 * Check if user can access library
 */
export function canAccessLibrary(user: User | null | undefined): boolean {
  return hasPermission(user, 'library:read')
}

/**
 * Check if user can admin library
 */
export function canAdminLibrary(user: User | null | undefined): boolean {
  return hasPermission(user, 'library:admin')
}

/**
 * Check if user can access billing
 */
export function canAccessBilling(user: User | null | undefined): boolean {
  return hasPermission(user, 'billing:read')
}

/**
 * Check if user can manage billing
 */
export function canManageBilling(user: User | null | undefined): boolean {
  return hasPermission(user, 'billing:write')
}

/**
 * Check if user is admin
 */
export function isAdmin(user: User | null | undefined): boolean {
  return hasRole(user, 'admin')
}

/**
 * Check if user is premium or higher
 */
export function isPremium(user: User | null | undefined): boolean {
  return hasAnyRole(user, ['premium', 'enterprise', 'admin'])
}

/**
 * Check if user is enterprise or higher
 */
export function isEnterprise(user: User | null | undefined): boolean {
  return hasAnyRole(user, ['enterprise', 'admin'])
}

// ============================================================================
// Route Guards
// ============================================================================

/**
 * Check if user can access a route based on required role
 */
export function canAccessRoute(
  user: User | null | undefined,
  requiredRole?: Role
): boolean {
  if (!requiredRole) return true
  if (!user) return false
  
  const roleHierarchy: Record<Role, number> = {
    user: 0,
    premium: 1,
    enterprise: 2,
    admin: 3
  }
  
  const userLevel = roleHierarchy[user.role] || 0
  const requiredLevel = roleHierarchy[requiredRole] || 0
  
  return userLevel >= requiredLevel
}
