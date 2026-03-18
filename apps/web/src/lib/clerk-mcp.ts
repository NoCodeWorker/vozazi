/**
 * MCP Client for Clerk Authentication.
 * 
 * This module provides utilities for interacting with Clerk API
 * for user management, sessions, and authentication.
 */

import { clerkClient, Clerk } from '@clerk/nextjs/server'
import { auth } from '@clerk/nextjs'

export interface ClerkUser {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  imageUrl: string | null
  createdAt: Date
  updatedAt: Date
}

export interface ClerkSession {
  id: string
  userId: string
  status: 'active' | 'abandoned' | 'ended' | 'expired' | 'removed'
  lastActiveAt: Date
  expireAt: Date
}

/**
 * Model Context Protocol (MCP) client for Clerk.
 * 
 * Provides user management, session handling, and authentication utilities.
 */
export class ClerkMCP {
  private client: ReturnType<typeof clerkClient>

  constructor() {
    this.client = clerkClient
  }

  /**
   * Get the current user from the session.
   */
  async getCurrentUser(): Promise<ClerkUser | null> {
    try {
      const { userId } = auth()
      
      if (!userId) {
        return null
      }

      const user = await this.client.users.getUser(userId)
      
      return {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt)
      }
    } catch (error) {
      console.error('ClerkMCP: Failed to get current user', error)
      return null
    }
  }

  /**
   * Get user by ID.
   */
  async getUserById(userId: string): Promise<ClerkUser | null> {
    try {
      const user = await this.client.users.getUser(userId)
      
      return {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt)
      }
    } catch (error) {
      console.error('ClerkMCP: Failed to get user by ID', error)
      return null
    }
  }

  /**
   * Get user by email.
   */
  async getUserByEmail(email: string): Promise<ClerkUser | null> {
    try {
      const users = await this.client.users.getUserList({ emailAddress: [email] })
      
      if (users.length === 0) {
        return null
      }

      const user = users[0]
      
      return {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt)
      }
    } catch (error) {
      console.error('ClerkMCP: Failed to get user by email', error)
      return null
    }
  }

  /**
   * Get current session.
   */
  async getCurrentSession(): Promise<ClerkSession | null> {
    try {
      const { sessionId } = auth()
      
      if (!sessionId) {
        return null
      }

      const session = await this.client.sessions.getSession(sessionId)
      
      return {
        id: session.id,
        userId: session.userId,
        status: session.status as ClerkSession['status'],
        lastActiveAt: new Date(session.lastActiveAt),
        expireAt: new Date(session.expireAt)
      }
    } catch (error) {
      console.error('ClerkMCP: Failed to get current session', error)
      return null
    }
  }

  /**
   * Revoke a session.
   */
  async revokeSession(sessionId: string): Promise<boolean> {
    try {
      await this.client.sessions.revokeSession(sessionId)
      return true
    } catch (error) {
      console.error('ClerkMCP: Failed to revoke session', error)
      return false
    }
  }

  /**
   * Revoke all sessions for a user.
   */
  async revokeAllSessions(userId: string): Promise<boolean> {
    try {
      await this.client.users.revokeSessions(userId)
      return true
    } catch (error) {
      console.error('ClerkMCP: Failed to revoke all sessions', error)
      return false
    }
  }

  /**
   * Update user metadata.
   */
  async updateUserMetadata(
    userId: string,
    publicMetadata?: Record<string, unknown>,
    privateMetadata?: Record<string, unknown>
  ): Promise<ClerkUser | null> {
    try {
      const user = await this.client.users.updateUser(userId, {
        publicMetadata,
        privateMetadata
      })
      
      return {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt)
      }
    } catch (error) {
      console.error('ClerkMCP: Failed to update user metadata', error)
      return null
    }
  }

  /**
   * Check if user has a specific role.
   */
  async hasRole(userId: string, role: string): Promise<boolean> {
    try {
      const user = await this.client.users.getUser(userId)
      const userRole = user.publicMetadata?.role as string | undefined
      return userRole === role
    } catch (error) {
      console.error('ClerkMCP: Failed to check user role', error)
      return false
    }
  }

  /**
   * Health check for Clerk connection.
   */
  async healthCheck(): Promise<{ status: string; service: string; error?: string }> {
    try {
      // Try to get the user list as a health check
      await this.client.users.getUserList({ limit: 1 })
      
      return {
        status: 'healthy',
        service: 'clerk'
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        service: 'clerk',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

// Singleton instance
export const clerkMCP = new ClerkMCP()

/**
 * Hook to get the current user with Clerk MCP.
 */
export async function useClerkUser(): Promise<ClerkUser | null> {
  return clerkMCP.getCurrentUser()
}

/**
 * Server action helper to get user.
 */
export async function getUser(): Promise<ClerkUser | null> {
  return clerkMCP.getCurrentUser()
}
