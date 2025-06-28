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
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        return false;
      }

      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .eq('role', 'admin')
        .single();

      if (error || !user) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }

  /**
   * Get the current admin user data
   */
  static async getCurrentAdmin(): Promise<AdminUser | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        return null;
      }

      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .eq('role', 'admin')
        .single();

      if (error || !user) {
        return null;
      }

      return user as AdminUser;
    } catch (error) {
      console.error('Error getting current admin:', error);
      return null;
    }
  }

  /**
   * Update last sign in timestamp
   */
  static async updateLastSignIn(userId: string): Promise<void> {
    try {
      await supabase
        .from('users')
        .update({ last_sign_in: new Date().toISOString() })
        .eq('id', userId);
    } catch (error) {
      console.error('Error updating last sign in:', error);
    }
  }

  /**
   * Sign out the current user
   */
  static async signOut(): Promise<void> {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }
} 