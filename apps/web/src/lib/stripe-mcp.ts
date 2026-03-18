/**
 * MCP Client for Stripe Billing and Payments.
 * 
 * This module provides utilities for managing subscriptions,
 * payments, and billing through Stripe.
 */

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10'
})

export interface StripeCustomer {
  id: string
  email: string | null
  name: string | null
  metadata: Record<string, string>
}

export interface StripeSubscription {
  id: string
  customerId: string
  status: string
  plan: {
    id: string
    name: string
    amount: number
    interval: string
  }
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
}

export interface StripeCheckoutSession {
  sessionId: string
  url: string | null
}

export interface PlanLimits {
  audioMinutesPerMonth: number
  maxFileSize: number
  maxConcurrentProcessing: number
  features: string[]
}

export const PLAN_LIMITS: Record<string, PlanLimits> = {
  free: {
    audioMinutesPerMonth: 60,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxConcurrentProcessing: 1,
    features: ['transcription', 'basic-analysis']
  },
  pro: {
    audioMinutesPerMonth: 600,
    maxFileSize: 100 * 1024 * 1024, // 100MB
    maxConcurrentProcessing: 5,
    features: ['transcription', 'advanced-analysis', 'emotion-detection', 'speaker-identification']
  },
  enterprise: {
    audioMinutesPerMonth: -1, // unlimited
    maxFileSize: 500 * 1024 * 1024, // 500MB
    maxConcurrentProcessing: 20,
    features: ['all']
  }
}

/**
 * Model Context Protocol (MCP) client for Stripe.
 * 
 * Provides subscription management, payment processing, and billing utilities.
 */
export class StripeMCP {
  private stripe: Stripe

  constructor() {
    this.stripe = stripe
  }

  /**
   * Create or retrieve a Stripe customer.
   */
  async createOrGetCustomer(
    email: string,
    name?: string,
    metadata?: Record<string, string>
  ): Promise<StripeCustomer> {
    try {
      // Search for existing customer by email
      const existingCustomers = await this.stripe.customers.list({ email, limit: 1 })
      
      if (existingCustomers.data.length > 0) {
        const customer = existingCustomers.data[0]
        return {
          id: customer.id,
          email: customer.email,
          name: customer.name,
          metadata: customer.metadata
        }
      }

      // Create new customer
      const customer = await this.stripe.customers.create({
        email,
        name,
        metadata
      })

      return {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        metadata: customer.metadata
      }
    } catch (error) {
      console.error('StripeMCP: Failed to create/get customer', error)
      throw error
    }
  }

  /**
   * Get customer by ID.
   */
  async getCustomer(customerId: string): Promise<StripeCustomer | null> {
    try {
      const customer = await this.stripe.customers.retrieve(customerId)
      
      if (customer.deleted) {
        return null
      }

      return {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        metadata: customer.metadata
      }
    } catch (error) {
      console.error('StripeMCP: Failed to get customer', error)
      return null
    }
  }

  /**
   * Create a checkout session for subscription.
   */
  async createCheckoutSession(
    customerId: string,
    priceId: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<StripeCheckoutSession> {
    try {
      const session = await this.stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'subscription',
        line_items: [
          {
            price: priceId,
            quantity: 1
          }
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        allow_promotion_codes: true
      })

      return {
        sessionId: session.id,
        url: session.url
      }
    } catch (error) {
      console.error('StripeMCP: Failed to create checkout session', error)
      throw error
    }
  }

  /**
   * Create a billing portal session.
   */
  async createBillingPortalSession(
    customerId: string,
    returnUrl?: string
  ): Promise<{ sessionId: string; url: string }> {
    try {
      const session = await this.stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl
      })

