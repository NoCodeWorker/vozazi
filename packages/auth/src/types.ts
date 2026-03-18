/**
 * Auth Types for VOZAZI
 * 
 * Tipos relacionados con autenticación y autorización.
 */

import { z } from 'zod'

// ============================================================================
// User Types
// ============================================================================

export const UserRoleSchema = z.enum(['admin', 'user', 'premium', 'enterprise'])
export type UserRole = z.infer<typeof UserRoleSchema>

export const UserStatusSchema = z.enum(['active', 'inactive', 'suspended', 'deleted'])
export type UserStatus = z.infer<typeof UserStatusSchema>

export const UserSchema = z.object({
  id: z.string().uuid(),
  clerkId: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  role: UserRoleSchema,
  status: UserStatusSchema,
  emailVerified: z.boolean().default(false),
  createdAt: z.number().positive(),
  updatedAt: z.number().positive(),
  lastSignInAt: z.number().positive().optional()
})
export type User = z.infer<typeof UserSchema>

// ============================================================================
// Session Types
// ============================================================================

export const SessionStatusSchema = z.enum(['active', 'ended', 'expired', 'revoked'])
export type SessionStatus = z.infer<typeof SessionStatusSchema>

export const SessionSchema = z.object({
  id: z.string(),
  userId: z.string().uuid(),
  status: SessionStatusSchema,
  createdAt: z.number().positive(),
  expiresAt: z.number().positive(),
  lastActiveAt: z.number().positive(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional()
})
export type Session = z.infer<typeof SessionSchema>

// ============================================================================
// Permission Types
// ============================================================================

export const PermissionSchema = z.enum([
  // User permissions
  'user:read',
  'user:write',
  'user:delete',
  
  // Session permissions
  'session:read',
  'session:write',
  'session:revoke',
  
  // Audio permissions
  'audio:read',
  'audio:write',
  'audio:delete',
  'audio:process',
  
  // Practice permissions
  'practice:read',
  'practice:write',
  'practice:analyze',
  
  // Library permissions
  'library:read',
  'library:write',
  'library:admin',
  
  // Billing permissions
  'billing:read',
  'billing:write',
  'billing:admin',
  
  // Admin permissions
  'admin:read',
  'admin:write',
  'admin:users',
  'admin:settings'
])
export type Permission = z.infer<typeof PermissionSchema>

// ============================================================================
// Role Permissions
// ============================================================================

export const RolePermissionsSchema = z.record(z.array(PermissionSchema))
export type RolePermissions = z.infer<typeof RolePermissionsSchema>

// ============================================================================
// Auth Token Types
// ============================================================================

export const TokenPurposeSchema = z.enum([
  'authentication',
  'password_reset',
  'email_verification',
  'api_access',
  'refresh'
])
export type TokenPurpose = z.infer<typeof TokenPurposeSchema>

export const AuthTokenSchema = z.object({
  token: z.string(),
  purpose: TokenPurposeSchema,
  userId: z.string().uuid(),
  expiresAt: z.number().positive(),
  createdAt: z.number().positive(),
  usedAt: z.number().positive().optional(),
  revoked: z.boolean().default(false)
})
export type AuthToken = z.infer<typeof AuthTokenSchema>

// ============================================================================
// OAuth Types
// ============================================================================

export const OAuthProviderSchema = z.enum([
  'google',
  'github',
  'microsoft',
  'apple',
  'facebook'
])
export type OAuthProvider = z.infer<typeof OAuthProviderSchema>

export const OAuthAccountSchema = z.object({
  provider: OAuthProviderSchema,
  providerAccountId: z.string(),
  userId: z.string().uuid(),
  email: z.string().email(),
  name: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  createdAt: z.number().positive()
})
export type OAuthAccount = z.infer<typeof OAuthAccountSchema>

// ============================================================================
// Auth State Types
// ============================================================================

export const AuthStateSchema = z.object({
  isAuthenticated: z.boolean(),
  isLoading: z.boolean(),
  user: UserSchema.optional(),
  session: SessionSchema.optional(),
  error: z.string().optional()
})
export type AuthState = z.infer<typeof AuthStateSchema>

// ============================================================================
// Sign In/Up Types
// ============================================================================

export const SignInMethodSchema = z.enum(['email_password', 'oauth', 'magic_link'])
export type SignInMethod = z.infer<typeof SignInMethodSchema>

export const SignInRequestSchema = z.object({
  method: SignInMethodSchema,
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  oauthProvider: OAuthProviderSchema.optional(),
  redirectUrl: z.string().url().optional()
})
export type SignInRequest = z.infer<typeof SignInRequestSchema>

export const SignUpRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
  redirectUrl: z.string().url().optional()
})
export type SignUpRequest = z.infer<typeof SignUpRequestSchema>
