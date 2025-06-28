import { supabase } from './supabase';

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'editor';
  full_name: string | null;
  created_at: string;
  last_sign_in: string | null;
}

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

      console.log('AdminAuthService.isAdmin(): Session found, checking users table for user ID:', session.user.id);

      // Use API call to check admin status since we can't use server client on client side
      const response = await fetch('/api/check-admin-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: session.user.id })
      });

      if (!response.ok) {
        console.log('AdminAuthService.isAdmin(): API call failed:', response.status);
        return false;
      }

      const result = await response.json();
      console.log('AdminAuthService.isAdmin(): API result:', result);
      
      return result.isAdmin || false;
    } catch (error) {
      console.error('AdminAuthService.isAdmin(): Error checking admin status:', error);
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

      console.log('AdminAuthService.getCurrentAdmin(): Session found, querying users table');

      // Use API call to get admin user data
      const response = await fetch('/api/get-admin-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: session.user.id })
      });

      if (!response.ok) {
        console.log('AdminAuthService.getCurrentAdmin(): API call failed:', response.status);
        return null;
      }

      const result = await response.json();
      console.log('AdminAuthService.getCurrentAdmin(): API result:', result);
      
      return result.user || null;
    } catch (error) {
      console.error('AdminAuthService.getCurrentAdmin(): Error getting current admin:', error);
      return null;
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
      console.log('AdminAuthService.signOut(): User signed out successfully');
    } catch (error) {
      console.error('AdminAuthService.signOut(): Error signing out:', error);
    }
  }
} 