      return {
        sessionId: session.id,
        url: session.url
      }
    } catch (error) {
      console.error('StripeMCP: Failed to create billing portal session', error)
      throw error
    }
  }

  /**
   * Get subscription by ID.
   */
  async getSubscription(subscriptionId: string): Promise<StripeSubscription | null> {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId)

      return {
        id: subscription.id,
        customerId: subscription.customer as string,
        status: subscription.status,
        plan: {
          id: subscription.items.data[0]?.price.id || '',
          name: subscription.items.data[0]?.price.nickname || '',
          amount: subscription.items.data[0]?.price.unit_amount || 0,
          interval: subscription.items.data[0]?.price.recurring?.interval || 'month'
        },
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end
      }
    } catch (error) {
      console.error('StripeMCP: Failed to get subscription', error)
      return null
    }
  }

  /**
   * Get subscription by customer ID.
   */
  async getSubscriptionByCustomer(customerId: string): Promise<StripeSubscription | null> {
    try {
      const subscriptions = await this.stripe.subscriptions.list({
        customer: customerId,
        limit: 1,
        status: 'active'
      })

      if (subscriptions.data.length === 0) {
        return null
      }

      const subscription = subscriptions.data[0]

      return {
        id: subscription.id,
        customerId: subscription.customer as string,
        status: subscription.status,
        plan: {
          id: subscription.items.data[0]?.price.id || '',
          name: subscription.items.data[0]?.price.nickname || '',
          amount: subscription.items.data[0]?.price.unit_amount || 0,
          interval: subscription.items.data[0]?.price.recurring?.interval || 'month'
        },
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end
      }
    } catch (error) {
      console.error('StripeMCP: Failed to get subscription by customer', error)
      return null
    }
  }

  /**
   * Cancel subscription at period end.
   */
  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    try {
      await this.stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true
      })
      return true
    } catch (error) {
      console.error('StripeMCP: Failed to cancel subscription', error)
      return false
    }
  }

  /**
   * Immediately cancel subscription.
   */
  async immediatelyCancelSubscription(subscriptionId: string): Promise<boolean> {
    try {
      await this.stripe.subscriptions.cancel(subscriptionId)
      return true
    } catch (error) {
      console.error('StripeMCP: Failed to immediately cancel subscription', error)
      return false
    }
  }

  /**
   * Update subscription plan.
   */
  async updateSubscriptionPlan(
    subscriptionId: string,
    priceId: string
  ): Promise<StripeSubscription | null> {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId)
      
      const updatedSubscription = await this.stripe.subscriptions.update(subscriptionId, {
        items: [
          {
            id: subscription.items.data[0].id,
            price: priceId
          }
        ],
        proration_behavior: 'create_prorations'
      })

      return {
        id: updatedSubscription.id,
        customerId: updatedSubscription.customer as string,
        status: updatedSubscription.status,
        plan: {
          id: updatedSubscription.items.data[0]?.price.id || '',
          name: updatedSubscription.items.data[0]?.price.nickname || '',
          amount: updatedSubscription.items.data[0]?.price.unit_amount || 0,
          interval: updatedSubscription.items.data[0]?.price.recurring?.interval || 'month'
        },
        currentPeriodStart: new Date(updatedSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(updatedSubscription.current_period_end * 1000),
        cancelAtPeriodEnd: updatedSubscription.cancel_at_period_end
      }
    } catch (error) {
      console.error('StripeMCP: Failed to update subscription plan', error)
      return null
    }
  }

  /**
   * Get plan limits for a subscription status.
   */
  getPlanLimits(plan: string): PlanLimits {
    return PLAN_LIMITS[plan] || PLAN_LIMITS.free
  }

  /**
   * Check if subscription is active.
   */
  isActiveSubscription(status: string): boolean {
    const activeStatuses = ['active', 'trialing']
    return activeStatuses.includes(status)
  }

  /**
   * Handle webhook event.
   */
  async handleWebhook(payload: Buffer, signature: string): Promise<Stripe.Event> {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
    
    try {
      const event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret)
      return event
    } catch (error) {
      console.error('StripeMCP: Failed to construct webhook event', error)
      throw error
    }
  }

  /**
   * Health check for Stripe connection.
   */
  async healthCheck(): Promise<{ status: string; service: string; error?: string }> {
    try {
      await this.stripe.balance.retrieve()
      
      return {
        status: 'healthy',
        service: 'stripe'
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        service: 'stripe',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

// Singleton instance
export const stripeMCP = new StripeMCP()
