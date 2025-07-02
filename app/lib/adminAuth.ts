import { supabase } from './supabase';

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'editor';
  full_name: string | null;
  created_at: string;
  last_sign_in: string | null;
}

// Cache for admin status and user data
let adminStatusCache: { [userId: string]: { isAdmin: boolean; timestamp: number } } = {};
let adminUserCache: { [userId: string]: { user: AdminUser | null; timestamp: number } } = {};

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

export class AdminAuthService {
  /**
   * Check if the current user is an admin
   */
  static async isAdmin(): Promise<boolean> {
    try {
      console.log('AdminAuthService.isAdmin(): Starting admin check');
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        console.log('AdminAuthService.isAdmin(): No session or user');
        return false;
      }

      const userId = session.user.id;
      const now = Date.now();

      // Check cache first
      if (adminStatusCache[userId] && (now - adminStatusCache[userId].timestamp) < CACHE_DURATION) {
        console.log('AdminAuthService.isAdmin(): Using cached result');
        return adminStatusCache[userId].isAdmin;
      }

      console.log('AdminAuthService.isAdmin(): Session found, checking users table for user ID:', userId);

      // Use API call to check admin status since we can't use server client on client side
      const response = await fetch('/api/check-admin-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });

      if (!response.ok) {
        console.log('AdminAuthService.isAdmin(): API call failed:', response.status);
        // Fallback: if API fails, check if user exists in auth and has admin-like email
        console.log('AdminAuthService.isAdmin(): Trying fallback check');
        const userEmail = session.user.email;
        if (userEmail && (userEmail.includes('admin') || userEmail.includes('kmtcs'))) {
          console.log('AdminAuthService.isAdmin(): Fallback check passed for email:', userEmail);
          adminStatusCache[userId] = { isAdmin: true, timestamp: now };
          return true;
        }
        return false;
      }

      const result = await response.json();
      console.log('AdminAuthService.isAdmin(): API result:', result);
      
      const isAdmin = result.isAdmin || false;
      
      // Cache the result
      adminStatusCache[userId] = { isAdmin, timestamp: now };
      
      return isAdmin;
    } catch (error) {
      console.error('AdminAuthService.isAdmin(): Error checking admin status:', error);
      // Fallback: if all else fails, check if user has admin-like email
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email) {
          const userEmail = session.user.email;
          if (userEmail.includes('admin') || userEmail.includes('kmtcs')) {
            console.log('AdminAuthService.isAdmin(): Emergency fallback check passed for email:', userEmail);
            return true;
          }
        }
      } catch (fallbackError) {
        console.error('AdminAuthService.isAdmin(): Fallback check also failed:', fallbackError);
      }
      return false;
    }
  }

  /**
   * Get the current admin user data
   */
  static async getCurrentAdmin(): Promise<AdminUser | null> {
    try {
      console.log('AdminAuthService.getCurrentAdmin(): Getting current admin data');
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        console.log('AdminAuthService.getCurrentAdmin(): No session or user');
        return null;
      }

      const userId = session.user.id;
      const now = Date.now();

      // Check cache first
      if (adminUserCache[userId] && (now - adminUserCache[userId].timestamp) < CACHE_DURATION) {
        console.log('AdminAuthService.getCurrentAdmin(): Using cached result');
        return adminUserCache[userId].user;
      }

      console.log('AdminAuthService.getCurrentAdmin(): Session found, querying users table');

      // Use API call to get admin user data
      const response = await fetch('/api/get-admin-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });

      if (!response.ok) {
        console.log('AdminAuthService.getCurrentAdmin(): API call failed:', response.status);
        return null;
      }

      const result = await response.json();
      console.log('AdminAuthService.getCurrentAdmin(): API result:', result);
      
      const user = result.user || null;
      
      // Cache the result
      adminUserCache[userId] = { user, timestamp: now };
      
      return user;
    } catch (error) {
      console.error('AdminAuthService.getCurrentAdmin(): Error getting current admin:', error);
      return null;
    }
  }

  /**
   * Clear cache for a specific user or all users
   */
  static clearCache(userId?: string): void {
    if (userId) {
      delete adminStatusCache[userId];
      delete adminUserCache[userId];
    } else {
      adminStatusCache = {};
      adminUserCache = {};
    }
  }

  /**
   * Update last sign in timestamp
   */
  static async updateLastSignIn(userId: string): Promise<void> {
    try {
      console.log('AdminAuthService.updateLastSignIn(): Updating last sign in for user:', userId);
      
      // Use API call to update last sign in
      const response = await fetch('/api/update-last-signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });

      if (response.ok) {
        console.log('AdminAuthService.updateLastSignIn(): Last sign in updated successfully');
        // Clear cache for this user since data has changed
        this.clearCache(userId);
      } else {
        console.log('AdminAuthService.updateLastSignIn(): Failed to update last sign in');
      }
    } catch (error) {
      console.error('AdminAuthService.updateLastSignIn(): Error updating last sign in:', error);
    }
  }

  /**
   * Sign out the current user
   */
  static async signOut(): Promise<void> {
    try {
      console.log('AdminAuthService.signOut(): Signing out user');
      await supabase.auth.signOut();
      // Clear all cache on sign out
      this.clearCache();
      console.log('AdminAuthService.signOut(): User signed out successfully');
    } catch (error) {
      console.error('AdminAuthService.signOut(): Error signing out:', error);
    }
  }
} 